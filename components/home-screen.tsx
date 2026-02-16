"use client"

import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

interface HomeScreenProps {
  onOpenLLM: () => void
}

export function HomeScreen({ onOpenLLM }: HomeScreenProps) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[hsl(232,47%,8%)] via-[hsl(250,45%,12%)] to-[hsl(270,40%,10%)]">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
      </div>
      
      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600">
          <Sparkles className="h-10 w-10 text-foreground" />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Ascension System
          </h1>
          <p className="mt-2 text-muted-foreground">
            Начните работу с искусственным интеллектом
          </p>
        </div>
        <Button
          onClick={onOpenLLM}
          size="lg"
          className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-foreground hover:from-purple-500 hover:to-blue-500"
        >
          <Sparkles className="h-5 w-5" />
          Открыть LLM
        </Button>
      </div>
    </div>
  )
}
