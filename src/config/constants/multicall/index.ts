import { ChainId } from 'zswap-sdk'
import MULTICALL_ABI from './abi.json'

const MULTICALL_NETWORKS: { [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]: '0x1Ee38d535d541c55C9dae27B12edf090C608E6Fb',
  [ChainId.TESTNET]: '0xBF3D323932A87021c9060B63F1423330828539Ae',
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }
