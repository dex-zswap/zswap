import React from 'react'
import styled from 'styled-components'
import { Text, Flex, Heading, IconButton, ArrowBackIcon } from 'zswap-uikit'
import { Link } from 'react-router-dom'
import QuestionHelper from 'components/QuestionHelper'
import Settings from './Settings'
import Transactions from './Transactions'

interface Props {
  title: string
  subtitle?: string
  helper?: string
  backTo?: string
  noConfig?: boolean
}

const AppHeaderContainer = styled(Flex)`
  justify-content: space-between;
  padding: 24px;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
`

const AppHeader: React.FC<Props> = ({ title, subtitle, helper, backTo, noConfig = false }) => {
  return (
    <AppHeaderContainer>
      <Flex alignItems="center" mr={noConfig ? 0 : '16px'}>
        {backTo && (
          <IconButton as={Link} to={backTo}>
            <ArrowBackIcon width="32px" />
          </IconButton>
        )}
        <Flex flexDirection="column">
          <Heading as="h2" mb="8px">
            {title}
          </Heading>
          <Flex alignItems="center">
            {helper && <QuestionHelper text={helper} mr="4px" />}
            <Text color="textSubtle">{subtitle}</Text>
          </Flex>
        </Flex>
      </Flex>
      {!noConfig && (
        <Flex marginTop="-5px">
          <Settings />
          <Transactions />
        </Flex>
      )}
    </AppHeaderContainer>
  )
}

export default AppHeader
