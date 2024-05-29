import { ProjectMetaDataTable } from '../ProjectMetaDataTable'
import { Button } from '../ui/button'
import ProjectInviteDialog from './ProjectInviteDialog'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

import axios from 'axios'
import { Icons } from '../Icons'
import PopUp from './PopUp'

export function ProjectCollaborators({
  project,
  user,
  contractId,
  setContractId,
  setContractTime,
  onMakeContract: handleMakeContract,
}: {
  project?: ProjectType
  user: User
  contractId?: string
  setContractId: (contractId?: string) => void
  setContractTime: (contractTime: Date) => void
  onMakeContract: () => void
}) {
  return (
    <div>
      <section className="grid mt-4 w-full gap-2">
        <div className="flex justify-between">
          <h3 className="text-lg font-bold tracking-tight">Collaborators</h3>
          <div className="flex items-center gap-2">
            {!contractId ? (
              <PopUp
                project={project}
                setContractId={setContractId}
                setContractTime={setContractTime}
                onMakeContract={handleMakeContract}
              >
                <Button
                  className="text-sm rounded-full px-[13px] py-2 sm:rounded-md sm:px-4 sm:py-2"
                  variant="outline"
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
              </PopUp>
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
            data={(project?.projectUsers || []) as ProjectUserProps[]}
            invitations={project?.projectInvitations || []}
          />
        </div>
      </section>
    </div>
  )
}
