'use client'

import { FilePlusIcon, ReloadIcon } from '@radix-ui/react-icons'
import { Button } from '../ui/button'
import { useTimeline } from '@/context/TimelineContext'

import React, { useState } from 'react'
import { toast } from '../ui/use-toast'
import { useAuth } from '@/context/AuthProvider'

export default function FileButton({
  projectId,
}: {
  projectId: string | undefined
}) {
  const { user } = useAuth()
  const { dispatch } = useTimeline()
  const [loading, setLoading] = useState<boolean>(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files ? e.target.files[0] : null
      if (file) {
        setLoading(true)
        const formData = new FormData()
        formData.append('file', file)
        formData.append('projectId', projectId || '')

        const response = await fetch('/api/note/upload', {
          method: 'POST',
          body: formData,
        })

        const data = await response.json()

        if (data && data.content) {
          dispatch({
            type: 'add',
            event: {
              type: 'file',
              content: data.content,
              created_at: new Date(),
              user: {
                email: user.email,
                username: user.username,
              },
            },
          })
        }

        setLoading(false)
      }
    } catch (err: any) {
      setLoading(false)
      toast({
        title: 'Error',
        description: 'Error while connecting server',
        variant: 'destructive',
      })
    }
  }

  return (
    <div>
      {loading ? (
        <Button size="icon" className="rounded-full">
          <ReloadIcon className="animate-spin h-4 w-4" />
        </Button>
      ) : (
        <Button
          size="icon"
          className="rounded-full"
          onClick={() => document.getElementById('fileInput')?.click()}
        >
          <FilePlusIcon className="h-4 w-4" />
        </Button>
      )}
      <input
        type="file"
        id="fileInput"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  )
}
