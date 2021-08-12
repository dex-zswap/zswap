import React, { memo } from 'react'

import { useCurrency } from 'hooks/Tokens'
import { usePair } from 'hooks/usePairs'
import FullPositionCard from 'components/PositionCard'

type PairsInfo = {
  pair: string
  token0: string
  token1: string
}

type MB = string | number

type WrappedPositionCardType = {
  pair: PairsInfo
  mb: MB
}

const WrappedPositionCard: React.FC<WrappedPositionCardType> = ({ pair, mb }: WrappedPositionCardType) => {
  const currencyA = useCurrency(pair.token0)
  const currencyB = useCurrency(pair.token1)
  const [, poolPair] = usePair(currencyA, currencyB)

  return poolPair ? (
    <div>
      <FullPositionCard pair={poolPair} />
    </div>
  ) : null
}

export default WrappedPositionCard
