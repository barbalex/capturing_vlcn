import React, { useContext, useCallback } from 'react'
import styled from '@emotion/styled'
import Button from '@mui/material/Button'
import { observer } from 'mobx-react-lite'
// import DoubleArrowCrossed from '../../../svg/double_arrow_crossed.inline.svg' TODO: replace
import {
  FaTimes,
  FaExchangeAlt,
  FaRegTrashAlt,
  FaArrowsAltH,
} from 'react-icons/fa'

import Explainer from './Explainer'
import Data from './Data'
import StoreContext from '../../../storeContext'
import { IStore } from '../../../store'

const Container = styled.div`
  padding: 10px;
`
const Title = styled.h4`
  margin-bottom: 10px;
`
const Rev = styled.span`
  font-weight: normal;
  padding-left: 7px;
  color: rgba(0, 0, 0, 0.4);
  font-size: 0.8em;
`
const ButtonRow = styled.div`
  padding: 15px 0;
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
`
const StyledButton = styled(Button)`
  margin: 5px !important;
  > span {
    text-transform: none;
  }
`

interface Props {
  rev: string
  dataArray: any[]
  loading: boolean
  error: Error | null
  onClickAktuellUebernehmen: () => void
  onClickWiderspruchUebernehmen: () => void
  onClickSchliessen: () => void
}

const Conflict: React.FC = ({
  rev,
  dataArray,
  loading,
  error,
  onClickAktuellUebernehmen,
  onClickWiderspruchUebernehmen,
  onClickSchliessen,
}: Props) => {
  const store: IStore = useContext(StoreContext)
  const { diffConflict, setDiffConflict } = store

  const onClickToggleDiff = useCallback(
    () => setDiffConflict(!diffConflict),
    [diffConflict, setDiffConflict],
  )

  if (error) {
    return <Container>{error.message}</Container>
  }

  return (
    <Container>
      <Title>
        Widersprüchliche Version<Rev>{rev}</Rev>
      </Title>
      <Explainer />
      <Data dataArray={dataArray} loading={loading} />
      <ButtonRow>
        <StyledButton
          onClick={onClickAktuellUebernehmen}
          variant="outlined"
          title="Die widersprüchliche Version wird verworfen, die aktuelle beibehalten. Der Konflikt gilt als gelöst und erscheint nicht mehr"
          startIcon={<FaRegTrashAlt />}
          color="inherit"
        >
          {diffConflict ? (
            <span>
              widersprüchliche (rote) Version verwerfen
              <br /> (= aktuelle übernehmen)
            </span>
          ) : (
            'aktuelle Version übernehmen'
          )}
        </StyledButton>
        <StyledButton
          onClick={onClickWiderspruchUebernehmen}
          variant="outlined"
          title="Die widersprüchliche Version wird übernommen, die aktuelle verworfen. Der Konflikt gilt als gelöst und erscheint nicht mehr"
          startIcon={<FaExchangeAlt />}
          color="inherit"
        >
          {diffConflict ? (
            <span>
              widersprüchliche (rote) Version übernehmen
              <br /> (= aktuelle verwerfen)
            </span>
          ) : (
            'widersprüchliche Version übernehmen'
          )}
        </StyledButton>
        <StyledButton
          onClick={onClickToggleDiff}
          variant="outlined"
          title={
            diffConflict
              ? 'Versionen nicht vergleichen'
              : 'Versionen vergleichen'
          }
          startIcon={diffConflict ? <FaArrowsAltH /> : <FaArrowsAltH />}
          color="inherit"
        >
          {diffConflict ? 'nicht vergleichen' : 'vergleichen'}
        </StyledButton>
        <StyledButton
          onClick={onClickSchliessen}
          variant="outlined"
          title="Die Spalte mit dem Konflikt wird geschlossen. Der Konflikt bleibt erhalten"
          startIcon={<FaTimes />}
          color="inherit"
        >
          schliessen
        </StyledButton>
      </ButtonRow>
    </Container>
  )
}

export default observer(Conflict)
