import React from 'react'

import { Pool } from 'state/types'
import usePoolInfo from 'views/Pools/hooks/usePoolInfo'
import PoolCard from './PoolCard'

const WrapperedCard: React.FC<{ pool: Pool; account: string }> = ({ pool, account }) => {
  const tokenInfo = usePoolInfo(pool)

  return <PoolCard pool={pool} account={account} />
}

export default WrapperedCard
