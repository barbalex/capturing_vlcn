import { useEffect, useState } from 'react'
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles'
import { BrowserRouter } from 'react-router-dom'
import { onSnapshot } from 'mobx-state-tree'
import isEqual from 'lodash/isEqual'
import { enableReactUse } from '@legendapp/state/config/enableReactUse'

import { MobxStore, IStore } from './store'
import materialTheme from './utils/materialTheme'
import { Provider as MobxProvider } from './storeContext'
import { dexie } from './dexieClient'
import { NavigationSyncController } from './components/NavigationSyncController'
import { ColumnController } from './components/ColumnController'
import { ApiDetector } from './components/ApiDetector'
import { RouterComponent } from './components/Router'
// import { ExampleEditor } from './components/ExampleEditor.js'

// TODO: auth via firebase?
// auth is used for syncing: pass userEmail, backend syncs this user's allowed data
enableReactUse()

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
    // TODO: remove when state moved away
    // on first render regenerate store (if exists)
    dexie.stores.get('store').then((dbStore) => {
      let st
      if (dbStore) {
        // reset some values
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
            <RouterComponent />
            {/* <ExampleEditor /> */}
          </MobxProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </BrowserRouter>
  )
}
