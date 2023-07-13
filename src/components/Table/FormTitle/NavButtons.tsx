import React, { useContext, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import {
  FaArrowUp,
  FaArrowRight,
  FaArrowLeft,
  FaArrowDown,
} from 'react-icons/fa'
import { Link, useParams, resolvePath } from 'react-router-dom'
import { useQuery, useDB } from '@vlcn.io/react'
import styled from '@emotion/styled'

import StoreContext from '../../../storeContext'
import sortByLabelName from '../../../utils/sortByLabelName'
import { IStore } from '../../../store'
import { Project, Table } from '../../../utils/models'

export const MenuChildrenButton = styled(Button)`
  font-size: 0.75rem;
  .MuiButton-endIcon {
    margin-left: 4px;
  }
`
const StyledFaArrowDown = styled(FaArrowDown)`
  font-size: 1.75rem !important;
`

const TableNavButtons = () => {
  const { projectId, tableId } = useParams()
  const store: IStore = useContext(StoreContext)
  const { activeNodeArray, removeNode, editingProjects, setHorizontalNavIds } =
    store
  const editing = editingProjects.get(projectId)?.editing ?? false

  const dbid: string = localStorage.getItem('remoteDbid')
  const ctx = useDB(dbid)

  const tables = useQuery<Table>(
    ctx,
    'SELECT * FROM tables where deleted = 0 and project_id = ?',
    [projectId],
  ).data

  const project = useQuery<Project>(
    ctx,
    'select * from projects where id = ?',
    [projectId],
  ).data?.[0]

  const tableIds = sortByLabelName({
    objects: tables,
    useLabels: project.use_labels,
  }).map((t) => t.id)

  setHorizontalNavIds(tableIds)

  const parentPath = resolvePath(`..`, window.location.pathname)?.pathname
  const activeIndex = tableIds.indexOf(tableId)
  const previousId = activeIndex > 0 ? tableIds[activeIndex - 1] : activeIndex
  const previousPath = `${parentPath}/${previousId}`
  const nextId =
    activeIndex === tableIds.length - 1
      ? tableIds[activeIndex]
      : tableIds[activeIndex + 1]
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
        title="Zur vorigen"
        component={Link}
        to={previousPath}
        size="large"
        disabled={activeIndex === 0}
      >
        <FaArrowLeft />
      </IconButton>
      <IconButton
        title="Zur nächsten"
        component={Link}
        to={nextPath}
        size="large"
        disabled={activeIndex === tableIds.length - 1}
      >
        <FaArrowRight />
      </IconButton>
      {!!editing && (
        <MenuChildrenButton
          endIcon={<StyledFaArrowDown />}
          component={Link}
          to="fields"
        >
          Felder
        </MenuChildrenButton>
      )}
      <MenuChildrenButton
        endIcon={<StyledFaArrowDown />}
        component={Link}
        to="rows"
      >
        Datensätze
      </MenuChildrenButton>
    </>
  )
}

export default observer(TableNavButtons)
