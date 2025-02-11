interface ProjectProps {
  id: string
  title: string
  description: string
  created_by: string
  created_at: Date
  update_at: Date
}

interface ProjectEventProps {
  id: string
  type: string
  project_id: string
  user_id: string
  payload: string
  created_by: string
  create_at: Date
  update_at: Date
}

interface ProjectInvitationProps {
  id: string
  project_id: string
  user_id: string
  user_role: 'Owner' | 'Artist'
  status: 'Accepted' | 'Pending' | 'Rejected' | 'Closed'
  user_name?: string
  contract_type?: string
  description?: string
  user_email?: string
  created_by: string
  user_bps: number
  created_at: Date
  update_at: Date
}

interface ProjectUserProps {
  id: string
  project_id: string
  user_id: string
  user_role: string
  user_name?: string
  user_email?: string
  invitation_id: string
  contract_type?: string
  user_bps: number
  created_by: string
  created_at: Date
  update_at: Date
  user: UserProps[]
  roles: Roles[]
}

interface UserProps {
  id: string
  email: string
  username?: string
  first_name?: string
  last_name?: string
  nick_name: string
  password: string
  token: string
  aud: boolean
  verified_at: string
  avatar: any
  created_at: string
  updated_at: Date
}

interface Roles {
  id: string
  project_user_id: string
  contract_type: string
  user_role: string
  user_bps: number
  created_at: Date
  update_at: Date
}

interface ProjectUploadProps {
  id: string
  upload_id: string
  project_id: string
  user_id: string
  created_at: Date
  update_at: Date
}

interface UploadProps {
  id: string
  type: string
  name: string
  url: string
  created_at: Date
  update_at: Date
}

type ProjectsByInviteProps = {
  id: string
  project: ProjectProps
  user_id: string
  user_role: 'Owner' | 'Artist'
  status: 'Accepted' | 'Pending' | 'Rejected' | 'Closed'
  user_name?: string
  contract_type?: string
  description?: string
  user_email?: string
  created_by: string
  created_at: Date
  update_at: Date
}

type ProjectsByUserProps = {
  id: string
  project: ProjectProps
  user_id: string
  user_role: string
  user_name?: string
  user_email?: string
  invitation_id: string
  contract_type?: string
  created_by: string
  created_at: Date
  update_at: Date
}

type ProjectType = ProjectProps & {
  projectUsers: (ProjectUserProps & {
    user: UserProps
    roles: Roles[]
  })[]
  projectInvitations: ProjectInvitationProps[]
}

type MediaType = ProjectUploadProps & {
  upload: UploadProps
}

type ProjectContractHistoryProps = {
  id: string
  contract_id: string
  created_at: Date
  project_user_id: string
}
