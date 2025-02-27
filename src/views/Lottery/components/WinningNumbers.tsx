import React, { useEffect, useState } from 'react'
import { Flex, FlexProps } from 'zswap-uikit'
import { random } from 'lodash'
import uniqueId from 'lodash/uniqueId'
import { parseRetreivedNumber } from 'views/Lottery/helpers'
import { BallWithNumber } from 'views/Lottery/svgs'
import { BallColor } from 'views/Lottery/svgs/Balls'

interface WinningNumbersProps extends FlexProps {
  number: string
  size?: string
  fontSize?: string
  rotateText?: boolean
}

const WinningNumbers: React.FC<WinningNumbersProps> = ({
  number,
  size = '32px',
  fontSize = '16px',
  rotateText,
  ...containerProps
}) => {
  const [rotationValues, setRotationValues] = useState([])
  const reversedNumber = parseRetreivedNumber(number)
  const numAsArray = reversedNumber.split('')
  const colors: BallColor[] = ['pink', 'lilac', 'teal', 'aqua', 'green', 'yellow']

  useEffect(() => {
    if (rotateText && numAsArray && rotationValues.length === 0) {
      setRotationValues(numAsArray.map(() => random(-30, 30)))
    }
  }, [rotateText, numAsArray, rotationValues])

  return (
    <Flex justifyContent="space-between" {...containerProps}>
      {numAsArray.map((num, index) => {
        return (
          <BallWithNumber
            key={uniqueId()}
            rotationTransform={rotateText && rotationValues[index]}
            size={size}
            fontSize={fontSize}
            color={colors[index]}
            number={num}
          />
        )
      })}
    </Flex>
  )
}

export default WinningNumbers
