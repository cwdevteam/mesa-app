'use client'

import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

export type TimelineFile = { name: string; data: string; type: string }
export type TimelineFileEvent = {
  type: 'file'
  content: TimelineFile
  created_at: string
  user: {
    email: string
    username: string
  }
  user_id: string
}
export type TimelineTextEvent = {
  type: 'text'
  content: { data: string }
  created_at: string
  user: {
    email: string
    username: string
  }
  user_id: string
}
export type TimelineEvent = TimelineFileEvent | TimelineTextEvent
export type TimelineAction = { type: 'add' | 'init'; event: any }

function timelineReducer(state: TimelineEvent[], action: TimelineAction) {
  // console.log('DEBUG: timelineReducer(...)', { state, action })
  switch (action.type) {
    case 'add':
      return [...state, action.event]
    case 'init':
      return [...action.event]
    default:
      return state
  }
}

const TimelineContext = createContext<{
  state: TimelineEvent[]
  dispatch: React.Dispatch<TimelineAction>
}>({
  state: [],
  dispatch: () => undefined,
})

export function TimelineProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const initialState = [] as TimelineEvent[]

  const [state, dispatch] = useReducer(timelineReducer, initialState)

  // useEffect(() => {
  //   if (router.query?.id) {
  //     const intervalFunc = setInterval(() => {
  //       init(String(router.query.id))
  //     }, 5000)

  //     init(String(router.query.id))

  //     return () => clearInterval(intervalFunc)
  //   }
  // }, [router.query])

  const init = async (id: string) => {
    try {
      const { data } = await axios.post('/api/note/get', { id: id })

      dispatch({
        type: 'init',
        event: data.notes,
      })
    } catch (err) {
      dispatch({
        type: 'init',
        event: [] as any,
      })
    }
  }

  return (
    <TimelineContext.Provider value={{ state, dispatch }}>
      {children}
    </TimelineContext.Provider>
  )
}

export function useTimeline() {
  const context = useContext(TimelineContext)
  if (typeof context === 'undefined') {
    throw new Error('useTimeline must be used within a TimelineProvider')
  }
  return context
}
