// Constructing the two forward-slash-separated parts of the 'Add Liquidity' URL
// Each part of the url represents a different side of the LP pair.
import { ZSWAP_WDEX_ADDRESS } from 'config/constants/zswap/address'

const getLiquidityUrlPathParts = ({ quoteTokenAddress, tokenAddress }) => {
  const chainId = process.env.REACT_APP_CHAIN_ID
  const quoteTokenAddressString: string = quoteTokenAddress ? quoteTokenAddress[chainId] : null
  const tokenAddressString: string = tokenAddress ? tokenAddress[chainId] : null
  const firstPart =
    !quoteTokenAddressString || quoteTokenAddressString === ZSWAP_WDEX_ADDRESS ? 'DEX' : quoteTokenAddressString
  const secondPart = !tokenAddressString || tokenAddressString === ZSWAP_WDEX_ADDRESS ? 'DEX' : tokenAddressString
  return `${firstPart}/${secondPart}`
}

export default getLiquidityUrlPathParts
