import { ProjectDataTable } from '@/components/ProjectDataTable'
import CreateProjectDialog from '@/components/NewProjectButton/CreateProjectDialog'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthProvider'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Dashboard() {
  const { user } = useAuth()
  const [projectsByInvite, setProjectsByInvite] = useState<
    ProjectsByInviteProps[]
  >([])
  const [projectsByUser, setProjectsByUser] = useState<ProjectsByUserProps[]>(
    []
  )

  useEffect(() => {
    geProjects()
  }, [])

  const geProjects = async () => {
    try {
      const { data: projectUser } = await axios.post('/api/project_user/get')
      const { data: projectInvitation } = await axios.post(
        '/api/project_invitation/get'
      )

      setProjectsByInvite(projectInvitation.data)
      setProjectsByUser(projectUser.data)
    } catch (err) {
      console.log(err)
      setProjectsByInvite([])
      setProjectsByUser([])
    }
  }

  return (
    <main className="grid gap-10 container mx-auto py-10 content-start">
      <div className="flex justify-between gap-4">
        <h2 className="text-2xl font-semibold tracking-tight">Your Projects</h2>

        <CreateProjectDialog user={user}>
          <Button className="text-md px-4">{'New Project'}</Button>
        </CreateProjectDialog>
      </div>

      <ProjectDataTable
        projectsByInvite={projectsByInvite}
        projectsByUser={projectsByUser}
      />
    </main>
  )
}
