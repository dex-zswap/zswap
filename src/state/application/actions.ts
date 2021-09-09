import { createAction } from '@reduxjs/toolkit'

export const updateBlockNumber = createAction<{
  chainId: number
  blockNumber: number
  blockTime: number
}>('application/updateBlockNumber')

export default updateBlockNumber
