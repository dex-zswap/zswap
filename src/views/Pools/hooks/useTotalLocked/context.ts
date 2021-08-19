import { createContext } from 'react'

import { BIG_ZERO } from 'utils/bigNumber'

export const lockedContext = createContext({
  total: BIG_ZERO
})

export const Provider = lockedContext.Provider
