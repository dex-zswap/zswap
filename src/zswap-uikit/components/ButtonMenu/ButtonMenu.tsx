import React, { cloneElement, Children, ReactElement } from 'react'
import styled, { DefaultTheme } from 'styled-components'
import { space } from 'styled-system'
import { scales, variants } from '../Button/types'
import { ButtonMenuProps } from './types'

interface StyledButtonMenuProps extends ButtonMenuProps {
  theme: DefaultTheme
}

const getBackgroundColor = ({ theme, variant }: StyledButtonMenuProps) => {
  return theme.colors[variant === variants.SUBTLE ? 'input' : 'tertiary']
}

const getBorderColor = ({ theme, variant }: StyledButtonMenuProps) => {
  return theme.colors[variant === variants.SUBTLE ? 'inputSecondary' : 'disabled']
}

const StyledButtonMenu = styled.div<StyledButtonMenuProps>`
  width: ${({ width, fullWidth }) => width || (fullWidth ? '100%' : 'auto')};
  height: ${({ height }) => height || '100%'};

  background-color: ${getBackgroundColor};
  border-radius: 18px;
  display: ${({ fullWidth }) => (fullWidth ? 'flex' : 'inline-flex')};
  border: 2px solid #0050ff;

  & > a {
    width: 50%;
    height: 100%;
    border-radius: 18px;
  }

  & > button,
  & > a {
    flex: ${({ fullWidth }) => (fullWidth ? 1 : 'auto')};
  }

  & > button,
  & a {
    box-shadow: none;
  }

  ${({ disabled, theme, variant }) => {
    if (disabled) {
      return `
        opacity: 0.5;

        & > button:disabled {
          background-color: transparent;
          color: ${variant === variants.PRIMARY ? theme.colors.primary : theme.colors.textSubtle};
        }
    `
    }
    return ''
  }}
  ${space}
`

const ButtonMenu: React.FC<ButtonMenuProps> = ({
  activeIndex = 0,
  scale = scales.MD,
  variant = variants.PRIMARY,
  onItemClick,
  disabled,
  children,
  fullWidth = false,
  ...props
}) => {
  return (
    <StyledButtonMenu disabled={disabled} variant={variant} fullWidth={fullWidth} {...props}>
      {Children.map(children, (child: ReactElement, index) => {
        return cloneElement(child, {
          isActive: activeIndex === index,
          onClick: onItemClick ? () => onItemClick(index) : undefined,
          scale,
          variant,
          disabled,
        })
      })}
    </StyledButtonMenu>
  )
}

export default ButtonMenu
