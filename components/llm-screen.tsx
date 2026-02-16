"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Send, Mic, X, Square, Trash2, Bot, User } from "lucide-react"
import { cn } from "@/lib/utils"

type TabType = "task" | "goal" | "value"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

interface LLMScreenProps {
  onBack: () => void
}

const tabs: { id: TabType; label: string }[] = [
  { id: "task", label: "Задача" },
  { id: "goal", label: "Цель" },
  { id: "value", label: "Ценность" },
]

export function LLMScreen({ onBack }: LLMScreenProps) {
  const [activeTab, setActiveTab] = useState<TabType>("task")
  const [text, setText] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const recordingInterval = useRef<NodeJS.Timeout | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleStartRecording = () => {
    setIsRecording(true)
    setRecordingTime(0)
    recordingInterval.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1)
    }, 1000)
  }

  const handleStopRecording = () => {
    setIsRecording(false)
    if (recordingInterval.current) {
      clearInterval(recordingInterval.current)
      recordingInterval.current = null
    }
    setText((prev) => prev + (prev ? " " : "") + "[Голосовое сообщение]")
  }

  const handleCancelRecording = () => {
    setIsRecording(false)
    setRecordingTime(0)
    if (recordingInterval.current) {
      clearInterval(recordingInterval.current)
      recordingInterval.current = null
    }
  }

  const handleClearText = () => {
    setText("")
  }

  const handleSend = () => {
    if (!text.trim()) return


    const userMessage: Message = {
      id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      role: "user",
      content: text.trim(),
    }

    const assistantMessage: Message = {
      id: `assistant-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      role: "assistant",
      content: text.trim(),
    }

    setMessages((prev) => [...prev, userMessage, assistantMessage])
    setText("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-[hsl(232,47%,8%)] via-[hsl(250,45%,12%)] to-[hsl(270,40%,10%)]">
      {/* Header */}
      <header className="flex shrink-0 items-center gap-4 border-b border-border px-4 py-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Назад</span>
        </Button>
        <h1 className="text-lg font-medium text-foreground">LLM Assistant</h1>
      </header>

      {/* Tabs */}
      <div className="shrink-0 border-b border-border">
        <nav className="flex gap-1 px-4 py-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "bg-gradient-to-r from-purple-600/30 to-blue-600/30 text-foreground border border-purple-500/30"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground border border-transparent"
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-muted-foreground">
              {activeTab === "task" && "Опишите задачу, которую нужно решить..."}
              {activeTab === "goal" && "Укажите цель, которую хотите достичь..."}
              {activeTab === "value" && "Определите ценность результата..."}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-end gap-2",
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                {/* Avatar */}
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                    message.role === "user"
                      ? "bg-gradient-to-br from-purple-600 to-blue-600"
                      : "bg-secondary"
                  )}
                >
                  {message.role === "user" ? (
                    <User className="h-4 w-4 text-foreground" />
                  ) : (
                    <Bot className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                    message.role === "user"
                      ? "rounded-br-md bg-gradient-to-r from-purple-600 to-blue-600 text-foreground"
                      : "rounded-bl-md border border-border bg-card/80 text-foreground backdrop-blur-sm"
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="shrink-0 border-t border-border p-4">
        {isRecording ? (
          <div className="flex items-center justify-between rounded-xl border border-border bg-card/80 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/20">
                <div className="h-3 w-3 animate-pulse rounded-full bg-destructive" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Запись голосового сообщения
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatTime(recordingTime)}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCancelRecording}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Отменить запись</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleStopRecording}
                className="text-purple-400 hover:text-purple-300"
              >
                <Square className="h-5 w-5" />
                <span className="sr-only">Остановить запись</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="relative flex items-end gap-2 rounded-xl border border-border bg-card/80 p-3 backdrop-blur-sm">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Введите текст..."
              rows={1}
              className="min-h-[48px] max-h-[200px] flex-1 resize-none border-0 bg-transparent p-0 text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <div className="flex items-center gap-1">
              {text && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClearText}
                  className="h-10 w-10 shrink-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-5 w-5" />
                  <span className="sr-only">Очистить текст</span>
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleStartRecording}
                className="h-10 w-10 shrink-0 text-muted-foreground hover:text-purple-400"
              >
                <Mic className="h-5 w-5" />
                <span className="sr-only">Голосовой ввод</span>
              </Button>
              <Button
                size="icon"
                onClick={handleSend}
                disabled={!text.trim()}
                className="h-10 w-10 shrink-0 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-foreground hover:from-purple-500 hover:to-blue-500 disabled:opacity-50"
              >
                <Send className="h-5 w-5" />
                <span className="sr-only">Отправить</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
