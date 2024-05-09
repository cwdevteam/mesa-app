import React, { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

type OpenModalProps = React.HTMLAttributes<HTMLDivElement> & {
  isOpen: Boolean
  onClose: () => void
  user: User
  project: ProjectType | null
  contractId: string | null
  setIsOpenContract: (b: boolean) => void
}

const ProjectSignPdf: React.FC<OpenModalProps> = ({
  isOpen,
  onClose,
  user,
  children,
  className,
  project,
  contractId,
  setIsOpenContract,
  ...props
}) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  if (!isOpen) return null

  const onSignBtn = async () => {
    const data = {
      contractId,
    }
    try {
      const response = await axios.post('/api/contract/new', data)
      setIsOpenContract(true)
    } catch (e: any) {
      console.error(e.response)
    }
  }

  return (
    <div className="fixed top-0 left-0 flex  justify-center w-full h-full text-black bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-black w-156 rounded-lg shadow-xl p-6">
        <div className="flex justify-between items-center mb-4 ">
          <h2 className="text-xl font-semibold">Sign PDF</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-600 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="modal-body">
          {contractId ? (
            <iframe
              height={500}
              width={1000}
              src={`http://localhost:5000/static/contract-${contractId}.pdf`}
              title="Music"
            ></iframe>
          ) : (
            'Not Available'
          )}
        </div>
        <div className="flex flex-col items-center verflow-auto mt-10 mx-0">
          <div className="flex space-x-4">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg focus:outline-none"
              onClick={onSignBtn}
            >
              {loading ? 'Signing...' : 'Sign'}
            </button>
            <button
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-600 px-4 py-2 rounded-lg focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectSignPdf
