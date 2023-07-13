import styled from '@emotion/styled'

import { ErrorBoundary } from '../shared/ErrorBoundary'
import { FormTitle } from './FormTitle'
import { Form } from './Form'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => (props.showfilter ? '#fff3e0' : 'unset')};
`

export const Project = ({ filter: showFilter }) => {
  const filter = 'TODO: was in store'

  if (!showFilter && filter.show) return null

  return (
    <ErrorBoundary>
      <Container showfilter={showFilter}>
        <FormTitle showFilter={showFilter} />
        'TODO: FormTitle'
        <Form showFilter={showFilter} />
      </Container>
    </ErrorBoundary>
  )
}
