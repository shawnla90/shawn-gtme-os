"use client"

import { ChatWidget } from "@shawnos/shared/components"

export function NioChat() {
  return (
    <ChatWidget
      botName="Nio"
      botSubtitle="shawnos.ai assistant"
      welcomeMessage="hey - i'm nio. i live inside this monorepo and know everything about context engineering, GTM engineering, and how shawn builds in public. what's up?"
      suggestedQuestions={[
        "What is context engineering?",
        "How does the monorepo work?",
        "What tools does Shawn use?",
      ]}
      placeholder="ask nio anything..."
      accentColor="#4EC373"
      botId="nio"
      ctaUrl="https://cal.com/shawntenam/30min"
      ctaLabel="Book a Call"
    />
  )
}
