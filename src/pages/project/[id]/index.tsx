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
import ProjectSignNavbar from '@/components/Project/ProjectSignNavbar'
import ProjectSignPdf from '@/components/Project/ProjectSignPdf'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import ContractHistoryTable from '@/components/ContractHistoryTable'

export default function Project() {
  const { query }: any = useRouter()
  const { user } = useAuth()

  const [project, setProject] = useState<ProjectType | null>(null)
  const [medias, setMedias] = useState<MediaType[]>([])
  const [contractId, setContractId] = useState<string | null>(null)
  const [tabContent, setTabContent] = useState<string>('project')
  const [contractTime, setContractTime] = useState<Date | null>(null)
  const [contractHistories, setContractHistories] = useState<
    IContractHistory[]
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

  const [isProjectView, setIsProjectView] = useState<boolean>(true)

  const onchange = async (b: boolean) => {
    await getProject()
    setIsProjectView(b)
    setTabContent(b ? 'project' : 'contract')
  }

  const downloadContractDoc = async () => {
    const data = {
      contractId,
    }
    try {
      const response = await axios.post('/api/contract/get', data)
      downloadPDF(response.data.document)
    } catch (e: any) {
      console.error(e.response)
    }
  }

  function downloadPDF(data: any) {
    // Create a Blob from the PDF Stream
    const byteArray = new Uint8Array(
      data.split('').map((char: string) => char.charCodeAt(0))
    )
    const blob = new Blob([byteArray], { type: 'application/pdf' })

    // // Create a link using the blob
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'sign.pdf' // Specify the download file name
    link.click()

    // // Clean up by revoking the Object URL
    window.URL.revokeObjectURL(url)
  }

  return (
    <TimelineProvider>
      {/* <ProjectSignNavbar project={project}> */}

      <main className="grid grid-rows-[auto_minmax(0,1fr)] gap-6 container py-10 h-full">
        <div className="flex mb-10 flex-row h-5">
          <Tabs defaultValue="project" value={tabContent}>
            <TabsList>
              <TabsTrigger value="project" onClick={() => onchange(true)}>
                Project
              </TabsTrigger>
              <TabsTrigger value="contract" onClick={() => onchange(false)}>
                Contract
              </TabsTrigger>
            </TabsList>
          </Tabs>
          {/* <div onClick={() => onchange(false)} className="m-5 cursor-pointer">
            Project
          </div>
          <div className="m-5 cursor-pointer" onClick={() => onchange(true)}>
            Contract
          </div> */}
        </div>
        {isProjectView ? (
          <div>
            <ProjectDetailsCard project={project} />
            <div className="flex flex-row gap-8">
              <div className="flex-1 min-w-[400px]">
                <ProjectTimeline projectId={project?.id} />
              </div>
              <div>
                <ProjectCollaborators
                  user={user}
                  project={project}
                  contractId={contractId}
                  setContractId={setContractId}
                  setIsProjectView={(isProjectView) => {
                    setIsProjectView(isProjectView)
                    setTabContent('contract')
                  }}
                />
                <UploadButton projectId={query.id} />

                <div className="py-5">
                  <MediaList medias={medias} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-center text-2xl font-bold">
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
                  Download Sign Document
                </Button>
                <div className="w-full flex justify-center max-w-3xl pt-6">
                  <ContractHistoryTable contractHistories={contractHistories} />
                </div>
              </div>
            ) : (
              <div className="text-center mt-5">
                Contract haven't started yet
              </div>
            )}

            {/* <ProjectSignPdf
              isOpen={isModalOpen}
              onClose={closeModal}
              user={user}
              project={project}
              contractId={contractId}
              setIsOpenContract={(b) => setIsOpenContract(b)}
            /> */}
          </div>
        )}
      </main>
    </TimelineProvider>
  )
}
