import React, { useContext, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import styled from '@emotion/styled'
import { FaPlus } from 'react-icons/fa'
import IconButton from '@mui/material/IconButton'
import { useNavigate } from 'react-router-dom'
import { useDB } from '@vlcn.io/react'
import { useQuery } from '@vlcn.io/react'

import storeContext from '../../storeContext'
import Row from './Row'
import ErrorBoundary from '../shared/ErrorBoundary'
import constants from '../../utils/constants'
// import insertProject from '../../utils/insertProject'
import sortProjectsByLabelName from '../../utils/sortProjectsByLabelName'
import FilterNumbers from '../shared/FilterNumbers'
import { IStore } from '../../store'
import { Project } from '../../utils/models'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => (props.showfilter ? '#fff3e0' : 'unset')};
  svg,
  a,
  div {
    color: rgba(0, 0, 0, 0.7) !important;
  }
`
const TitleContainer = styled.div`
  background-color: rgba(74, 20, 140, 0.1);
  flex-shrink: 0;
  display: flex;
  @media print {
    display: none !important;
  }
  height: ${constants.titleRowHeight}px;
  justify-content: space-between;
  padding 0 10px;
`
const Title = styled.div`
  font-weight: bold;
  margin-top: auto;
  margin-bottom: auto;
`
const TitleSymbols = styled.div`
  display: flex;
  margin-top: auto;
  margin-bottom: auto;
`
const FieldsContainer = styled.div`
  height: 100%;
  overflow: auto;
`

export const Projects = observer(() => {
  const navigate = useNavigate()
  const store: IStore = useContext(storeContext)
  const { setProjectEditing } = store

  const dbid: string = localStorage.getItem('remoteDbid')
  const ctx = useDB(dbid)

  const projectsUnsorted = useQuery<Project>(
    ctx,
    `SELECT * FROM projects ORDER BY id DESC`,
  ).data
  const projects = projectsUnsorted.sort(sortProjectsByLabelName)

  const filteredCount = projectsUnsorted.length // TODO: pass in filter
  const totalCount = projectsUnsorted.length

  const add = useCallback(async () => {
    // TODO:
    // const newId = await insertProject({ account })
    navigate(newId)
    setProjectEditing({
      id: newId,
      editing: true,
    })
  }, [navigate, setProjectEditing])

  // console.log('ProjectsList rendering')

  return (
    <ErrorBoundary>
      <Container showfilter={false}>
        <TitleContainer>
          <Title>Projekte</Title>
          <TitleSymbols>
            <IconButton
              aria-label="neues Projekt"
              title="neues Projekt"
              onClick={add}
              size="large"
              // TODO:
              // disabled={!account}
            >
              <FaPlus />
            </IconButton>
            <FilterNumbers
              filteredCount={filteredCount}
              totalCount={totalCount}
            />
          </TitleSymbols>
        </TitleContainer>
        <FieldsContainer>
          {projects.map((row) => (
            <Row key={row?.id} row={row} />
          ))}
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
})
