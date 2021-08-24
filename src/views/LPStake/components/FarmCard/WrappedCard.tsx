import React from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

import { usePairInfo } from 'views/LPStake/hooks/usePairInfo'

import FarmCard from './FarmCard'

type PairsInfo = {
  pair: string
  weight: number
  token0: string
  token1: string
}

type WrapperedCardProps = {
  pair: PairsInfo
  pairs: PairsInfo[]
}

const WrapperedCard: React.FC<WrapperedCardProps> = ({ pair, pairs }: WrapperedCardProps) => {
  const { account } = useActiveWeb3React()
  const allWeights = pairs.map(({ weight }) => weight)
  const pairInfo = usePairInfo(pair, allWeights)

  return (
    <div>
      <FarmCard farm={pairInfo} displayApr={pairInfo.displayApr} account={account} removed={false} />
    </div>
  )
}

export default WrapperedCard
