import { useRouter } from 'next/router'
import { useAuth } from '@/context/AuthProvider'
import { ProjectCollaborators } from '@/components/Project/ProjectCollaborators'
import ProjectDetailsCard from '@/components/Project/ProjectDetailsCard'
import ProjectTimeline from '@/components/Project/ProjectTimeline'
import { TimelineProvider } from '@/context/TimelineContext'
import UploadButton from '@/components/FileUpload'
import { MediaList } from '@/components/GlobalAudioPlayer/MediaList'
import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import ContractHistoryTable from '@/components/ContractHistoryTable'
import { ProjectSetting } from '@/components/Project/ProjectSetting'

export default function Project() {
  const { query }: any = useRouter()
  const { user } = useAuth()

  const [project, setProject] = useState<ProjectType | null>(null)
  const [medias, setMedias] = useState<MediaType[]>([])
  const [contractId, setContractId] = useState<string | null>(null)
  const [tabContent, setTabContent] = useState<
    'project' | 'contract' | 'setting'
  >('project')
  const [contractTime, setContractTime] = useState<Date | null>(null)
  const [contractHistories, setContractHistories] = useState<
    (ProjectContractHistoryProps & {
      projectUser: ProjectUserProps
    })[]
  >([])

  useEffect(() => {
    if (query?.id) {
      getProject()
      getMedias()
    }
  }, [query?.id])

  const getProject = async () => {
    try {
      const { data } = await axios.post('/api/project/get', {
        id: query.id,
      })

      setProject(data.project)
      const { contracts } = data.project
      if (!contracts || !contracts.length) {
        setContractId(null)
      } else {
        setContractId(contracts[0].id)
        setContractTime(contracts[0].created_at)
        setContractHistories(contracts[0].contractHistories)
      }
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

  const onTabChange = async (tab: 'project' | 'contract' | 'setting') => {
    await getProject()
    setTabContent(tab)
  }

  const downloadPDF = useCallback((data: any, project: any) => {
    // Create a Blob from the PDF Stream
    const byteArray = new Uint8Array(
      data.split('').map((char: string) => char.charCodeAt(0))
    )

    const blob = new Blob([byteArray], { type: 'application/pdf' })

    // Create a link using the blob
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${project.title}(${project.created_at}).pdf`
    link.click()

    // Clean up by revoking the Object URL
    window.URL.revokeObjectURL(url)
  }, [])

  const downloadContractDoc = useCallback(async () => {
    const data = {
      contractId,
    }
    try {
      const response = await axios.post('/api/contract/get', data)
      downloadPDF(response.data.document, response.data.project)
    } catch (e: any) {
      console.error(e.response)
    }
  }, [contractId, downloadPDF])

  return (
    <TimelineProvider>
      <main className="container flex flex-col gap-6 py-10 items-center lg:items-start w-full">
        <div className="mb-10 h-5">
          <Tabs defaultValue="project" value={tabContent}>
            <TabsList>
              <TabsTrigger
                value="project"
                onClick={() => onTabChange('project')}
              >
                Project
              </TabsTrigger>
              <TabsTrigger
                value="contract"
                onClick={() => onTabChange('contract')}
              >
                Contract
              </TabsTrigger>
              <TabsTrigger
                value="setting"
                onClick={() => onTabChange('setting')}
              >
                Setting
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        {tabContent === 'project' ? (
          <div className="flex flex-col items-center lg:items-start gap-2 w-full">
            <ProjectDetailsCard project={project} />
            <div className="flex flex-col lg:flex-row-reverse gap-8 w-full">
              <div className="flex-1">
                <ProjectCollaborators
                  user={user}
                  project={project}
                  contractId={contractId}
                  setContractId={setContractId}
                  setContractTime={setContractTime}
                  onMakeContract={() => setTabContent('contract')}
                />
                <UploadButton projectId={query.id} />

                <div className="py-5">
                  <MediaList medias={medias} />
                </div>
              </div>
              <div className="w-full lg:max-w-[400px]">
                <ProjectTimeline projectId={project?.id} />
              </div>
            </div>
          </div>
        ) : tabContent === 'contract' ? (
          <div className="w-full">
            <div className="text-center text-2xl font-bold w-full">
              {project?.title}
            </div>
            <div className="text-center">{project?.description}</div>
            {contractId ? (
              <div className="flex flex-col justify-center pt-10 items-center gap-4">
                <span>
                  Contract created at{' '}
                  <span className="font-bold">
                    {contractTime && new Date(contractTime).toLocaleString()}{' '}
                  </span>
                </span>
                <Button onClick={downloadContractDoc}>
                  Download Signed Document
                </Button>
                <div className="w-full flex justify-center max-w-3xl pt-6">
                  <ContractHistoryTable contractHistories={contractHistories} />
                </div>
              </div>
            ) : (
              <div className="text-center mt-5">
                Contract have not started yet
              </div>
            )}
          </div>
        ) : (
          <ProjectSetting />
        )}
      </main>
    </TimelineProvider>
  )
}
