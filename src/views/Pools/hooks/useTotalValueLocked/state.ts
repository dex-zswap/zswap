import { useMemo } from 'react'
import { createAction, createReducer } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'

type StakeValueLocked = {
  id: string
  lockedValue: number
}

type StakeValueLockedState = {
  currencies: Array<StakeValueLocked>
}

const initialState = {
  currencies: [],
}

export const addLockedValue = createAction<StakeValueLocked>('stake/addLockedValue')

export default createReducer<StakeValueLockedState>(initialState, (builder) => {
  builder.addCase(addLockedValue, (state, { payload }) => {
    const findIndex = state.currencies.findIndex((currency) => currency.id === payload.id)
    if (findIndex !== -1) {
      state.currencies[findIndex] = payload
    } else {
      state.currencies.push(payload)
    }
  })
})

export const useTotalValueLocked = () => {
  const stakeLockedState = useSelector((state: any) => state.stakeTotalValueLocked)

  return useMemo(() => {
    if (!stakeLockedState.currencies) return 0
    return stakeLockedState.currencies.reduce((result, current) => result + current.lockedValue, 0).toFixed(2)
  }, [stakeLockedState])
}
