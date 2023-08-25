import styled from '@emotion/styled'
import { withResizeDetector } from 'react-resize-detector'

import DeleteButton from './DeleteButton'
import { AddButton } from './AddButton'
import NavButtons from './NavButtons'
import ZoomToButton from './ZoomToButton'
import FilterNumbers from '../../shared/FilterNumbers'
import Menu from '../../shared/Menu'
import { state$ } from '../../../state'

const TitleContainer = styled.div`
  background-color: rgba(74, 20, 140, 0.1);
  display: flex;
  flex-shrink: 0;
  flex-grow: 0;
  flex-wrap: wrap;
  justify-content: space-between;
  padding 0 10px;
  svg, a, div {
    color: rgba(0,0,0,0.8) !important;
  }
  @media print {
    display: none !important;
  }
`
const Title = styled.div`
  font-weight: bold;
  margin-top: auto;
  margin-bottom: auto;
  padding-right: 40px;
  padding-left: 10px;
  user-select: none;
  height: 52px;
  line-height: 52px;
  text-align: center;
`
const TitleSymbols = styled.div`
  display: flex;
  margin-top: auto;
  margin-bottom: auto;
  justify-content: flex-end;
  flex-grow: 1;
  flex-wrap: wrap;
`

interface Props {
  totalCount: number
  filteredCount: number
  width: number
}

const TableFormTitle = ({ totalCount, filteredCount, width }: Props) => {
  const userRole = state$.userRole.use()

  const userMayEdit: boolean = [
    'account_manager',
    'project_manager',
    'project_editor',
  ].includes(userRole)

  if (width < 600) {
    return (
      <TitleContainer>
        <Title>Tabelle</Title>
        <TitleSymbols>
          <NavButtons />
          <Menu white={false}>
            <AddButton userMayEdit={userMayEdit} />
            <DeleteButton userMayEdit={userMayEdit} />
            <ZoomToButton />
            <FilterNumbers
              filteredCount={filteredCount}
              totalCount={totalCount}
              asMenu
            />
          </Menu>
        </TitleSymbols>
      </TitleContainer>
    )
  }

  if (width < 650) {
    return (
      <TitleContainer>
        <Title>Tabelle</Title>
        <TitleSymbols>
          <NavButtons />
          <AddButton userMayEdit={userMayEdit} />
          <DeleteButton userMayEdit={userMayEdit} />
          <Menu white={false}>
            <ZoomToButton />
            <FilterNumbers
              filteredCount={filteredCount}
              totalCount={totalCount}
              asMenu
            />
          </Menu>
        </TitleSymbols>
      </TitleContainer>
    )
  }

  return (
    <TitleContainer>
      <Title>Tabelle</Title>
      <TitleSymbols>
        <NavButtons />
        <AddButton userMayEdit={userMayEdit} />
        <DeleteButton userMayEdit={userMayEdit} />
        <ZoomToButton />
        <FilterNumbers filteredCount={filteredCount} totalCount={totalCount} />
      </TitleSymbols>
    </TitleContainer>
  )
}

export default withResizeDetector(TableFormTitle)
