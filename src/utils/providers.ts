import { ethers } from 'ethers'
import getRpcUrl from 'utils/getRpcUrl'

// const RPC_URL = getRpcUrl()

// const RPC_URL = 'http://localhost:3000/zswap-api'

// export const simpleRpcProvider = new ethers.providers.JsonRpcProvider(RPC_URL)
export const simpleRpcProvider = new ethers.providers.Web3Provider(window.ethereum)

export default null
