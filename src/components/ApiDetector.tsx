/**
 * based on:
 * https://hasura.io/docs/1.0/graphql/core/api-reference/health.html
 */
// eslint-disable-next-line no-unused-vars
import { useContext, useEffect } from 'react'
import { observer } from 'mobx-react-lite'

import StoreContext from '../storeContext'
import isOnline from '../utils/isOnline'
import { IStore } from '../store'
// import { Session } from '@supabase/supabase-js'

const pollInterval = 10000

export const ApiDetector = observer(() => {
  const store: IStore = useContext(StoreContext)
  const {
    online,
    setOnline,
  }: // session,
  {
    online: boolean
    setOnline: (online: boolean) => void
    // session: Session
  } = store

  useEffect(() => {
    let isActive = true
    const pollingId = setInterval(() => {
      isOnline().then((nowOnline) => {
        if (!isActive) return

        if (online !== nowOnline) {
          setOnline(nowOnline)
        }
      })
    }, pollInterval)

    return () => {
      isActive = false
      clearInterval(pollingId)
    }
  }, [online, setOnline])

  return null
})
