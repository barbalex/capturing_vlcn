import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'

import { ErrorBoundary } from '../shared/ErrorBoundary'
import constants from '../../utils/constants'
import { HeaderAnonymus } from './Anonymus'
import { HeaderAuthenticated } from './Authenticated'
import { state$ } from '../../state'

// TODO: add more header bars for: filter, search, online, account
// TODO: make this adapt to screen width, see vermehrung

const StyledAppBar = styled(AppBar)`
  min-height: ${constants.appBarHeight}px !important;
  .MuiToolbar-root {
    min-height: ${constants.appBarHeight}px !important;
    padding-left: 0 !important;
    padding-right: 10px !important;
  }
  @media print {
    display: none !important;
  }
`
export const Header = observer(() => {
  const userEmail = state$.user.email.use()

  return (
    <ErrorBoundary>
      <StyledAppBar position="static">
        <Toolbar>
          {userEmail ? <HeaderAuthenticated /> : <HeaderAnonymus />}
        </Toolbar>
      </StyledAppBar>
    </ErrorBoundary>
  )
})
