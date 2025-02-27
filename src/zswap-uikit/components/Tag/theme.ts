import { scales, variants } from './types'

export const scaleVariants = {
  [scales.MD]: {
    height: '28px',
    fontSize: '14px',
  },
  [scales.SM]: {
    height: '24px',
    fontSize: '12px',
  },
}

export const styleVariants = {
  [variants.PRIMARY]: {
    backgroundColor: 'primary',
  },
  [variants.SECONDARY]: {
    backgroundColor: 'secondary',
  },
  [variants.SUCCESS]: {
    backgroundColor: 'success',
  },
  [variants.TEXTDISABLED]: {
    backgroundColor: 'textDisabled',
  },
  [variants.TEXTSUBTLE]: {
    backgroundColor: 'textSubtle',
  },
  [variants.BINANCE]: {
    backgroundColor: 'binance',
  },
  [variants.FAILURE]: {
    backgroundColor: 'failure',
  },
  [variants.WARNING]: {
    backgroundColor: 'warning',
  },
}
