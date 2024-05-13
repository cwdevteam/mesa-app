import Link from 'next/link'
import { ProjectMetaDataTable } from '../ProjectMetaDataTable'
import { Button } from '../ui/button'
import ProjectInviteDialog from './ProjectInviteDialog'
import { Icons } from '@/components/Icons'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

import axios from 'axios'

export function ProjectCollaborators({
  project,
  user,
  contractId,
  setContractId,
  setIsProjectView,
  setContractTime
}: {
  project: ProjectType | null
  user: User
  contractId: string | null
  setContractId: (contractId: string | null) => void
  setIsProjectView: (isProjectView: boolean) => void
  setContractTime: (contractTime: Date) => void
}) {
  const { locale } = useRouter()
  const router = useRouter()
  const [isLoadingContract, setIsLoadingContract] = useState<boolean>(false)

  const onMakeContract = async () => {
    const data = {
      projectId: project?.id,
    }
    try {
      setIsLoadingContract(true)
      const response = await axios.post('/api/contract/new', data)
      const {contractId, contractTime} = response.data
      setContractId(contractId)
      setIsProjectView(false)
      setContractTime(contractTime)
      // router.push(`/contract/${contractId}`)
    } catch (e: any) {
      console.error(e.response.data)
    } finally {
      setIsLoadingContract(false)
    }
  }

  const [pdfPath, setPdfPath] = useState('')

  return (
    <div>
      <section className="grid mt-4 w-full gap-2">
        <div className="flex justify-between">
          <h3 className="text-lg font-bold tracking-tight">Collaborators</h3>
          <div className="flex items-center gap-2">
            {/* <button
              type="button"
              onClick={openModal}
              className="btn m-1 mx-3 py-1 px-2 font-bold border border-rgb-38-38-38 rounded-sm hover:bg-rgb-38-38-38"
            >
              Sign
            </button> */}
            {!contractId ? (
              isLoadingContract ? (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button onClick={onMakeContract}>Make Contract</Button>
              )
            ) : null}
            <ProjectInviteDialog user={user} project={project}>
              <Button variant="outline" className="text-sm">
                + Add Collaborator
              </Button>
            </ProjectInviteDialog>
            {user.id === project?.created_by ? (
              <Link href={`/${locale}/project/setting/${project?.id}`}>
                <Button variant="outline" className="text-sm">
                  <Icons.setting />
                </Button>
              </Link>
            ) : null}
          </div>
        </div>
        <div className="flex flex-wrap overflow-auto text-muted-foreground text-xs">
          <ProjectMetaDataTable
            project={project}
            user={user}
            data={project?.projectUsers || []}
            invitations={project?.projectInvitations || []}
          />
        </div>
      </section>
    </div>
  )
}
