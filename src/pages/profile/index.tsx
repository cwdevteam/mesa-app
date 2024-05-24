import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/context/AuthProvider'
import { ReloadIcon } from '@radix-ui/react-icons'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Icons } from '@/components/Icons'
import axios from 'axios'
import { toast } from '@/components/ui/use-toast'

type UserProps = {
  username: string
  firstName: string
  lastName: string
  nickName: string
}

export default function UserProfile() {
  const { user, setUser } = useAuth()
  const [editable, setEditable] = useState<boolean>(false)
  const [avatarUrl, setAvatarUrl] = useState<string>('')
  const [userData, setUserData] = useState<UserProps>({
    username: '',
    firstName: '',
    lastName: '',
    nickName: '',
  })
  const [originData, setOriginData] = useState<UserProps>({
    username: '',
    firstName: '',
    lastName: '',
    nickName: '',
  })
  const [loading, setLoading] = useState<boolean>(false)
  const [uploadLoading, setUploadLoading] = useState<boolean>(false)
  const [removeLoading, setRemoveLoading] = useState<boolean>(false)

  useEffect(() => {
    getUser(user.id)
  }, [user])

  const getUser = async (id: string) => {
    try {
      const { data } = await axios.post('/api/user/get', { id: id })

      setAvatarUrl(data.data.avatar)
      setUserData({
        username: data.data.username,
        firstName: data.data.first_name,
        lastName: data.data.last_name,
        nickName: data.data.nick_name,
      })
      setOriginData({
        username: data.data.username,
        firstName: data.data.first_name,
        lastName: data.data.last_name,
        nickName: data.data.nick_name,
      })
    } catch (err) {
      setUserData({
        username: '',
        firstName: '',
        lastName: '',
        nickName: '',
      })
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploadLoading(true)
      const newFile: File | null = e.target.files ? e.target.files[0] : null

      if (newFile) {
        const formData = new FormData()
        formData.append('file', newFile)

        if (avatarUrl) {
          const pathname: any = new URL(avatarUrl || '').pathname
          const filename = pathname.match(/\/([^/]+)$/)[1]

          formData.append('old_name', filename)
        } else {
          formData.append('old_name', '')
        }

        const response = await fetch('/api/user/image/upload', {
          method: 'POST',
          body: formData,
        })

        const data = await response.json()
        if (data && data.avatar) {
          setAvatarUrl(data.avatar)
          setUser({ ...user, avatar: data.avatar })
          toast({
            title: 'Success',
            description: 'Successfully Uploaded',
          })
        }
      }

      setUploadLoading(false)
    } catch (err: any) {
      setUploadLoading(false)
      toast({
        title: 'Error',
        description: 'Error while uploading file',
        variant: 'destructive',
      })
    }
  }

  const handleCancel = () => {
    setEditable(false)
    setUserData({
      username: originData.username,
      firstName: originData.firstName,
      lastName: originData.lastName,
      nickName: originData.nickName,
    })
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const { data } = await axios.post('/api/user/update', {
        ...userData,
        id: user.id,
      })

      if (data && data.user) {
        toast({
          title: 'Success',
          description: 'Successfully updated',
        })

        setEditable(false)
        setUserData({
          username: data.user.username,
          firstName: data.user.first_name,
          lastName: data.user.last_name,
          nickName: data.user.nick_name,
        })
        setOriginData({
          username: data.user.username,
          firstName: data.user.first_name,
          lastName: data.user.last_name,
          nickName: data.user.nick_name,
        })
      }
      setLoading(false)
    } catch (err: any) {
      if (err.response.data) {
        toast({
          title: 'Failed',
          description: err.response.data,
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Failed',
          description: 'Error while updating personal data',
          variant: 'destructive',
        })
      }
      setLoading(false)
    }
  }

  const handleRemoveAvatar = async () => {
    try {
      setRemoveLoading(true)

      if (avatarUrl !== '' && avatarUrl) {
        const pathname: any = new URL(avatarUrl || '').pathname
        const filename = pathname.match(/\/([^/]+)$/)[1]

        const { data } = await axios.post('/api/user/image/remove', {
          filename,
        })

        if (data && data.status) {
          setAvatarUrl('')
          toast({
            title: 'Success',
            description: 'Successfully Removed',
          })
        }
      } else {
        toast({
          title: 'Failed',
          description: 'currently avatar is not exist',
          variant: 'destructive',
        })
      }
      setRemoveLoading(false)
    } catch (err: any) {
      setRemoveLoading(false)
      toast({
        title: 'Failed',
        description: 'Error while removing avatar',
        variant: 'destructive',
      })
    }
  }

  return (
    <main className="container py-10 mx-auto max-w-5xl">
      <div className="flex flex-col justify-center gap-5 max-w-[700px] mx-auto">
        <div className="text-2xl font-bold tracking-tight">User Profile</div>

        <div className="flex items-center justify-start gap-5 py-5 w">
          <Avatar className="h-28 w-28">
            <AvatarImage src={avatarUrl} alt="avatar" />
            <AvatarFallback>
              {user.email ? user.email.slice(0, 2).toUpperCase() : 'ME'}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-2 flex-1">
            <h4 className="text-lg font-semibold">Upload your photo...</h4>
            <p className="text-sm font-light">
              Photo should be at least 300px X 300px
            </p>
            <div className="flex gap-5">
              <>
                {uploadLoading ? (
                  <Button className="flex gap-2">
                    <ReloadIcon className="animate-spin" />
                    Uploading...
                  </Button>
                ) : (
                  <Button
                    className="flex items-center gap-2"
                    onClick={() =>
                      document.getElementById('fileUpload')?.click()
                    }
                    disabled={editable || removeLoading}
                  >
                    <Icons.addFile />
                    Upload Photo
                  </Button>
                )}
                <input
                  type="file"
                  id="fileUpload"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                  accept=".png, .jpg"
                />
              </>

              {removeLoading ? (
                <Button
                  className="flex gap-2 text-red-500 border-red-500 hover:text-red-500"
                  variant={'outline'}
                >
                  <ReloadIcon className="animate-spin" />
                  Removing...
                </Button>
              ) : (
                <Button
                  className="text-red-500 border-red-500 hover:text-red-500 flex items-center gap-2"
                  variant={'outline'}
                  disabled={editable || uploadLoading}
                  onClick={handleRemoveAvatar}
                >
                  <Icons.removeFile />
                  Remove Photo
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-[1px] border-zinc-300 dark:border-zinc-800 rounded-md">
          <div className="bg-zinc-100 dark:bg-zinc-900 flex items-center justify-between gap-2 p-5 rounded-t-md">
            <h5 className="text-lg font-medium">Personal details</h5>
            {!editable ? (
              <Button
                onClick={() => setEditable(true)}
                disabled={uploadLoading || removeLoading}
              >
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant={'outline'}
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>
                {loading ? (
                  <Button className="flex gap-2">
                    <ReloadIcon className="animate-spin" />
                    Saving...
                  </Button>
                ) : (
                  <Button onClick={handleSubmit}>Save</Button>
                )}
              </div>
            )}
          </div>
          <div className="p-5 flex flex-col gap-3">
            <div>
              {editable ? (
                <>
                  <label htmlFor="user_name" className="text-sm">
                    Username
                  </label>
                  <Input
                    id="user_name"
                    name="name"
                    value={userData.username}
                    onChange={(e) =>
                      setUserData({ ...userData, username: e.target.value })
                    }
                  />
                </>
              ) : (
                <div className="flex items-center gap-5">
                  <p>Username: </p>
                  <p>{userData.username}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-5">
              <div className="flex-1">
                {editable ? (
                  <>
                    <label htmlFor="user_first" className="text-sm">
                      Legal Name
                    </label>
                    <div className="flex items-center gap-5">
                      <Input
                        id="user_first"
                        name="first_name"
                        value={userData.firstName}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            firstName: e.target.value,
                          })
                        }
                      />
                      <Input
                        id="user_last"
                        name="last_name"
                        value={userData.lastName}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            lastName: e.target.value,
                          })
                        }
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-5">
                    <p>Legal Name: </p>
                    <p>
                      {userData.firstName} {userData.lastName}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-center gap-5">
              <div className="flex-1">
                {editable ? (
                  <>
                    <label htmlFor="user_first" className="text-sm">
                      Artist Nick name
                    </label>
                    <div className="flex items-center gap-5">
                      <Input
                        id="user_first"
                        name="first_name"
                        value={userData.nickName}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            nickName: e.target.value,
                          })
                        }
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-5">
                    <p>Artist Nick name: </p>
                    <p>
                      {userData.nickName}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
