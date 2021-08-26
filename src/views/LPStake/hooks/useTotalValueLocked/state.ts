import { useMemo } from 'react'
import { createAction, createReducer } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import BigNumber from 'bignumber.js'

import { BIG_ZERO } from 'utils/bigNumber'

type LpValueLocked = {
  pair: string
  lockedValue: BigNumber | number
}

type LpValueLockedState = {
  lps: Array<LpValueLocked>
}

const initialState = {
  lps: [],
}

export const addLockedValue = createAction<LpValueLocked>('lpStake/addLockedValue')

export default createReducer<LpValueLockedState>(initialState, (builder) => {
  builder.addCase(addLockedValue, (state, { payload }) => {
    const findIndex = state.lps.findIndex((lp) => lp.pair === payload.pair)
    payload.lockedValue = typeof payload.lockedValue !== 'number' && (payload.lockedValue as BigNumber).isNaN() ? BIG_ZERO : new BigNumber(payload.lockedValue)
    if (findIndex !== -1) {
      state.lps[findIndex] = payload
    } else {
      state.lps.push(payload)
    }
  })
})

export const useTotalValueLocked = () => {
  const lpLockedState = useSelector((state: any) => state.lpTotalValueLocked)

  return useMemo(() => {
    return lpLockedState.lps
      .reduce((result, current) => {
        return result.plus(current.lpTotalValueLocked)
      }, BIG_ZERO)
      .toFixed(2, BigNumber.ROUND_DOWN)
  }, [lpLockedState])
}
