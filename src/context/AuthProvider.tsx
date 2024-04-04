'use client'

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from 'react'

const AuthContext = createContext<
  | {
      user: User
      setUser: (value: User) => void
    }
  | undefined
>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

interface AuthResProps {
  data: {
    email: string
    exp: number
    iat: number
    id: string
    username: string
  }
  status: boolean
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User>({
    id: '',
    email: '',
    username: '',
  })

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    try {
      const response = await fetch('/api/auth/me', { method: 'POST' })
      const { data, status }: AuthResProps = await response.json()

      if (data && status) {
        setUser({
          id: data.id,
          email: data.email,
          username: data.username,
        })
      } else {
        setUser({
          id: '',
          email: '',
          username: '',
        })
      }
    } catch (err) {
      setUser({ id: '', email: '', username: '' })
    }
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (typeof context === 'undefined') {
    throw new Error('useMedia must be used within a MediaProvider')
  }
  return context
}

export default AuthProvider
