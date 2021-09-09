import { createReducer } from '@reduxjs/toolkit'
import { updateBlockNumber } from './actions'

export interface ApplicationState {
  readonly blockNumber: { readonly [chainId: number]: number }
  readonly blockTime: { readonly [chainId: number]: number }
}

const initialState: ApplicationState = {
  blockNumber: {},
  blockTime: {},
}

export default createReducer(initialState, (builder) =>
  builder.addCase(updateBlockNumber, (state, action) => {
    const { chainId, blockNumber, blockTime } = action.payload
    if (typeof state.blockNumber[chainId] !== 'number') {
      state.blockNumber[chainId] = blockNumber
    } else {
      state.blockNumber[chainId] = Math.max(blockNumber, state.blockNumber[chainId])
    }

    state.blockTime[chainId] = blockTime
  }),
)
