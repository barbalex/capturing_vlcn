import { useEffect, useState } from 'react'
import { useCachedState, useQuery } from '@vlcn.io/react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import vlcnLogo from './assets/vlcn.png'
import './App.css'
import randomWords from './support/randomWords.js'
import { DBAsync } from '@vlcn.io/xplat-api'
import { useDB } from '@vlcn.io/react'
import { uuidv4 } from 'uuidv7'

import { MobxStore, IStore } from './store'
import materialTheme from './utils/materialTheme'
import { Provider as MobxProvider } from './storeContext'
import { dexie } from './dexieClient'

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

function App({ dbid }: { dbid: string }) {
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
      fetchFromServer(st)
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

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <a href="https://vlcn.io" target="_blank">
          <img src={vlcnLogo} className="logo vlcn" alt="Vulcan logo" />
        </a>
      </div>
      <h1>Vite + React + Vulcan</h1>
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
                  <EditableItem db={ctx.db} id={row.id} value={row.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
        <p>
          Open another browser and navigate to{' '}
          <a href={window.location.href} target="_blank">
            this window's url
          </a>{' '}
          to test sync.
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite, React and Vulcan logos to learn more
      </p>
    </>
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
