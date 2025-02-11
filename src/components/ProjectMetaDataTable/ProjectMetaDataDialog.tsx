import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
// import ProjectDetailsForm from './ProjectDetailsForm'
import ProjectMetaDataForm from '../Forms/ProjectMetaDataForm'

export interface ProjectMetaDataDialogProps
  extends React.HTMLAttributes<HTMLDivElement> {
  project?: ProjectType
  selectedUser?: ProjectUserProps
  request?: string
  roleId?: string
  open?: boolean
  setOpen?: (value: boolean) => void
}

export default function ProjectMetaDataDialog({
  project,
  selectedUser,
  open,
  request = 'create',
  setOpen,
  roleId,
  className,
  ...props
}: ProjectMetaDataDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={cn('grid gap-8 max-w-sm px-8 py-16', className)}
        {...props}
      >
        <DialogHeader>
          <DialogTitle>
            {request === 'create' ? 'Create' : 'Update'} Project Meta Data
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="max-w-full">
          {selectedUser && (
            <ProjectMetaDataForm
              request={request}
              project={project}
              selectedUser={selectedUser}
              roleId={roleId}
              onSubmit={() => setOpen && setOpen(false)}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
