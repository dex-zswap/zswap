import React from 'react'
import styled, { keyframes } from 'styled-components'
import SpinCircle from './SpinCircle'
import { SpinnerProps } from './types'

const rotateOut = keyframes`
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
`
const rotateIn = keyframes`
  from {
    transform: rotate(120deg);
  }
  to {
    transform: rotate(-240deg);
  }
`

const Container = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
`

const SpinCircleOut = styled(SpinCircle)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  animation: ${rotateOut} 2s linear infinite;
`

const SpinCircleIn = styled(SpinCircle)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  animation: ${rotateIn} 2s linear infinite;
`

const Spinner: React.FC<SpinnerProps> = ({ size = 85 }) => {
  return (
    <Container>
      <SpinCircleOut width={`${size}px`} />
      <SpinCircleIn width={`${size * 0.7}px`} />
    </Container>
  )
}

export default Spinner
