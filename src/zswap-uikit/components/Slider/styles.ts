import { InputHTMLAttributes } from 'react'
import styled from 'styled-components'
import Text from '../Text/Text'
import bunnyHeadMain from './svg/bunnyhead-main.svg'
import bunnyHeadMax from './svg/bunnyhead-max.svg'
import bunnyButt from './svg/bunnybutt.svg'

interface SliderLabelProps {
  progress: string
}

interface StyledInputProps extends InputHTMLAttributes<HTMLInputElement> {
  isMax: boolean
}

interface DisabledProp {
  disabled?: boolean
}

const getCursorStyle = ({ disabled = false }: DisabledProp) => {
  return disabled ? 'not-allowed' : 'pointer'
}

const getBaseThumbStyles = ({ isMax, disabled }: StyledInputProps) => `
  -webkit-appearance: none;
  width: 21px;
  height: 21px;
  background: #004FFF;
  border-radius: 50%;
  border: 0;
  cursor: ${getCursorStyle};
  filter: ${disabled ? 'grayscale(100%)' : 'none'};
  transition: 200ms transform;

  &:hover {
    transform: ${disabled ? 'scale(1)' : 'scale(1.1)'};
  }
`

export const SliderLabelContainer = styled.div`
  bottom: 0;
  position: absolute;
  left: 14px;
  width: calc(100% - 30px);
`

export const SliderLabel = styled(Text)<SliderLabelProps>`
  bottom: 0;
  font-size: 12px;
  left: ${({ progress }) => progress};
  position: absolute;
  text-align: center;
  min-width: 24px; // Slider thumb size
`

export const BunnyButt = styled.div<DisabledProp>`
  background: url(${bunnyButt}) no-repeat;
  height: 32px;
  filter: ${({ disabled }) => (disabled ? 'grayscale(100%)' : 'none')};
  position: absolute;
  width: 15px;
`

export const BunnySlider = styled.div`
  position: absolute;
  width: 100%;
`

export const StyledInput = styled.input<StyledInputProps>`
  cursor: ${getCursorStyle};
  height: 32px;
  position: relative;

  ::-webkit-slider-thumb {
    ${getBaseThumbStyles}
  }

  ::-moz-range-thumb {
    ${getBaseThumbStyles}
  }

  ::-ms-thumb {
    ${getBaseThumbStyles}
  }
`

export const BarBackground = styled.div<DisabledProp>`
  background-color: ${({ theme, disabled }) => theme.colors[disabled ? 'textDisabled' : 'inputSecondary']};
  height: 2px;
  position: absolute;
  top: 18px;
  width: 100%;
`

export const BarProgress = styled.div<DisabledProp>`
  background-color: ${({ theme }) => theme.colors.primary};
  filter: ${({ disabled }) => (disabled ? 'grayscale(100%)' : 'none')};
  height: 6px;
  position: absolute;
  top: 16px;
`
