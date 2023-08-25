import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { useLiveQuery } from 'dexie-react-hooks'

import Node from '../Node'
import labelFromLabeledTable from '../../../utils/labelFromLabeledTable'
import isNodeOpen from '../isNodeOpen'
import storeContext from '../../../storeContext'
import Tables from './Tables'
import {
  dexie,
  Project,
  Table,
  Field,
  VectorLayer,
  TileLayer,
  Row,
} from '../../../dexieClient'
import { IStore } from '../../../store'
import { state$ } from '../../../state'

interface Props {
  project: Project
}

export interface TreeNode {
  id: string
  label: string
  type:
    | 'project'
    | 'table'
    | 'field'
    | 'vector_layer'
    | 'tile_layer'
    | 'row'
    | 'projectFolder'
    | 'tileLayerFolder'
    | 'vectorLayerFolder'
    | 'rowsFolder'
    | 'fieldsFolder'
  object: Project | Table | Row | Field | VectorLayer | TileLayer
  url: string[]
  children: TreeNode[]
  childrenCount: number
  projectId: string
}

const ViewingProject = ({ project }: Props) => {
  const store: IStore = useContext(storeContext)
  const { nodes } = store

  const userRole = state$.userRole.use()

  // query child tables
  // if none and user may not edit structure: do not render
  const data =
    useLiveQuery(async () => {
      const tablesCount: number = await dexie.ttables
        .where({
          deleted: 0,
          project_id: project.id,
        })
        .count()

      return { tablesCount }
    }, [project.id]) ?? []

  const tablesCount: number = data?.tablesCount ?? 0
  const userMayEditStructure: boolean = [
    'account_manager',
    'project_manager',
  ].includes(userRole)

  if (tablesCount === 0 && !userMayEditStructure) return null

  const url = ['projects', project.id]
  const node: TreeNode = {
    id: project.id,
    label: labelFromLabeledTable({
      object: project,
      useLabels: project.use_labels,
    }),
    type: 'project',
    object: project,
    url,
    children: [],
    childrenCount: 1,
    projectId: project.id,
  }
  const isOpen = isNodeOpen({ nodes, url })

  return (
    <>
      <Node node={node} />
      {isOpen && <Tables project={project} />}
    </>
  )
}

export default observer(ViewingProject)
