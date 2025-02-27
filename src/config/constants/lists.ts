// const PANCAKE_EXTENDED = 'https://tokens.pancakeswap.finance/pancakeswap-extended.json'
// const PANCAKE_TOP100 = 'https://tokens.pancakeswap.finance/pancakeswap-top-100.json'

const { origin } = window.location

// const TOKEN_EXTENDED = `${origin}/tokens/pancakeswap-extended.json`
// const TOKEN_TOP100 = `${origin}/tokens/pancakeswap-top-100.json`
const TOKEN_TOP100 = `${process.env.REACT_APP_API_BASE}/coinType/queryList?groupName=token`
export const UNSUPPORTED_LIST_URLS: string[] = []

// lower index == higher priority for token import
export const DEFAULT_LIST_OF_LISTS: string[] = [
  TOKEN_TOP100,
  // TOKEN_EXTENDED,
  ...UNSUPPORTED_LIST_URLS, // need to load unsupported tokens as well
]

// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_LIST_URLS: string[] = []
