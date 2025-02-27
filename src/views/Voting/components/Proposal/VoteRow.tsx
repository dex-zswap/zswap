import React from 'react'
import BigNumber from 'bignumber.js'
import { Flex, LinkExternal, Text, Tag, CheckmarkCircleIcon } from 'zswap-uikit'
import truncateWalletAddress from 'utils/truncateWalletAddress'
import { getBscScanLink } from 'utils'
import { useTranslation } from 'contexts/Localization'
import { Vote } from 'state/types'
import { IPFS_GATEWAY } from 'views/Voting/config'
import TextEllipsis from 'views/Voting/components/TextEllipsis'
import Row, { AddressColumn, ChoiceColumn, VotingPowerColumn } from './Row'

interface VoteRowProps {
  vote: Vote
  isVoter: boolean
}

const VoteRow: React.FC<VoteRowProps> = ({ vote, isVoter }) => {
  const { t } = useTranslation()
  const hasVotingPower = !!vote.metadata?.votingPower
  const votingPower = hasVotingPower ? new BigNumber(vote.metadata.votingPower).toFormat(3) : '--'

  return (
    <Row>
      <AddressColumn>
        <Flex alignItems="center">
          <LinkExternal href={getBscScanLink(vote.voter, 'address')}>{truncateWalletAddress(vote.voter)}</LinkExternal>
          {isVoter && (
            <Tag variant="success" outline ml="8px">
              <CheckmarkCircleIcon mr="4px" /> {t('Voted')}
            </Tag>
          )}
        </Flex>
      </AddressColumn>
      <ChoiceColumn>
        <TextEllipsis title={vote.proposal.choices[vote.choice - 1]}>
          {vote.proposal.choices[vote.choice - 1]}
        </TextEllipsis>
      </ChoiceColumn>
      <VotingPowerColumn>
        <Flex alignItems="center" justifyContent="end">
          <Text title={vote.metadata.votingPower}>{votingPower}</Text>
          {hasVotingPower && <LinkExternal href={`${IPFS_GATEWAY}/${vote.id}`} />}
        </Flex>
      </VotingPowerColumn>
    </Row>
  )
}

export default VoteRow
