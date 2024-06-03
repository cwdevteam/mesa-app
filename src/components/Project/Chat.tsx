import { useAuth } from '@/context/AuthProvider'
import { useState, useEffect, useRef, KeyboardEvent, FormEvent } from 'react'
import io from 'socket.io-client'
import Picker, { EmojiClickData } from 'emoji-picker-react'
import { FaceSmileIcon } from '@heroicons/react/24/outline'
import axios from 'axios'
import { Icons } from '../Icons'
import UserAvatar from './UserAvatar'

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!)

type ChatProps = {
  project?: ProjectType
}

type Message = {
  sender: string
  message: string
  timestamp: Date
}

function Chat({ project }: ChatProps) {
  const [message, setMessage] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([])
  const [room, setRoom] = useState<string>('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const { user, setUser } = useAuth()
  const messageContainerRef = useRef<HTMLDivElement>(null)
  const [unreadMessages, setUnreadMessages] = useState(0)
  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }

  const scrollRef = useRef<any>()

  useEffect(() => {
    ;(async () => {
      const { data } = await axios.post('/api/note/get', {
        id: String(project?.id),
      })
      if (data) {
        const sortedNotes = data.notes.sort(
          (a: any, b: any) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
        sortedNotes.forEach((i: any) => {
          setMessages((prev) => [
            ...prev,
            {
              sender: i.user ? i.user.username : 'server',
              message: i.content,
              timestamp: i.created_at,
            },
          ])
          setUnreadMessages((prevCount) => prevCount + 1)
        })
      }
    })()
  }, [project])

  useEffect(() => {
    scrollRef.current?.scrollIntoView()
  }, [showEmojiPicker])

  useEffect(() => {
    setRoom(String(project?.id))
    socket.emit('joinRoom', room)

    socket.on('message', ({ message, sender, timestamp }) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender, message, timestamp },
      ])
      if (sender === user.username) {
        const container = messageContainerRef.current
        if (container) {
          container.scrollTo({
            top: container.scrollHeight + 3000,
            behavior: 'smooth',
          })
        }
      }
    })

    return () => {
      socket.off('message')
    }
  }, [room, project, user.username])

  const sendMessage = async (e: any) => {
    e.preventDefault()
    let username = user.username
    setRoom(String(project?.id))
    if (message.trim()) {
      const timestamp = Date.now()
      socket.emit('message', { room, message, username, timestamp })
      const addNote = await axios
        .post('/api/note/add', {
          type: 'text',
          content: message.trim(),
          projectId: String(project?.id),
          userId: user.id,
        })
        .then((res) => {
          console.log({ res })
          setMessage('')
        })
        .catch((error) => console.log(error))
    }
  }

  const handleEmojiClick = (emojiObject: EmojiClickData, event: MouseEvent) => {
    let emoji = emojiObject.emoji

    setMessage((prev) => (prev ? prev + emoji : '' + emoji))
    setShowEmojiPicker(!showEmojiPicker)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(e as unknown as FormEvent)
    }
  }

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow h-[37rem]">
      <div className="space-y-1.5 p-6 flex flex-row justify-center items-center"></div>
      <div
        className="px-4 py-8 h-[78%] overflow-y-auto relative style={{ height: '400px' }}"
        ref={messageContainerRef}
        // onScroll={handleScroll}
      >
        <div className="flex flex-col gap-3">
          <div className="flex">
            <div className="flex flex-col w-full">
              {messages.map((msg: any, index: any) => (
                <div key={index} className="flex flex-col items-start">
                  <div
                    className={`flex w-full ${msg.sender === user.username ? 'flex-col' : 'flex-row h-10'}`}
                  >
                    <div
                      className={`flex break-words overflow-hidden ${
                        msg.sender === user.username
                          ? 'flex-row justify-end w-full'
                          : msg.sender === 'server'
                            ? 'flex justify-center items-center w-full'
                            : 'justify-start flex-row w-full'
                      }`}
                    >
                      {user.username !== msg.sender &&
                        msg.sender !== 'server' && (
                          <UserAvatar
                            user={
                              project?.projectUsers.find(
                                (pU) => pU.user_name === msg.sender
                              )?.user!
                            }
                          />
                        )}
                      <div
                        className={
                          msg.sender === user.username
                            ? 'flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm ml-auto bg-primary text-primary-foreground'
                            : msg.sender === 'server'
                              ? 'text-xs sm:text-sm lg:text-sm py-2 px-2 sm:py-3 sm:px-4 border overflow-hidden break-words rounded-md text-center flex justify-center items-center'
                              : 'flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm mr-auto text-ellipsis bg-muted'
                        }
                      >
                        {msg.message}
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      msg.sender === user.username
                        ? 'flex justify-end w-full mb-4 pr-1'
                        : msg.sender === 'server'
                          ? 'flex justify-center items-center w-full'
                          : 'flex justify-start w-full mb-4 pl-1'
                    }
                  >
                    <span className="text-gray-500 justify-end text-xs">
                      {new Date(msg.timestamp).toLocaleTimeString(
                        'en-US',
                        options
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* {unreadMessages !== 0 ? (
        <div className=" absolute right-6">
          <button
            type="button"
            className="relative inline-flex items-center p-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <Icons.unreadMessage />
            <span className="sr-only">Notifications</span>
            <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2 dark:border-gray-900">
              {unreadMessages}
            </div>
          </button>
        </div>
      ) : (
        <></>
      )} */}
      {showEmojiPicker && (
        <div className="absolute bottom-0 left-40 z-50">
          <Picker onEmojiClick={handleEmojiClick} />
        </div>
      )}

      <div ref={scrollRef} className="flex items-center p-6 pt-3">
        <div className="flex flex-row w-full">
          <div className="flex justify-center items-center">
            <button
              onClick={(e) => {
                e.preventDefault()
                setShowEmojiPicker(!showEmojiPicker)
              }}
            >
              <FaceSmileIcon
                className="h-7 w-7 text-gray-600 dark:text-gray-500"
                aria-hidden="true"
              />
            </button>
          </div>
          <form onSubmit={sendMessage} className="w-full">
            <div className="flex items-center justify-between">
              <textarea
                className="flex mx-4 h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 flex-1"
                name="text"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={3}
              />
              <button
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 w-9"
                type="submit"
              >
                <Icons.arrow />
                <span className="sr-only">Send</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Chat
