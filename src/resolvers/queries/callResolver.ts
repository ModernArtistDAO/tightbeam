import { ContractCache } from '../../ContractCache'
import { ProviderSource } from '../../types/ProviderSource'

const debug = require('debug')('tightbeam:callResolver')

let count = 0

export async function callResolver(contractCache: ContractCache, providerSource: ProviderSource, opts, args, context, info) {
  let {
    name,
    abi,
    address,
    fn,
    params
  } = args

  params = params || []

  if (count == 0) {
    count++
    console.log({opts, args, context, info})
  }

  const contract = await contractCache.resolveContract({ abi, address, name })
  const identifier = JSON.stringify({ abi, name, address })

  const provider = await providerSource()

  const fnCall = contract.interface.functions[fn]
  if (!fnCall) {
    throw new Error(`Unknown function ${fn} for ${identifier}`)
  } else {
    try {
      const data = fnCall.encode(params)

      const tx = {
        data,
        to: contract.address
      }

      debug({ identifier, fn, params })

      let value
      if (context.multicallBatch && (await context.multicallBatch.isSupported())) {
        const to = await tx.to
        const data = await tx.data
        value = await context.multicallBatch.call(to, data)
      } else {
        value = await provider.call(tx)
      }

      let returns = fnCall.decode(value)
      if (fnCall.outputs.length === 1) {
          returns = returns[0];
      }
      if (Array.isArray(returns)) {
        returns = Object.assign({}, returns)
      }

      return returns
    } catch (error) {
      const msg = `${identifier} ${fn}(${JSON.stringify(params)}): ${error.message || error}`
      console.error(msg, error)
      throw msg
    }
  }
}
