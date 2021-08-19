import React, { useContext } from 'react'

import { lockedContext } from 'views/Pools/hooks/useTotalLocked/context'

const TotalLocked = () => {
  const { total } = useContext(lockedContext)

  return <div>${total.toFixed(2)}</div>
}

export default TotalLocked
