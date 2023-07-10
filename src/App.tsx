import { useEffect, useState } from 'react'
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles'
import { BrowserRouter } from 'react-router-dom'
import { onSnapshot } from 'mobx-state-tree'
import isEqual from 'lodash/isEqual'
import { useCachedState, useQuery } from '@vlcn.io/react'

import randomWords from './support/randomWords.js'
import { DBAsync } from '@vlcn.io/xplat-api'
import { useDB } from '@vlcn.io/react'
import { uuidv4 } from 'uuidv7'

import { MobxStore, IStore } from './store'
import materialTheme from './utils/materialTheme'
import { Provider as MobxProvider } from './storeContext'
import { dexie } from './dexieClient'
import { NavigationSyncController } from './components/NavigationSyncController'
import { ColumnController } from './components/ColumnController'
import { ApiDetector } from './components/ApiDetector'
import { RouterComponent } from './components/Router'

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

type TestRecord = { id: string; name: string }
const wordOptions = { exactly: 3, join: ' ' }

function App() {
  const dbid: string = localStorage.getItem('remoteDbid')
  const ctx = useDB(dbid)
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

  const data = useQuery<TestRecord>(
    ctx,
    'SELECT * FROM projects ORDER BY id DESC',
  ).data

  const addData = () => {
    ctx.db.exec('INSERT INTO projects (id, name) VALUES (?, ?);', [
      uuidv4(),
      randomWords(wordOptions) as string,
    ])
  }

  const dropData = () => {
    ctx.db.exec('DELETE FROM projects;')
  }

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
            <div className="card">
              <button onClick={addData} style={{ marginRight: '1em' }}>
                Add Data
              </button>
              <button onClick={dropData}>Drop Data</button>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row) => (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>
                        <EditableItem
                          db={ctx.db}
                          id={row.id}
                          value={row.name}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </MobxProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </BrowserRouter>
  )
}

function EditableItem({
  db,
  id,
  value,
}: {
  db: DBAsync
  id: string
  value: string
}) {
  // Generally you will not need to use `useCachedState`. It is only required for highly interactive components
  // that write to the database on every interaction (e.g., keystroke or drag) or in cases where you want
  // to de-bounce your writes to the DB.
  //
  // `useCachedState` will never be required once when one of the following is true:
  // a. We complete the synchronous Reactive SQL layer (SQLiteRX)
  // b. We figure out how to get SQLite-WASM to do a write + read round-trip in a single event loop tick
  const [cachedValue, setCachedValue] = useCachedState(value)
  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setCachedValue(e.target.value)
    // You could de-bounce your write to the DB here if so desired.
    return db.exec('UPDATE projects SET name = ? WHERE id = ?;', [
      e.target.value,
      id,
    ])
  }

  return <input type="text" value={cachedValue} onChange={onChange} />
}

export default App
