import { useEffect, useState } from 'react'
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles'
import { BrowserRouter } from 'react-router-dom'
import { onSnapshot } from 'mobx-state-tree'
import isEqual from 'lodash/isEqual'

import { MobxStore, IStore } from './store'
import materialTheme from './utils/materialTheme'
import { Provider as MobxProvider } from './storeContext'
import { dexie } from './dexieClient'
import { NavigationSyncController } from './components/NavigationSyncController'
import { ColumnController } from './components/ColumnController'
import { ApiDetector } from './components/ApiDetector'
import { RouterComponent } from './components/Router'
import { ExampleEditor } from './components/ExampleEditor.js'

// TODO: auth via firebase?

// persisting indexedDB: https://dexie.org/docs/StorageManager#controlling-persistence
// TODO: consider calling this only if user choose it in settings
// or pop own window to explain as shown in above link
// because it pops a request window
async function persist() {
  return (
    (await navigator.storage) &&
    navigator.storage.persist &&
    navigator.storage.persist()
  )
}

export const App = () => {
  const [store, setStore] = useState<IStore>()

  useEffect(() => {
    // on first render regenerate store (if exists)
    dexie.stores.get('store').then((dbStore) => {
      let st
      if (dbStore) {
        // reset some values
        if (!dbStore?.store?.showMap) dbStore.store.mapInitiated = false
        dbStore.store.notifications = {}
        dbStore.store.session = undefined
        dbStore.store.sessionCounter = 0
        st = MobxStore.create(dbStore?.store)
      } else {
        st = MobxStore.create()
      }
      setStore(st)
      // navigate to previous activeNodeArray - if exists
      const shouldNavigate =
        dbStore?.activeNodeArray?.length &&
        !isEqual(
          activeNodeArrayFromUrl(window.location.pathname),
          dbStore?.activeNodeArray,
        )
      if (shouldNavigate) {
        window.location.href = `${
          window.location.origin
        }/${dbStore?.activeNodeArray?.join('/')}`
      }
      // persist store on every snapshot
      onSnapshot(st, (ss) => dexie.stores.put({ id: 'store', store: ss }))
      // refresh session
      // supabase.auth.refreshSession()
      // supabase.auth.onAuthStateChange((event, session) => {
      //   st.setSession(session)
      //   st.incrementSessionCounter()
      // })
    })

    return () => {
      // supabase.removeAllChannels()
    }
  }, [])

  useEffect(() => {
    persist() //.then((val) => console.log('storage is persisted safely:', val))
  }, [])

  if (!store) return null

  // TODO: enable resetting password
  // used to use ResetPasswordController that detected type = 'recovery' in search params

  return (
    <BrowserRouter>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={materialTheme}>
          <MobxProvider value={store}>
            <NavigationSyncController />
            <ColumnController />
            <ApiDetector />
            {/* <RouterComponent /> */}
            <ExampleEditor />
          </MobxProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </BrowserRouter>
  )
}
