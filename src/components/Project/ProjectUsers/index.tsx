import { useCallback, useState } from 'react'
import styled from '@emotion/styled'
import { motion, useAnimation } from 'framer-motion'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import { useQuery, useDB } from '@vlcn.io/react'
import { useParams } from 'react-router-dom'
import { observer } from 'mobx-react-lite'

import { ErrorBoundary } from '../../shared/ErrorBoundary'
import constants from '../../../utils/constants'
import { ProjectUsersComponent } from './ProjectUsers'
import AddProjectUser from './AddProjectUser'
import { state$ } from '../../../state'

const TitleRow = styled.div`
  background-color: rgba(248, 243, 254, 1);
  flex-shrink: 0;
  display: flex;
  height: ${constants.titleRowHeight}px;
  justify-content: space-between;
  padding: 0 10px;
  cursor: pointer;
  user-select: none;
  position: sticky;
  top: 0;
  z-index: 1;
  &:first-of-type {
    margin-top: -10px;
  }
`
const Title = styled.div`
  font-weight: bold;
  margin-top: auto;
  margin-bottom: auto;
`
const ProjectUsersContainer = styled(List)`
  padding: 0 0 8px 0;
`
const AddButtonRow = styled.div`
  display: flex;
  margin: 0 8px;
`
const AddButton = styled(Button)``

const ProjectUsersIndex = () => {
  const { projectId } = useParams()
  const role = state$.role.use()

  const [addNew, setAddNew] = useState<boolean>(false)

  const [open, setOpen] = useState<boolean>(false)
  const anim = useAnimation()
  const onClickToggle = useCallback(
    async (e) => {
      e.stopPropagation()
      if (open) {
        const was = open
        await anim.start({ opacity: 0 })
        await anim.start({ height: 0 })
        setOpen(!was)
      } else {
        setOpen(!open)
        setTimeout(async () => {
          await anim.start({ height: 'auto' })
          await anim.start({ opacity: 1 })
        })
      }
    },
    [anim, open],
  )

  const onClickAddUser = useCallback(() => {
    setAddNew(true)
  }, [])

  const dbid: string = localStorage.getItem('remoteDbid')
  const ctx = useDB(dbid)

  const projectUsersCount =
    useQuery<number>(
      ctx,
      `SELECT count(*) FROM project_users where deleted = 0 and project_id = ? group by id`,
      [projectId],
    ).data?.[0] ?? 0

  console.log('ProjectUsers, projectUsersCount:', projectUsersCount)

  const userMayEdit: boolean = ['account_manager', 'project_manager'].includes(
    projectUser?.role,
  )

  return (
    <ErrorBoundary>
      <TitleRow onClick={onClickToggle} title={open ? 'schliessen' : 'öffnen'}>
        <Title>{`Mitarbeitende Personen (${projectUsersCount})`}</Title>
        <div>
          <IconButton
            aria-label={open ? 'schliessen' : 'öffnen'}
            title={open ? 'schliessen' : 'öffnen'}
            onClick={onClickToggle}
            size="large"
          >
            {open ? <FaChevronUp /> : <FaChevronDown />}
          </IconButton>
        </div>
      </TitleRow>
      <motion.div animate={anim} transition={{ type: 'just', duration: 0.2 }}>
        {open && (
          <>
            <ProjectUsersContainer>
              <ProjectUsersComponent />
            </ProjectUsersContainer>
            {userMayEdit && !addNew && (
              <AddButtonRow>
                <AddButton
                  title="Neue mitarbeitende Person hinzufügen"
                  variant="outlined"
                  onClick={onClickAddUser}
                >
                  Hinzufügen
                </AddButton>
              </AddButtonRow>
            )}
            {userMayEdit && addNew && <AddProjectUser setAddNew={setAddNew} />}
          </>
        )}
      </motion.div>
    </ErrorBoundary>
  )
}

export const ProjectUsers = observer(ProjectUsersIndex)
