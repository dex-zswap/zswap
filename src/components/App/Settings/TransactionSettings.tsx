import React, { useState } from 'react'
import { Text, Button, Input, Flex, Grid } from 'zswap-uikit'
import { useTranslation } from 'contexts/Localization'
import QuestionHelper from 'components/QuestionHelper'
import { AutoColumn } from 'components/Layout/Column'
import { RowBetween, RowFixed } from 'components/Layout/Row'

enum SlippageError {
  InvalidInput = 'InvalidInput',
  RiskyLow = 'RiskyLow',
  RiskyHigh = 'RiskyHigh',
}

enum DeadlineError {
  InvalidInput = 'InvalidInput',
}

export interface SlippageTabsProps {
  rawSlippage: number
  setRawSlippage: (rawSlippage: number) => void
  deadline: number
  setDeadline: (deadline: number) => void
}

export default function SlippageTabs({ rawSlippage, setRawSlippage, deadline, setDeadline }: SlippageTabsProps) {
  const [slippageInput, setSlippageInput] = useState('')
  const [deadlineInput, setDeadlineInput] = useState('')

  const { t } = useTranslation()

  const slippageInputIsValid =
    slippageInput === '' || (rawSlippage / 100).toFixed(2) === Number.parseFloat(slippageInput).toFixed(2)
  const deadlineInputIsValid = deadlineInput === '' || (deadline / 60).toString() === deadlineInput

  let slippageError: SlippageError | undefined
  if (slippageInput !== '' && !slippageInputIsValid) {
    slippageError = SlippageError.InvalidInput
  } else if (slippageInputIsValid && rawSlippage < 50) {
    slippageError = SlippageError.RiskyLow
  } else if (slippageInputIsValid && rawSlippage > 500) {
    slippageError = SlippageError.RiskyHigh
  } else {
    slippageError = undefined
  }

  let deadlineError: DeadlineError | undefined
  if (deadlineInput !== '' && !deadlineInputIsValid) {
    deadlineError = DeadlineError.InvalidInput
  } else {
    deadlineError = undefined
  }

  function parseCustomSlippage(value: string) {
    setSlippageInput(value)

    try {
      const valueAsIntFromRoundedFloat = Number.parseInt((Number.parseFloat(value) * 100).toString())
      if (!Number.isNaN(valueAsIntFromRoundedFloat) && valueAsIntFromRoundedFloat < 5000) {
        setRawSlippage(valueAsIntFromRoundedFloat)
      }
    } catch (error) {
      console.error(error)
    }
  }

  function parseCustomDeadline(value: string) {
    setDeadlineInput(value)

    try {
      const valueAsInt: number = Number.parseInt(value) * 60
      if (!Number.isNaN(valueAsInt) && valueAsInt > 0) {
        setDeadline(valueAsInt)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <AutoColumn gap="md">
      <AutoColumn gap="sm">
        <RowFixed>
          <Text fontSize="16px" bold>
            {t('Slippage Tolerance')}
          </Text>
          {/* <QuestionHelper
            text={t('Your transaction will revert if the price changes unfavorably by more than this percentage.')}
            ml="4px"
          /> */}
        </RowFixed>
        <RowFixed>
          <Text fontSize="16px" margin="13px 0 25px" bold>
            {t('If the price disadvantage exceeds this percentage, your deal will be cancelled.')}
          </Text>
        </RowFixed>
        <Flex flexWrap={['wrap', 'wrap', 'nowrap']}>
          <Grid gridTemplateColumns="1fr 1fr 1fr" gridGap="10px" mb={['8px', '8px', 0]} mr={[0, 0, '8px']}>
            <Button
              width="75px"
              height="33px"
              onClick={() => {
                setSlippageInput('')
                setRawSlippage(10)
              }}
              variant={rawSlippage === 10 ? 'primary' : 'tertiary'}
            >
              0.1%
            </Button>
            <Button
              width="75px"
              height="33px"
              onClick={() => {
                setSlippageInput('')
                setRawSlippage(50)
              }}
              variant={rawSlippage === 50 ? 'primary' : 'tertiary'}
            >
              0.5%
            </Button>
            <Button
              width="75px"
              height="33px"
              onClick={() => {
                setSlippageInput('')
                setRawSlippage(100)
              }}
              variant={rawSlippage === 100 ? 'primary' : 'tertiary'}
            >
              1%
            </Button>
          </Grid>
          <Flex alignItems="center" paddingRight="8px !important">
            <Input
              width="104px"
              height="32px"
              scale="sm"
              placeholder={(rawSlippage / 100).toFixed(2)}
              value={slippageInput}
              onBlur={() => {
                parseCustomSlippage((rawSlippage / 100).toFixed(2))
              }}
              onChange={(e) => parseCustomSlippage(e.target.value)}
              isWarning={!slippageInputIsValid}
              isSuccess={![10, 50, 100].includes(rawSlippage)}
            />
            <Text ml="8px" height="fit-content" color="text" bold>
              %
            </Text>
          </Flex>
        </Flex>
        {!!slippageError && (
          <RowBetween
            style={{
              fontSize: '14px',
              paddingTop: '7px',
              color: slippageError === SlippageError.InvalidInput ? 'red' : '#F3841E',
            }}
          >
            {slippageError === SlippageError.InvalidInput
              ? t('Enter a valid slippage percentage')
              : slippageError === SlippageError.RiskyLow
              ? t('Your transaction may fail')
              : t('Your transaction may be frontrun')}
          </RowBetween>
        )}
      </AutoColumn>

      <AutoColumn gap="sm">
        <RowFixed>
          <Text fontSize="16px" marginTop="34px" bold>
            {t('Transaction Deadline')}
          </Text>
          {/* <QuestionHelper text={t('Your transaction will revert if it is pending for more than this long.')} ml="4px" /> */}
        </RowFixed>
        <RowFixed>
          <Text fontSize="16px" margin="13px 0 25px" bold>
            {t('If the time to be processed exceeds this time, your transaction will be cancelled.')}
          </Text>
        </RowFixed>
        <RowFixed>
          <Input
            width="90px"
            scale="sm"
            color={deadlineError ? 'red' : undefined}
            onBlur={() => {
              parseCustomDeadline((deadline / 60).toString())
            }}
            placeholder={(deadline / 60).toString()}
            value={deadlineInput}
            onChange={(e) => parseCustomDeadline(e.target.value)}
          />
          <Text pl="8px" bold>
            {t('minutes')}
          </Text>
        </RowFixed>
      </AutoColumn>
    </AutoColumn>
  )
}
