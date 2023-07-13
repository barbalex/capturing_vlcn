import { useCachedState, useQuery } from '@vlcn.io/react'
import { useDB } from '@vlcn.io/react'
import { DBAsync } from '@vlcn.io/xplat-api'
import { uuidv4 } from 'uuidv7'

import randomWords from '../support/randomWords.js'

type TestRecord = { id: string; name: string }
const wordOptions = { exactly: 3, join: ' ' }

export const ExampleEditor = () => {
  const dbid: string = localStorage.getItem('remoteDbid')
  const ctx = useDB(dbid)

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
    </div>
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
