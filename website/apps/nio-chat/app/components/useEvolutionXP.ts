// NioBot V3 — Observer hook: watches ChatProvider state, awards XP to EvolutionProvider
// Zero changes to ChatProvider. Pure observation via useEffect.

'use client'

import { useEffect, useRef } from 'react'
import { useChatContext } from './ChatProvider'
import { useEvolutionContext } from './EvolutionProvider'
import {
  XP_MESSAGE_SENT,
  XP_RESPONSE_RECEIVED,
  XP_DEEP_CONVERSATION,
  XP_VERY_DEEP_CONVERSATION,
  XP_AGENT_SWITCH,
  XP_DAILY_FIRST_MESSAGE,
  getStreakMultiplier,
  getSkillForAgent,
  getToday,
} from '../../lib/evolution'

export function useEvolutionXP() {
  const { state: chatState } = useChatContext()
  const { state: evoState, dispatch: evoDispatch, addXP } = useEvolutionContext()

  const prevState = useRef({
    isStreaming: false,
    isWaiting: false,
    activeAgentId: chatState.activeAgentId,
    messageCount: 0,
  })

  useEffect(() => {
    if (!chatState.initialized || !evoState.initialized) return

    const prev = prevState.current
    const currentMessages = chatState.agentStates[chatState.activeAgentId]?.messages || []
    const messageCount = currentMessages.length
    const skill = getSkillForAgent(chatState.activeAgentId)
    const skillId = skill?.id
    const multiplier = getStreakMultiplier(evoState.streak)

    // messageSent: user just sent a message
    if (chatState.isStreaming && chatState.isWaiting && !prev.isStreaming) {
      const xp = Math.round(XP_MESSAGE_SENT * multiplier)
      addXP(xp, 'message sent', skillId)

      // Daily first message bonus
      if (!evoState.dailyBonusClaimed) {
        const today = getToday()
        const bonus = Math.round(XP_DAILY_FIRST_MESSAGE * multiplier)
        addXP(bonus, 'daily bonus', skillId)
        evoDispatch({ type: 'CLAIM_DAILY_BONUS' })

        // Update last active date and streak
        if (evoState.lastActiveDate !== today) {
          // Streak already calculated on init, just update the date
          evoDispatch({
            type: 'INIT',
            state: {
              lastActiveDate: today,
              streak: evoState.streak || 1,
            },
          })
        }
      }
    }

    // streamDone: response finished
    if (!chatState.isStreaming && prev.isStreaming) {
      const lastMsg = currentMessages[messageCount - 1]
      // Only award XP for successful responses (not errors)
      if (lastMsg?.role === 'assistant' && !lastMsg.content.startsWith('error:')) {
        const xp = Math.round(XP_RESPONSE_RECEIVED * multiplier)
        addXP(xp, 'response received', skillId)
      }

      // Deep conversation bonuses (count user messages only)
      const userMsgCount = currentMessages.filter(m => m.role === 'user').length

      if (userMsgCount >= 10 && !evoState.veryDeepConvoClaimed) {
        const xp = Math.round(XP_VERY_DEEP_CONVERSATION * multiplier)
        addXP(xp, 'deep session (10+)', skillId)
        evoDispatch({ type: 'CLAIM_VERY_DEEP_CONVO' })
      } else if (userMsgCount >= 5 && !evoState.deepConvoClaimed) {
        const xp = Math.round(XP_DEEP_CONVERSATION * multiplier)
        addXP(xp, 'deep session (5+)', skillId)
        evoDispatch({ type: 'CLAIM_DEEP_CONVO' })
      }
    }

    // agentSwitch
    if (chatState.activeAgentId !== prev.activeAgentId) {
      const newSkill = getSkillForAgent(chatState.activeAgentId)
      const xp = Math.round(XP_AGENT_SWITCH * multiplier)
      addXP(xp, 'agent switch', newSkill?.id)
    }

    prevState.current = {
      isStreaming: chatState.isStreaming,
      isWaiting: chatState.isWaiting,
      activeAgentId: chatState.activeAgentId,
      messageCount,
    }
  }, [chatState, evoState.initialized, evoState.dailyBonusClaimed, evoState.deepConvoClaimed, evoState.veryDeepConvoClaimed, evoState.streak, evoState.lastActiveDate, addXP, evoDispatch])
}
