import { useMemo } from 'react'
import { createAction, createReducer } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'

type LpValueLocked = {
  pair: string
  lockedValue: number
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
    if (!lpLockedState.lps) return 0
    return lpLockedState.lps.reduce((result, current) => result + current.lockedValue, 0).toFixed(2)
  }, [lpLockedState])
}
