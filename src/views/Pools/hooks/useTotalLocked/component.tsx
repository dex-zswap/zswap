import React, { useEffect, useCallback, useMemo, useState } from 'react'

import pools from 'config/constants/zswap/pools'
import { getAddress } from 'utils/addressHelpers'

import { BIG_ZERO } from 'utils/bigNumber'

import { Provider } from './context'
import useLocked from './hooks'

const Call: React.FC<{
  callId: string;
  updateState: Function;
}>= ({ callId, updateState }) => {
  const lockedValue = useLocked(callId)
  useEffect(() => {
    updateState({ lockedValue, callId })
  }, [lockedValue])
  return null
}

const TotalLockedWrapper: React.FC<{
  children: React.ReactChild | React.ReactNode | React.ReactElement
}> = ({ children }) => {
  const [ state, setState ] = useState({})
  const calls = useMemo(() => pools.map((pool) => getAddress(pool.stakingToken.address)), [pools])

  const updateState = useCallback(({ lockedValue, callId }) => {
    setState((state) => {
      return {
        ...state,
        [callId]: lockedValue
      }
    })
  }, [state])

  const total = useMemo(() => {
    const keys = Object.keys(state)
    const { length } = keys
    return (length < calls.length) ? BIG_ZERO : keys.reduce((last, key) => last.plus(state[key]), BIG_ZERO)
  }, [state, calls])

  console.log(total)

  return (
    <Provider value={{
      total: total
    }}>
      {
        calls.map((call) => <Call key={call} callId={call} updateState={updateState} />)
      }
      {children}
    </Provider>
  )
}

export default TotalLockedWrapper
