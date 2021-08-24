import React from 'react'
import { useTheme } from 'styled-components'
import Heading from '../../components/Heading/Heading'
import getThemeValue from '../../util/getThemeValue'
import { ModalBody, ModalHeader, ModalTitle, ModalContainer, ModalCloseButton, ModalBackButton } from './styles'
import { ModalProps } from './types'

const Modal: React.FC<ModalProps> = ({
  title,
  onDismiss,
  onBack,
  headerChildren,
  children,
  hideCloseButton = false,
  bodyPadding = '0 24px 24px 24px',
  headerBackground = 'transparent',
  minWidth = '320px',
  ...props
}) => {
  const theme = useTheme()
  return (
    <ModalContainer minWidth={minWidth} {...props}>
      <ModalHeader onBack={onBack} background={getThemeValue(`colors.${headerBackground}`, headerBackground)(theme)}>
        <ModalTitle>
          {onBack && <ModalBackButton onBack={onBack} />}
          {title && <Heading>{title}</Heading>}
          {headerChildren}
        </ModalTitle>
        {!hideCloseButton && <ModalCloseButton onDismiss={onDismiss} />}
      </ModalHeader>
      <ModalBody p={bodyPadding}>{children}</ModalBody>
    </ModalContainer>
  )
}

export default Modal
