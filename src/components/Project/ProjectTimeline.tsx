'use client'

import React from 'react'
import axios from 'axios'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import {
  TimelineEvent,
  TimelineFile,
  TimelineFileEvent,
  TimelineTextEvent,
  useTimeline,
} from '@/context/TimelineContext'
import FileButton from '../FileUpload/FileButton'
import FilePreview from '../FileUpload/FilePreview'
import { toast } from '../ui/use-toast'
import { useAuth } from '@/context/AuthProvider'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

function renderEventContent(event: TimelineEvent) {
  if (event.type === 'file') {
    const fileEvent = event as TimelineFileEvent
    return <FilePreview file={fileEvent.content} />
  }

  if (event.type === 'text') {
    const textEvent = event as TimelineTextEvent
    return <p className="text-wrap break-all">{textEvent.content.data}</p>
  }

  return null
}

export default function ProjectTimeline({
  projectId,
}: {
  projectId: string | undefined
}) {
  const { user } = useAuth()
  const chatBoxRef = React.useRef(null)
  // Get data from the useTimeline hook
  const { state: events, dispatch } = useTimeline()

  React.useEffect(() => {
    scrollToBottom()
  }, [])

  const scrollToBottom = () => {
    const chatBox: any = chatBoxRef.current
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight
    }
  }

  const handleSubmitText = async (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    try {
      if (
        e.key === 'Enter' &&
        e.shiftKey === false &&
        e.currentTarget.value.trim() !== '' &&
        projectId
      ) {
        e.preventDefault()
        const content = e.currentTarget.value
        dispatch({
          type: 'add',
          event: {
            type: 'text',
            content: content,
            created_at: new Date(),
            user: {
              email: user.email,
              username: user.username,
            },
          },
        })
        e.currentTarget.value = ''

        // send content to server
        await axios
          .post('/api/note/add', {
            type: 'text',
            content: content.trim(),
            projectId: projectId,
            userId: user.id,
          })
          .then((res) => console.log({ res }))
          .catch((error) => console.log(error))

        scrollToBottom()
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Error while connecting server',
        variant: 'destructive',
      })
    }
  }

  return (
    <div
      className="relative grid grid-rows-[1fr_auto] gap-6 max-h-[600px] bg-muted rounded-lg w-full h-full overflow-auto"
      ref={chatBoxRef}
    >
      {/* Timeline events */}
      <div className="grid content-start gap-4 p-6">
        {events.map((event, index: number) => (
          <Card
            className={cn(
              event.user === null
                ? 'flex justify-center items-center mx-12'
                : event.user?.email === user.email
                  ? 'rounded-2xl max-w-fit !rounded-br place-self-end'
                  : 'rounded-2xl max-w-fit !rounded-bl place-self-start bg-gray-300 dark:bg-zinc-900'
            )}
            key={`chat-${index}`}
          >
            <CardContent
              className={cn(
                event.user !== null
                  ? '!p-4 min-w-20 !pb-1'
                  : 'text-base p-1 px-3 text-center'
              )}
            >
              {String(event.content)}
            </CardContent>
            {String(event.type) !== null && event.user_id !== null ? (
              <CardFooter
                className={cn(
                  'flex items-center p-2',
                  event.user?.email === user.email
                    ? 'justify-end'
                    : 'justify-start'
                )}
              >
                <CardTitle className="text-xs">
                  {event.user?.email !== user.email ? (
                    <div className="flex items-center">
                      {format(event?.created_at, 'HH:mm') +
                        '<--' +
                        event.user.username}
                    </div>
                  ) : (
                    format(event?.created_at, 'HH:mm')
                  )}
                </CardTitle>
              </CardFooter>
            ) : (
              <></>
            )}
          </Card>
        ))}
      </div>

      {/* Timeline inputs */}
      <div className="sticky bottom-0 flex justify-center items-center gap-4 p-6 rounded-lg bg-muted">
        {/* <FileButton projectId={projectId} /> */}
        <Textarea
          placeholder="Add a note..."
          className="flex-1 bg-background text-foreground rounded-2xl resize-none p-4"
          onKeyDown={handleSubmitText}
        />
      </div>
    </div>
  )
}
