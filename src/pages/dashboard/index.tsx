import { ProjectDataTable } from '@/components/ProjectDataTable'
import CreateProjectDialog from '@/components/NewProjectButton/CreateProjectDialog'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthProvider'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import axios from 'axios'

export default function Dashboard() {
  const { user } = useAuth()
  const intl = useIntl()
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
      setProjectsByInvite([])
      setProjectsByUser([])
    }
  }

  return (
    <main className="grid gap-10 container mx-auto py-10 content-start">
      <div className="flex justify-between gap-4">
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-3xl font-semibold tracking-tight">
          {intl.formatMessage({ id: 'page.welcome' })}
        </h2>

        <CreateProjectDialog user={user}>
          <Button className="text-sm sm:text-md md:text-lg lg:text-lg px-1 sm:px-2 md:px-3 lg:px-4">
            {'New Project'}
          </Button>
        </CreateProjectDialog>
      </div>

      <ProjectDataTable
        projectsByInvite={projectsByInvite}
        projectsByUser={projectsByUser}
      />
    </main>
  )
}
