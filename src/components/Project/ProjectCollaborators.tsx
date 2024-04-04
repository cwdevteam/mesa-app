import { ProjectMetaDataTable } from '../ProjectMetaDataTable'
import { Button } from '../ui/button'
import ProjectInviteDialog from './ProjectInviteDialog'

export function ProjectCollaborators({
  project,
  user,
}: {
  project: ProjectType | null
  user: User
}) {
  return (
    <section className="grid mt-4 w-full gap-2">
      <div className="flex justify-between">
        <h3 className="text-lg font-bold tracking-tight">Collaborators</h3>
        <ProjectInviteDialog user={user} project={project}>
          <Button variant="outline" className="text-sm">
            + Add Collaborator
          </Button>
        </ProjectInviteDialog>
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
  )
}
