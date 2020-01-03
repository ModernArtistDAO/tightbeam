import { ContractCache } from '../ContractCache'
import { ProviderSource } from '../types'
import { sendTransactionResolver } from './mutations'

/**
 * 
 * @param tightbeam The Tightbeam object
 */
export function bindMutationResolvers(contractCache: ContractCache, txProviderSource: ProviderSource) {
  let nextTxId = 1

  return {
    sendTransaction: function (opts, args, context, info) {
      return sendTransactionResolver(contractCache, txProviderSource, nextTxId++, opts, args, context, info)
    }
  }
}