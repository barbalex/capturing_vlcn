import React, { useCallback } from 'react'
import { FaPlus } from 'react-icons/fa'
import IconButton from '@mui/material/IconButton'
import { useParams, useNavigate, resolvePath } from 'react-router-dom'
import { useDB } from '@vlcn.io/react'
import { uuidv7 } from 'uuidv7'

import { ErrorBoundary } from '../../shared/ErrorBoundary'

interface Props {
  userMayEdit: boolean
}

export const AddButton = ({ userMayEdit }: Props) => {
  const { projectId } = useParams()
  const navigate = useNavigate()

  const dbid: string = localStorage.getItem('remoteDbid')
  const ctx = useDB(dbid)

  const onClick = useCallback(async () => {
    const id = uuidv7()
    ctx.db.exec('insert into tables (id, project_id) values (?, ?);', [
      id,
      projectId,
    ])
    navigate(resolvePath(`../${id}`, window.location.pathname))
  }, [ctx.db, navigate, projectId])

  return (
    <ErrorBoundary>
      <IconButton
        aria-label="neue Tabelle"
        title="neue Tabelle"
        onClick={onClick}
        size="large"
        disabled={!userMayEdit}
      >
        <FaPlus />
      </IconButton>
    </ErrorBoundary>
  )
}
