import React, { useContext, useState, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import styled from '@emotion/styled'
import { FaMinus } from 'react-icons/fa'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { resolvePath, useNavigate, useParams } from 'react-router-dom'
import { useQuery, useDB } from '@vlcn.io/react'

import StoreContext from '../../../storeContext'
import { ErrorBoundary } from '../../shared/ErrorBoundary'
import { IStore } from '../../../store'
import { Project } from '../../../utils/models'

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

  const dbid: string = localStorage.getItem('remoteDbid')
  const ctx = useDB(dbid)

  const store: IStore = useContext(StoreContext)
  const { activeNodeArray, removeNodeWithChildren } = store
  // const filter = { todo: 'TODO: was in store' }

  const project = useQuery<Project>(
    ctx,
    'SELECT * FROM projects where id = ?',
    [projectId],
  ).data

  const [anchorEl, setAnchorEl] = useState<HTMLAnchorElement>(null)
  const closeMenu = useCallback(() => {
    setAnchorEl(null)
  }, [])

  const onClickButton = useCallback(
    (event) => setAnchorEl(event.currentTarget),
    [],
  )
  const remove = useCallback(async () => {
    ctx.db.exec('update projects set deleted = 1 where id = ?;', [projectId])
    setAnchorEl(null)
    // need to remove node from nodes
    removeNodeWithChildren(activeNodeArray)
    navigate(resolvePath(`..`, window.location.pathname))
  }, [activeNodeArray, navigate, projectId, removeNodeWithChildren, ctx.db])

  return (
    <ErrorBoundary>
      <IconButton
        aria-controls="menu"
        aria-haspopup="true"
        aria-label="Projekt löschen"
        title="Projekt löschen"
        onClick={onClickButton}
        disabled={project.deleted === 1}
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
