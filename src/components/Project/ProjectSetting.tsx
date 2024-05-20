import { Button } from '../ui/button'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { ReloadIcon } from '@radix-ui/react-icons'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '../ui/use-toast'

export function ProjectSetting() {
  const router = useRouter()

  const [loading, setLoading] = useState<boolean>(false)
  const [projectData, setProjectData] = useState<{
    id: string
    name: string
    desc: string
  }>({ id: '', name: '', desc: '' })

  const handleUpdate = async () => {
    try {
      if (
        !projectData.name ||
        projectData.name.trim() === '' ||
        !projectData.desc ||
        projectData.desc.trim() === ''
      ) {
        return
      }

      setLoading(true)

      const { data } = await axios.post('/api/project/update', {
        data: projectData,
      })

      if (data && data.status) {
        toast({
          title: 'Success',
          description: 'Successfully updated',
          variant: 'default',
        })
      }
      setLoading(false)
    } catch (err) {
      toast({
        title: 'Failed project update',
        description: 'Something went wrong!',
        variant: 'destructive',
      })
      setLoading(false)
    }
  }

  const handleRemove = async () => {
    try {
      setLoading(true)

      const { data } = await axios.post('/api/project/delete', {
        id: router.query.id,
      })

      if (data && data.status) {
        toast({
          title: 'Success',
          description: 'Successfully deleted',
          variant: 'default',
        })
        router.push(`/${router.locale}/dashboard`)
      }
      setLoading(false)
    } catch (err) {
      toast({
        title: 'Failed project delete',
        description: 'Something went wrong!',
        variant: 'destructive',
      })
      setLoading(false)
    }
  }

  useEffect(() => {
    if (router.query?.id) {
      getProjectData()
    }
  }, [router.query])

  const getProjectData = async () => {
    try {
      const { data } = await axios.post('/api/project/get', {
        id: router.query.id,
      })

      if (data && data.project) {
        setProjectData({
          id: data.project.id,
          name: data.project.title,
          desc: data.project.description,
        })
      }
    } catch (err) {
      setProjectData({
        id: '',
        name: '',
        desc: '',
      })
    }
  }

  return (
    <main className="container py-10 mx-auto max-w-5xl">
      <div className="flex flex-col justify-center gap-5 max-w-[300px] -mt-9">
        <div>
          <label htmlFor="project_name" className="text-sm">
            Project Name
          </label>
          <Input
            id="project_name"
            name="name"
            onChange={(e) =>
              setProjectData({
                ...projectData,
                [e.target.name]: e.target.value,
              })
            }
            value={projectData.name}
          />
        </div>
        <div>
          <label htmlFor="project_desc" className="text-sm">
            Project Description
          </label>
          <Textarea
            id="project_desc"
            name="desc"
            onChange={(e) =>
              setProjectData({
                ...projectData,
                [e.target.name]: e.target.value,
              })
            }
            value={projectData.desc}
          />
        </div>
        {loading ? (
          <Button size="icon" className="w-full">
            <ReloadIcon color="currentColor" className="h-4 w-4 animate-spin" />
            Updating...
          </Button>
        ) : (
          <Button className="w-full" onClick={handleUpdate}>
            Update
          </Button>
        )}
      </div>
      <div className="flex flex-col justify-center gap-5 py-10">
        <div className="text-2xl font-bold tracking-tight">Danger Zone</div>
        <div className="border-[1px] border-red-400 flex flex-col justify-center rounded-lg">
          <div className="flex items-center justify-between p-5 flex-wrap">
            <div>
              <h6 className="text-sm font-semibold">Delete this project</h6>
              <p className="text-sm">
                Once you delete a project, there is no going back, Please be
                certain.
              </p>
            </div>
            {loading ? (
              <Button
                size="icon"
                className="w-auto px-5 cursor-default"
                variant={'default'}
              >
                <ReloadIcon
                  color="currentColor"
                  className="h-4 w-4 animate-spin mr-3"
                />
                Deleting...
              </Button>
            ) : (
              <Button
                className="text-red-500 hover:bg-red-500 hover:text-white"
                variant={'default'}
                onClick={handleRemove}
              >
                Delete this project
              </Button>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
