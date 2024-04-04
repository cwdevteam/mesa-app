import { useRouter } from 'next/router'
import { useAuth } from '@/context/AuthProvider'
import { ProjectCollaborators } from '@/components/Project/ProjectCollaborators'
import ProjectDetailsCard from '@/components/Project/ProjectDetailsCard'
import ProjectTimeline from '@/components/Project/ProjectTimeline'
import { TimelineProvider } from '@/context/TimelineContext'
import UploadButton from '@/components/FileUpload'
import { MediaList } from '@/components/GlobalAudioPlayer/MediaList'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Project() {
  const { query }: any = useRouter()
  const { user } = useAuth()

  const [project, setProject] = useState<ProjectType | null>(null)
  const [medias, setMedias] = useState<MediaType[]>([])

  useEffect(() => {
    if (query?.id) {
      getProject()
      getMedias()
    }
  }, [query])

  const getProject = async () => {
    try {
      const { data } = await axios.post('/api/project/get', {
        id: query.id,
      })

      setProject(data.project)
    } catch (err) {
      setProject(null)
    }
  }

  const getMedias = async () => {
    try {
      const { data } = await axios.post('/api/project_upload/get', {
        id: query.id,
      })

      setMedias(data.media)
    } catch (err) {
      setMedias([])
    }
  }

  return (
    <TimelineProvider>
      <main className="grid grid-rows-[auto_minmax(0,1fr)] gap-6 container py-10 h-full">
        <ProjectDetailsCard project={project} />
        <div className="flex flex-row gap-8">
          <div className="flex-1 min-w-[400px]">
            <ProjectTimeline />
          </div>
          <div>
            <ProjectCollaborators user={user} project={project} />
            <UploadButton projectId={query.id} />

            <div className="py-5">
              <MediaList medias={medias} />
            </div>
          </div>
        </div>
      </main>
    </TimelineProvider>
  )
}
