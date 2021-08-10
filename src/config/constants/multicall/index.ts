import { ChainId } from 'zswap-sdk'
import MULTICALL_ABI from './abi.json'

const MULTICALL_NETWORKS: { [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]: '0x1Ee38d535d541c55C9dae27B12edf090C608E6Fb',
  [ChainId.TESTNET]: '0x17ed9f45183E601585D6C53B0533e2Ddac0de5D1',
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }
