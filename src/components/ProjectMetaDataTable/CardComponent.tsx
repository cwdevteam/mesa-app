/* eslint-disable @next/next/no-img-element */
import Image from 'next/image'
import { bpsToPercent } from '@/lib/utils'
import { useState } from 'react'
import ProjectMetaDataDialog from './ProjectMetaDataDialog'
import axios from 'axios'
import { useRouter } from 'next/router'
import { Icons } from '../Icons'

interface cardProps {
  data: any
  user: any
  allData: any
}

const isInvitation = (obj: ProjectUserProps | ProjectInvitationProps) =>
  !!(obj as any)?.status

const CardComponent: React.FC<cardProps> = ({ data, user, allData }) => {
  const [selectedUserId, setSelectedUserId] = useState('')
  const [editModal, setEditModal] = useState<boolean>(false)
  const [requestType, setRequestType] = useState<string>('')
  const [roleId, setRoleId] = useState<string>('')
  const router = useRouter()

  const handleActionClick = (
    userId: string,
    roleId: string,
    requst: string
  ) => {
    setRequestType(requst)
    setRoleId(roleId)
    setSelectedUserId(userId)
    setEditModal(true)
  }

  const handleDelete = async (id: string) => {
    const { data: result } = await axios.post('/api/project_user/delete', {
      id,
    })
    if (result && result.status) {
      router.reload()
    }
  }

  return (
    <div className="max-w-max rounded-md overflow-hidden shadow-lg border mx-4 my-4">
      <div></div>
      <div className="px-6 py-4 flex">
        <button className="inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground px-4 py-2 relative h-12 w-12 rounded-full">
          <span className="relative flex shrink-0 overflow-hidden rounded-full h-11 w-11">
            <span className="flex h-full w-full items-center justify-center rounded-full bg-muted">
              {user.avatar === null ? (
                'TI'
              ) : (
                <img src={user.avatar} alt="avatar" />
              )}
            </span>
          </span>
        </button>
        <div className="font-bold w-screen text-lg flex ml-6 items-center">
          <div>{data.user_name}</div>
          <div>
            {isInvitation(data) === false ? (
              <div className="ml-3 w-3 h-3 bg-green-600 rounded-md"></div>
            ) : (
              <div className="ml-3 w-3 h-3 bg-red-600 rounded-md"></div>
            )}
          </div>
          <div className="text-sm w-full ml-17 flex justify-end">
            <button
              className="inline-flex items-center justify-center whitespace-nowrap text-md font-x1 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 w-8 shrink-0 rounded-full"
              onClick={() => handleActionClick(data.user_id, '', 'create')}
            >
              +
            </button>
          </div>
        </div>
      </div>
      {data?.roles?.map((role: any) => (
        <div
          key={role.id}
          className="px-6 py-3 flex flex-row border mx-6 my-3 rounded-md items-center"
        >
          <span className="flex items-center text-sm">Contract Type: </span>
          <span className="flex-1 mx-4 rounded-md  px-3 py-1 text-sm font-semibold flex dir justify-center items-center mr-2">
            {role.contract_type === 'Both'
              ? 'Master&SongWriter'
              : role.contract_type}
          </span>
          <span className="flex items-center text-sm ml-4">Role: </span>
          <span className="flex-1 mx-4 rounded-md px-3 py-1 text-sm font-semibold flex dir justify-center items-center mr-2">
            {role.user_role}
          </span>
          <span className="flex items-center text-sm ml-4">Bps: </span>
          <span className="flex-1 mx-4 rounded-md px-3 py-1 text-sm font-semibold flex dir justify-center items-center mr-2">
            {bpsToPercent(role.user_bps ?? 0)}
          </span>
          <span className="flex-initial flex flex-row">
            <button
              className="inline-flex items-center justify-center mr-5 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 underline-offset-4 hover:underline"
              onClick={() => handleDelete(role.id)}
            >
              <Icons.delete />
            </button>
            <button
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9"
              onClick={() => handleActionClick(data.user_id, role.id, 'edit')}
            >
              <Icons.Edit/>
            </button>
          </span>
        </div>
      ))}

      <ProjectMetaDataDialog
        open={editModal}
        setOpen={setEditModal}
        request={requestType}
        roleId={roleId}
        user={data}
        data={allData.find(
          (v: ProjectUserProps) => v.user_id === selectedUserId
        )}
      />
    </div>
  )
}
export default CardComponent
