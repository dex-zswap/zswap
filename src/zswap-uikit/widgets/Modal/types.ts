import { ReactNode } from 'react'
import { BoxProps } from '../../components/Box'

export interface ModalTheme {
  background: string
}

export type Handler = () => void

export interface InjectedProps {
  onDismiss?: Handler
}

export interface ModalProps extends InjectedProps, BoxProps {
  title?: string
  headerChildren?: ReactNode
  hideCloseButton?: boolean
  onBack?: () => void
  bodyPadding?: string
  headerBackground?: string
  minWidth?: string
}
