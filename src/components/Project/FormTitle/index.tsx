import { observer } from 'mobx-react-lite'
import { useQuery, useDB } from '@vlcn.io/react'

import FilterTitle from '../../shared/FilterTitle'
import { FormTitle as FormTitleComponent } from './FormTitle'

export const FormTitle = observer(() => {
  const showFilter = false // TODO:

  const dbid: string = localStorage.getItem('remoteDbid')
  const ctx = useDB(dbid)

  const totalCount = useQuery<integer>(
    ctx,
    'SELECT count(*) as count FROM projects where deleted = 0;',
  ).data?.[0]?.count

  const filteredCount = totalCount // TODO:

  if (showFilter) {
    return (
      <FilterTitle
        title="Projekt"
        table="projects"
        totalCount={totalCount}
        filteredCount={filteredCount}
      />
    )
  }

  return (
    <FormTitleComponent totalCount={totalCount} filteredCount={filteredCount} />
  )
})
