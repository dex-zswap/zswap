import React from 'react'
import { BlockIcon, CheckmarkCircleIcon, Flex, Link, ArrowRightIcon, RefreshIcon } from 'zswap-uikit'
import styled from 'styled-components'
import { TransactionDetails } from 'state/transactions/reducer'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { getBscScanLink } from 'utils'

interface TransactionRowProps {
  txn: TransactionDetails
}

const TxnIcon = styled(Flex)`
  align-items: center;
  flex: none;
`

const Summary = styled.div`
  flex: 1;
  padding-right: 20px;
`

const TxnLink = styled(Link)`
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  margin-bottom: 16px;
  width: 100% !important;

  &:hover {
    text-decoration: none;
  }
`

const renderIcon = (txn: TransactionDetails) => {
  if (!txn.receipt) {
    return <RefreshIcon spin width="24px" />
  }

  return txn.receipt?.status === 1 || typeof txn.receipt?.status === 'undefined' ? (
    <CheckmarkCircleIcon color="success" width="24px" />
  ) : (
    <BlockIcon color="failure" width="20px" />
  )
}

const TransactionRow: React.FC<TransactionRowProps> = ({ txn }) => {
  const { chainId } = useActiveWeb3React()

  if (!txn) {
    return null
  }

  return (
    <TxnLink href={getBscScanLink(txn.hash, 'transaction', chainId)} external>
      <Summary>{txn.summary ?? txn.hash}</Summary>
      <TxnIcon>
        <TxnIcon>{renderIcon(txn)}</TxnIcon>
        <ArrowRightIcon marginLeft="10px" width="15px" color="text" />
      </TxnIcon>
    </TxnLink>
  )
}

export default TransactionRow
