import React from 'react'
import styled, { DefaultTheme } from 'styled-components'
import CheckmarkCircleIcon from '../Svg/Icons/CheckmarkCircle'
import ErrorIcon from '../Svg/Icons/Error'
import BlockIcon from '../Svg/Icons/Block'
import InfoIcon from '../Svg/Icons/Info'
import { Text } from '../Text'
import { IconButton } from '../Button'
import { CloseIcon } from '../Svg'
import Flex from '../Box/Flex'
import { AlertProps, variants } from './types'

interface ThemedIconLabel {
  variant: AlertProps['variant']
  theme: DefaultTheme
  hasDescription: boolean
}

const getThemeColor = ({ theme, variant = variants.INFO }: ThemedIconLabel) => {
  switch (variant) {
    case variants.DANGER:
      return theme.colors.failure
    case variants.WARNING:
      return theme.colors.warning
    case variants.SUCCESS:
      return theme.colors.success
    case variants.INFO:
    default:
      return '#fff'
  }
}

const getIcon = (variant: AlertProps['variant'] = variants.INFO) => {
  switch (variant) {
    case variants.DANGER:
      return BlockIcon
    case variants.WARNING:
      return ErrorIcon
    case variants.SUCCESS:
      return CheckmarkCircleIcon
    case variants.INFO:
    default:
      return InfoIcon
  }
}

const IconLabel = styled.div<ThemedIconLabel>`
  background-color: #1a1a1a;
  border-radius: 30px 0 0 30px;
  color: ${getThemeColor};
  padding: 13px 13px 0 30px;
`

const withHandlerSpacing = 32 + 12 + 8 // button size + inner spacing + handler position
const Details = styled.div<{ hasHandler: boolean }>`
  flex: 1;
  padding-bottom: 12px;
  padding-left: 12px;
  padding-right: ${({ hasHandler }) => (hasHandler ? `${withHandlerSpacing}px` : '12px')};
  padding-top: 12px;
`

const CloseHandler = styled.div`
  border-radius: 0 30px 30px 0;
  right: 8px;
  position: absolute;
  top: 8px;
`

const StyledAlert = styled(Flex)`
  position: relative;
  background: #1a1a1a;
  box-shadow: 0px 8px 32px 0px rgba(11, 19, 38, 0.52);
  border-radius: 30px;
  padding: 10px 0;
`

const Alert: React.FC<AlertProps> = ({ title, children, variant, onClick }) => {
  const Icon = getIcon(variant)

  return (
    <StyledAlert>
      <IconLabel variant={variant} hasDescription={!!children}>
        <Icon color="currentColor" width="24px" />
      </IconLabel>
      <Details hasHandler={!!onClick}>
        <Text mb="8px" bold>
          {title}
        </Text>
        {typeof children === 'string' ? <Text as="p">{children}</Text> : children}
      </Details>
      {onClick && (
        <CloseHandler>
          <IconButton scale="sm" variant="text" onClick={onClick}>
            <CloseIcon width="24px" color="currentColor" />
          </IconButton>
        </CloseHandler>
      )}
    </StyledAlert>
  )
}

export default Alert
