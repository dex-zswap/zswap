import EARNING_TOKEN from './earing-token'
import { ZSWAP_DEX_ADDRESS, ZSWAP_ZB_ADDRESS, ZSWAP_USDT_ADDRESS } from './address'

type PairsInfo = {
  pair: string
  weight?: number
  token0: string
  token1: string
}

const AllLps: PairsInfo[] = [
  // DEX-ZB
  {
    pair: '0x9C082F923F32985C24c9595b357Fa97D51793a6e',
    token0: '0x2f6ba13d8bF3e3f7881EE8fA129a3839A3507fA3',
    token1: '0xB23844ED8c6fd85CC6Ba692D3CF9eC8C92653b2d',
  },
  // USDT-ZB
  {
    pair: '0x77bAB5cAE5a41472F287D123D9673E0fAF0BBb63',
    token0: '0x0F4E59f4A14C340f7579cBae609f8b44Ed97a8Dd',
    token1: '0xB23844ED8c6fd85CC6Ba692D3CF9eC8C92653b2d',
  },
]

export default AllLps
