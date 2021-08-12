export enum TransactionType {
  TRANSFER_IN = 1,
  TRANSFER_OUT = 2,
}

export enum TransactionStatus {
  SUCCESS = 1,
  FAILURE = 2,
}

export enum TransactionCategory {
  PLAIN = 1,
  FINANCIAL = 2,
  MINING = 3,
  DIVIDENDS = 4,
  FEE = 5,
  REGISTRATION = 101,
  CROSS_CHAIN_IN = 102,
  CROSS_CHAIN_OUT = 103,
  RECIVE_INCOME = 104,
  REDEMPTION = 105,
  PLEDGE = 106,
}

type TransactionRecord = Partial<{
  txId: string
  srcAddr: string
  dstAddr: string
  coinType: string
  tranAmt: number
  tranFee: number
  tranType: TransactionType
  tranState: TransactionStatus
  createTime: number
  updateTime: number
  bak: string
  nonce: string
  gasLimit: string
  gwei: string
  mainCoinType: string
  category: TransactionCategory
}>

interface ReporterInterface {
  cacheHash(hash: string, transitionInfo: TransactionRecord): void
  recordHash(hash: string, transitionInfo: TransactionRecord): void
}

class Reporter implements ReporterInterface {
  private hashMaps = {}

  cacheHash(hash: string, transitionInfo: TransactionRecord) {
    this.hashMaps[hash] = transitionInfo
  }
  recordHash(hash: string, transitionInfo: TransactionRecord) {
    const storagedHash: TransactionRecord = this.hashMaps[hash]
    const postHashInfo: TransactionRecord = Object.assign(this.hashMaps[hash], transitionInfo)

    //  TODO: 发送一步请求
  }
}

const reporter: Reporter = new Reporter()

export default reporter
