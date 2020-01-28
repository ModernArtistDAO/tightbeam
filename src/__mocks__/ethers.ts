const ethersOriginal = jest.requireActual('ethers')

export const ethers = {
  utils: {
    Interface: jest.fn(),
    bigNumberify: ethersOriginal.utils.bigNumberify,
    defaultAbiCoder: ethersOriginal.utils.defaultAbiCoder,
    getAddress: ethersOriginal.utils.getAddress
  },
  Contract: jest.fn()
}