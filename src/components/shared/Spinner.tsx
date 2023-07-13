import styled from '@emotion/styled'
import CircularProgress from '@mui/material/CircularProgress'

const SpinnerContainer = styled.div`
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
const SpinnerText = styled.div`
  padding: 10px;
`

interface Props {
  message?: string
}

export const Spinner = ({ message }: Props): React.FC => (
  <SpinnerContainer>
    <CircularProgress />
    {!!message && <SpinnerText>{message}</SpinnerText>}
  </SpinnerContainer>
)
