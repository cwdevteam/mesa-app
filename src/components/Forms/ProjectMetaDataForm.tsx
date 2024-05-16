import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { DialogClose } from '../ui/dialog'

import React, { useEffect, useState } from 'react'
import ProjectMetaDataSubmitButton from '../ProjectMetaDataSubmitButton'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/router'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import axios from 'axios'

interface SelectOption {
  value: string
  label: string
}

const contractTypeOptions: SelectOption[] = [
  { value: 'master', label: 'Master' },
  { value: 'songwriting', label: 'Songwriting' },
]

const userRoleOptions: SelectOption[] = [
  { value: 'owner', label: 'Owner' },
  { value: 'producer', label: 'Producer' },
  { value: 'songwriter', label: 'Writer' },
  { value: 'artist', label: 'Artist' },
  { value: 'manager', label: 'Manager' },
  { value: 'publisher', label: 'Publisher' },
  { value: 'lawyer', label: 'Lawyer' },
]

export default function ProjectMetaDataForm({
  user,
  data,
  onSubmit,
}: {
  user: User
  data: ProjectUserProps
  onSubmit: () => void
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState<boolean>(false)
  const [state, setState] = useState<any>({
    id: '',
    contract_type: 'master',
    user_role: 'owner',
    user_bps: 10000,
  })

  const [bps, setBps] = useState('')

  useEffect(() => {
    if (data) {
      setState({
        id: data.id,
        contract_type: data.contract_type,
        user_role: data.user_role,
        user_bps: data.user_bps,
      })

      setBps(String(Number(data.user_bps) / 100))
    }
  }, [data])

  const handleSubmit = async () => {
    try {
      if (state.user_bps > 10000 || state.user_bps < 0) {
        toast({
          title: 'Warning',
          description:
            'The entered value is out of range. Please ensure the value is between 0 and 100',
          variant: 'destructive',
        })
        return
      }

      setLoading(true)
      const { data: result } = await axios.post('/api/project_user/update', {
        state: state,
        projectId: data.project_id,
      })

      if (result && result.status) {
        onSubmit()
        router.reload()
      }

      setLoading(false)
    } catch (err) {
      setLoading(false)
      toast({
        title: 'Error',
        description: 'Something went wrong!',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-3">
        <Label htmlFor="title">Contract Type</Label>
        <Select
          value={state.contract_type}
          onValueChange={(v: any) => {
            if (!v) return
            setState({
              ...state,
              contract_type: v,
            })
          }}
        >
          <SelectTrigger className="bg-card border-none">
            <div className="flex items-center gap-2">
              <SelectValue className="text-sm font-semibold">
                {
                  contractTypeOptions.find(
                    (v) => v.value === state.contract_type
                  )?.label
                }
              </SelectValue>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {contractTypeOptions.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">
                      {label ?? value}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-3">
        <Label htmlFor="title">User Role</Label>
        <Select
          value={state.user_role}
          onValueChange={(v: any) => {
            if (!v) return
            setState({
              ...state,
              user_role: v,
            })
          }}
        >
          <SelectTrigger className="bg-card border-none">
            <div className="flex items-center gap-2">
              <SelectValue className="text-sm font-semibold">
                {
                  userRoleOptions.find((v) => v.value === state.user_role)
                    ?.label
                }
              </SelectValue>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {userRoleOptions.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">
                      {label ?? value}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-3">
        <Label htmlFor="bps">%</Label>
        <Input
          id="user_bps"
          name="user_bps"
          placeholder="100.00%"
          type="number"
          autoCorrect="off"
          required
          min={0}
          max={100}
          value={bps}
          onChange={(e) => {
            setBps(e.target.value)
          }}
          onBlur={(e) => {
            setState({
              ...state,
              user_bps: Number(bps) * 100,
            })
          }}
        />
      </div>
      <div className="flex gap-3 justify-end">
        <DialogClose>
          <Button variant="outline" color="gray">
            Close
          </Button>
        </DialogClose>
        <ProjectMetaDataSubmitButton
          handleSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </div>
  )
}
