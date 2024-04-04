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

export default function ProjectMetaDataDialog({
  user,
  data,
  open,
  setOpen,
  className,
  ...props
}: any) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={cn('grid gap-8 max-w-sm px-8 py-16', className)}
        {...props}
      >
        <DialogHeader>
          <DialogTitle>Update Project Meta Data</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="max-w-full">
          <ProjectMetaDataForm
            user={user}
            data={data}
            onSubmit={() => setOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
