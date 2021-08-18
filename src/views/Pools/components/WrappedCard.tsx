import React from 'react'

import { Pool } from 'state/types'
import usePoolInfo from 'views/Pools/hooks/usePoolInfo'
import PoolCard from './PoolCard'

const WrapperedCard: React.FC<{ pool: Pool; account: string }> = ({ pool, account }) => {
  const poolInfo = usePoolInfo(pool)

  return <PoolCard pool={poolInfo} account={account} />
}

export default WrapperedCard
