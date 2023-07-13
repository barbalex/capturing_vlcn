import React, { useContext, useState, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import styled from '@emotion/styled'
import { FaMinus } from 'react-icons/fa'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { resolvePath, useNavigate, useParams } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'

import StoreContext from '../../../storeContext'
import ErrorBoundary from '../../shared/ErrorBoundary'
import { dexie, Project } from '../../../dexieClient'
import { IStore } from '../../../store'

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding-right: 16px;
  user-select: none;
`
const Title = styled.div`
  padding: 12px 16px;
  color: rgba(0, 0, 0, 0.6);
  font-weight: 700;
  user-select: none;
`

export const DeleteButton = observer(() => {
  const { projectId } = useParams()
  const navigate = useNavigate()

  const store: IStore = useContext(StoreContext)
  const { activeNodeArray, removeNodeWithChildren, session } = store
  // const filter = { todo: 'TODO: was in store' }

  const deleted: boolean = useLiveQuery(async () => {
    const row: Project = await dexie.projects.get(projectId)
    return row.deleted
  }, [projectId])

  const [anchorEl, setAnchorEl] = useState<HTMLAnchorElement>(null)
  const closeMenu = useCallback(() => {
    setAnchorEl(null)
  }, [])

  const onClickButton = useCallback(
    (event) => setAnchorEl(event.currentTarget),
    [],
  )
  const remove = useCallback(async () => {
    const row: Project = await dexie.projects.get(projectId)
    row.deleteOnServerAndClient({ session })
    setAnchorEl(null)
    // need to remove node from nodes
    removeNodeWithChildren(activeNodeArray)
    navigate(resolvePath(`..`, window.location.pathname))
  }, [activeNodeArray, navigate, projectId, removeNodeWithChildren, session])

  return (
    <ErrorBoundary>
      <IconButton
        aria-controls="menu"
        aria-haspopup="true"
        aria-label="Projekt löschen"
        title="Projekt löschen"
        onClick={onClickButton}
        disabled={deleted === 1}
        size="large"
      >
        <FaMinus />
      </IconButton>
      <Menu
        id="menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={closeMenu}
      >
        <TitleRow>
          <Title>Wirklich löschen?</Title>
        </TitleRow>
        <MenuItem onClick={remove}>Ja, weg damit!</MenuItem>
        <MenuItem onClick={closeMenu}>Nein, abbrechen!</MenuItem>
      </Menu>
    </ErrorBoundary>
  )
})
