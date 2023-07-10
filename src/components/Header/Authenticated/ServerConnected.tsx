import React, { useContext, useCallback } from 'react'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import {
  MdCloudDone as NetworkOn,
  MdCloudOff as NetworkOff,
} from 'react-icons/md'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useNavigate } from 'react-router-dom'

import storeContext from '../../../storeContext'
import { IStore } from '../../../store'

const StyledBadge = styled(Badge)`
  .MuiBadge-badge {
    background-color: rgba(0, 0, 0, 0);
  }
`

export const ServerConnected = observer(() => {
  const store: IStore = useContext(storeContext)
  // serverConnected not so helpful
  const { online } = store

  const navigate = useNavigate()

  // TODO: re-implement
  // const queuedUpdatesCount: number = useLiveQuery(
  //   async () => await dexie.queued_updates.count(),
  // )
  const queuedUpdatesCount = 0
  const title = online
    ? 'Sie sind mit dem Server verbunden'
    : queuedUpdatesCount
    ? `Der Server ist nicht verbunden. ${queuedUpdatesCount} wartende Operationen`
    : `Der Server ist nicht verbunden`

  // TODO:
  // 1. add menu to link to info
  // 2. add menu to list and edit pending queries
  const onClick = useCallback(() => {
    navigate('/queued-updates')
  }, [navigate])

  return (
    <IconButton
      color="inherit"
      aria-label={title}
      title={title}
      onClick={onClick}
    >
      <StyledBadge color="primary" badgeContent={queuedUpdatesCount} max={999}>
        {online ? <NetworkOn /> : <NetworkOff />}
      </StyledBadge>
    </IconButton>
  )
})
