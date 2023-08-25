import { useParams } from 'react-router-dom'
import { useQuery, useDB } from '@vlcn.io/react'

import { ProjectUser } from '../../../dexieClient'
import ProjectUserComponent from './ProjectUser'

const ProjectUsersComponent = () => {
  const { projectId } = useParams()

  const dbid: string = localStorage.getItem('remoteDbid')
  const ctx = useDB(dbid)

  const projectUsers: ProjectUser[] = useQuery<number>(
    ctx,
    `SELECT * FROM project_users where deleted = 0 and project_id = ? order by email`,
    [projectId],
  ).data.count

  console.log('ProjectUsers, projectUsers:', projectUsers)

  return projectUsers.map((u) => (
    <ProjectUserComponent key={u.id} projectUser={u} />
  ))
}

export default ProjectUsersComponent
