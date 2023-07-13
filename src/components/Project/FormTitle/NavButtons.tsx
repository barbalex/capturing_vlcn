import React, { useContext, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import IconButton from '@mui/material/IconButton'
import {
  FaArrowUp,
  FaArrowLeft,
  FaArrowRight,
  FaArrowDown,
} from 'react-icons/fa'
import { Link, resolvePath, useParams } from 'react-router-dom'
import { useQuery, useDB } from '@vlcn.io/react'
import styled from '@emotion/styled'

import StoreContext from '../../../storeContext'
import { MenuChildrenButton } from '../../Table/FormTitle/NavButtons'
import { IStore } from '../../../store'
import sortProjectsByLabelName from '../../../utils/sortProjectsByLabelName'
import { Project, Table } from '../../../utils/models'

const StyledFaArrowDown = styled(FaArrowDown)`
  font-size: 1.75rem !important;
`

export const NavButtons = observer(() => {
  const { projectId } = useParams()

  const store: IStore = useContext(StoreContext)
  const { activeNodeArray, removeNode, setHorizontalNavIds, editingProjects } =
    store
  const editing = editingProjects.get(projectId)?.editing ?? false

  const dbid: string = localStorage.getItem('remoteDbid')
  const ctx = useDB(dbid)

  const projectIds: string[] = useQuery<Project>(
    ctx,
    'SELECT id FROM projects where deleted = 0',
    [],
  ).data.map((p) => p.id)
  setHorizontalNavIds(projectIds)
  const tables = useQuery<Table>(
    ctx,
    'SELECT id FROM projects where deleted = 0 and type = ? and project_id = ?',
    ['standard', projectId],
  )
    .data.sort(sortProjectsByLabelName)
    .map((p) => p.id)

  const tablesTo =
    !editing && tables.length === 1
      ? `${['tables', tables[0]?.id, 'rows'].join('/')}`
      : 'tables'
  const tablesTitle =
    !editing && tables.length === 1 ? tables[0]?.name : 'Tabellen'

  const parentPath = resolvePath(`..`, window.location.pathname)?.pathname
  const activeIndex = projectIds.indexOf(projectId)
  const previousId = activeIndex > 0 ? projectIds[activeIndex - 1] : activeIndex
  const previousPath = `${parentPath}/${previousId}`
  const nextId =
    activeIndex === projectIds.length - 1
      ? projectIds[activeIndex]
      : projectIds[activeIndex + 1]
  const nextPath = `${parentPath}/${nextId}`

  const onClickUp = useCallback(() => {
    removeNode(activeNodeArray)
  }, [activeNodeArray, removeNode])

  return (
    <>
      <IconButton
        title="Zur Liste"
        component={Link}
        to={parentPath}
        onClick={onClickUp}
        size="large"
      >
        <FaArrowUp />
      </IconButton>
      <IconButton
        title="Zum vorigen"
        component={Link}
        to={previousPath}
        size="large"
        disabled={activeIndex === 0}
      >
        <FaArrowLeft />
      </IconButton>
      <IconButton
        title="Zum nächsten"
        component={Link}
        to={nextPath}
        size="large"
        disabled={activeIndex === projectIds.length - 1}
      >
        <FaArrowRight />
      </IconButton>
      <MenuChildrenButton
        endIcon={<StyledFaArrowDown />}
        component={Link}
        to={tablesTo}
      >
        {tablesTitle}
      </MenuChildrenButton>
      {editing && (
        <>
          <MenuChildrenButton
            endIcon={<StyledFaArrowDown />}
            component={Link}
            to="tile-layers"
          >
            Bild-Karten
          </MenuChildrenButton>
          <MenuChildrenButton
            endIcon={<StyledFaArrowDown />}
            component={Link}
            to="vector-layers"
          >
            Vektor-Karten
          </MenuChildrenButton>
        </>
      )}
    </>
  )
})
