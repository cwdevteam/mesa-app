import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import ProjectDetailsForm from '../Project/ProjectDetailsForm'

type CreateProjectDialogProps = React.HTMLAttributes<HTMLDivElement> & {
  user: User
}

export default function CreateProjectDialog({
  user,
  children,
  className,
  ...props
}: CreateProjectDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className={cn('grid gap-8 max-w-sm px-8 py-16', className)}
        {...props}
      >
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            A repository contains all project files, including the revision
            history. Already have a project repository elsewhere?
          </DialogDescription>
        </DialogHeader>
        <div className="max-w-full">
          <ProjectDetailsForm />
        </div>
      </DialogContent>
    </Dialog>
  )
}
