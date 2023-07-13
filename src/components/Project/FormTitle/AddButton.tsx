import React, { useCallback, useContext } from 'react'
import { FaPlus } from 'react-icons/fa'
import IconButton from '@mui/material/IconButton'
import { resolvePath, useNavigate } from 'react-router-dom'
import { uuidv7 } from 'uuidv7'
import { useDB } from '@vlcn.io/react'

import { ErrorBoundary } from '../../shared/ErrorBoundary'
import storeContext from '../../../storeContext'
import { IStore } from '../../../store'

export const AddButton = () => {
  const navigate = useNavigate()

  const store: IStore = useContext(storeContext)
  const { setProjectEditing } = store

  const dbid: string = localStorage.getItem('remoteDbid')
  const ctx = useDB(dbid)

  const onClick = useCallback(async () => {
    const id = uuidv7()
    ctx.db.exec('INSERT INTO projects (id) VALUES (?);', [id])
    navigate(resolvePath(`../${id}`, window.location.pathname))
    setProjectEditing({
      id,
      editing: true,
    })
  }, [ctx.db, navigate, setProjectEditing])

  return (
    <ErrorBoundary>
      <IconButton
        aria-label="neues Projekt"
        title="neues Projekt"
        onClick={onClick}
        size="large"
      >
        <FaPlus />
      </IconButton>
    </ErrorBoundary>
  )
}
