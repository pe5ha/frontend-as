"use client"

import { useState } from "react"
import { HomeScreen } from "@/components/home-screen"
import { LLMScreen } from "@/components/llm-screen"

type Screen = "home" | "llm"

export default function Page() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home")

  if (currentScreen === "llm") {
    return <LLMScreen onBack={() => setCurrentScreen("home")} />
  }

  return <HomeScreen onOpenLLM={() => setCurrentScreen("llm")} />
}
