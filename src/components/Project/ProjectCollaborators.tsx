import { ProjectMetaDataTable } from '../ProjectMetaDataTable'
import { Button } from '../ui/button'
import ProjectInviteDialog from './ProjectInviteDialog'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

import axios from 'axios'
import { Icons } from '../Icons'

export function ProjectCollaborators({
  project,
  user,
  contractId,
  setContractId,
  setContractTime,
  onMakeContract: handleMakeContract,
}: {
  project: ProjectType | null
  user: User
  contractId: string | null
  setContractId: (contractId: string | null) => void
  setContractTime: (contractTime: Date) => void
  onMakeContract: () => void
}) {
  const [isLoadingContract, setIsLoadingContract] = useState<boolean>(false)

  const onMakeContract = async () => {
    const data = {
      projectId: project?.id,
    }
    try {
      setIsLoadingContract(true)
      const response = await axios.post('/api/contract/new', data)
      const { contractId, contractTime } = response.data
      setContractId(contractId)
      handleMakeContract()
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
            {!contractId ? (
              isLoadingContract ? (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span className="hidden sm:block ml-1">Please wait</span>
                </Button>
              ) : (
                <Button
                  onClick={onMakeContract}
                  className="text-sm rounded-full p-[6px] sm:rounded-md sm:px-4 sm:py-2"
                >
                  <Icons.contract
                    style={{
                      width: '20px',
                      fill: '#FFF',
                      marginLeft: 5,
                    }}
                  />{' '}
                  <span className="hidden sm:block ml-1">Make Contract</span>
                </Button>
              )
            ) : null}
            <ProjectInviteDialog user={user} project={project}>
              <Button
                variant="outline"
                className="text-sm rounded-full px-[13px] py-2 sm:rounded-md sm:px-4 sm:py-2"
              >
                +<span className="hidden sm:block">&nbsp;Add Collaborator</span>
              </Button>
            </ProjectInviteDialog>
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
