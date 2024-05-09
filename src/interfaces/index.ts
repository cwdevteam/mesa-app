interface IProjectUser {
  id: string
  project: string
  project_id: string
  user_id: string
  user_role: string
  user_name: string
  user_email: string
  user_bps: string
  contract_type: string
  created_by: string
  created_at: string
  updated_at: string
}

interface IContractHistory {
  id: string
  contract_id: string
  project_user_id: string
  created_at: string
  project_user: IProjectUser
}
