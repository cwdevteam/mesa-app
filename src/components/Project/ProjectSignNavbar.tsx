import React, { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

type TProject = {
  project: ProjectType | null
}

const ProjectSignNavbar: React.FC<TProject> = ({ project }) => {
  return (
    <div>
      <div>Project</div>
      <div>sign</div>
    </div>
  )
}

export default ProjectSignNavbar