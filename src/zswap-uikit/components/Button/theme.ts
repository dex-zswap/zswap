import { scales, variants } from './types'
import { lightColors } from '../../theme/colors'

export const scaleVariants = {
  [scales.MD]: {
    height: '48px',
    padding: '0 24px',
  },
  [scales.MEDIUM]: {
    fontSize: '14px',
    height: '40px',
    padding: '0 16px',
  },
  [scales.SM]: {
    fontSize: '14px',
    height: '32px',
    padding: '0 16px',
  },
  [scales.XS]: {
    height: '20px',
    fontSize: '12px',
    padding: '0 8px',
  },
}

export const styleVariants = {
  [variants.PRIMARY]: {
    background: lightColors.gradients.button,
    color: 'white',
  },
  [variants.SECONDARY]: {
    backgroundColor: 'transparent',
    border: '2px solid',
    borderColor: 'blue',
    boxShadow: 'none',
    color: 'blue',
    ':disabled': {
      backgroundColor: 'transparent',
    },
  },
  [variants.TERTIARY]: {
    backgroundColor: 'tertiary',
    boxShadow: 'none',
    color: 'text',
  },
  [variants.SUBTLE]: {
    // backgroundColor: 'textSubtle',
    // color: 'backgroundAlt',
    background: lightColors.gradients.button,
    color: 'white',
  },
  [variants.DANGER]: {
    background: lightColors.gradients.button,
    // backgroundColor: 'failure',
    color: 'white',
  },
  [variants.SUCCESS]: {
    backgroundColor: 'success',
    color: 'white',
  },
  [variants.TEXT]: {
    backgroundColor: 'transparent',
    color: 'text',
    boxShadow: 'none',
  },
}
