import '@nomiclabs/hardhat-ethers'
import { expect } from 'chai'
import { ethers } from 'hardhat'
import { Contract } from 'ethers'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'

describe('CryptoStar', async () => {
  let owner1: SignerWithAddress
  let owner2: SignerWithAddress
  let contract: Contract
  let starId: number

  beforeEach(async () => {
    ;[, owner1, owner2] = await ethers.getSigners()
    starId = 1
    const CryptoStar = await ethers.getContractFactory('CryptoStar')
    contract = await CryptoStar.deploy()
    await contract.deployed()
  })

  it('Should create a Star', async function () {
    await contract.connect(owner1).createStar('Star!', starId)

    expect(await contract.tokenIdToStarInfo(starId)).to.equal('Star!')
  })

  it('Should allow owner1 to put up his star for sale', async () => {
    const sellingPrice = ethers.utils.parseUnits('.01', 'ether')
    const contractAsOwner1 = await contract.connect(owner1)

    await contractAsOwner1.createStar('star', starId)
    await contractAsOwner1.putStarUpForSale(starId, sellingPrice)

    expect(await contract.starsForSale(starId)).to.equal(sellingPrice)
  })

  it('Should allow owner1 to get funds after the sale', async () => {
    const sellingPrice = ethers.utils.parseUnits('1', 'ether')

    const contractAsOwner1 = await contract.connect(owner1)
    const contractAsOwner2 = await contract.connect(owner2)
    await contractAsOwner1.createStar('star', starId)
    await contractAsOwner1.putStarUpForSale(starId, sellingPrice)

    const balanceOfOwner1BeforeTransaction = await owner1.getBalance()

    const buyStarTx = await contractAsOwner2.buyStar(starId, {
      value: sellingPrice,
    })
    await buyStarTx.wait()

    const balanceOfOwner1AfterTransaction = await owner1.getBalance()
    expect(
      Number(balanceOfOwner1BeforeTransaction) + Number(sellingPrice),
    ).to.equal(Number(balanceOfOwner1AfterTransaction))
  })

  it('Should allow owner2 to buy a star, if it is put up for sale', async () => {
    const sellingPrice = ethers.utils.parseUnits('1', 'ether')
    const contractAsOwner1 = await contract.connect(owner1)
    const contractAsOwner2 = await contract.connect(owner2)
    await contractAsOwner1.createStar('star', starId)
    await contractAsOwner1.putStarUpForSale(starId, sellingPrice)

    const buyStarTx = await contractAsOwner2.buyStar(starId, {
      value: sellingPrice,
    })
    await buyStarTx.wait()

    expect(await contract.ownerOf(starId)).to.equal(owner2.address)
  })

  it('Should allow owner2 to buy a star and decreases its balance in ether', async () => {
    const sellingPrice = ethers.utils.parseUnits('1', 'ether')
    const contractAsOwner1 = await contract.connect(owner1)
    const contractAsOwner2 = await contract.connect(owner2)
    await contractAsOwner1.createStar('star', starId)
    await contractAsOwner1.putStarUpForSale(starId, sellingPrice)

    const balanceOfOwner2BeforeTransaction = await owner2.getBalance()
    const buyStarTx = await contractAsOwner2.buyStar(starId, {
      value: sellingPrice,
    })
    await buyStarTx.wait()
    const balanceOfOwner2AfterTransaction = await owner2.getBalance()

    expect(Number(balanceOfOwner2BeforeTransaction)).to.greaterThan(
      Number(balanceOfOwner2AfterTransaction) + Number(sellingPrice),
    )
  })

  it('Should should have a name', async () => {
    const name = await contract.name()

    expect(name).to.equal('CryptoStar')
  })

  it('Should should have a symbol', async () => {
    const symbol = await contract.symbol()

    expect(symbol).to.equal('CST')
  })

  it('Should let 2 users exchange stars', async () => {
    const contractAsOwner1 = await contract.connect(owner1)
    await contractAsOwner1.createStar('star1000', 1000)

    const contractAsOwner2 = await contract.connect(owner2)
    await contractAsOwner2.createStar('star2000', 2000)

    await contractAsOwner2.exchangeStars(1000, 2000)

    const newOwnerOfStar1000 = await contract.ownerOf(1000)
    expect(newOwnerOfStar1000).to.equal(owner2.address)

    const newOwnerOfStar2000 = await contract.ownerOf(2000)
    expect(newOwnerOfStar2000).to.equal(owner1.address)
  })

  it('lets a user transfer a star', async () => {
    const contractAsOwner1 = await contract.connect(owner1)
    await contractAsOwner1.createStar('star29', 29)

    await contractAsOwner1.transferStar(owner2.address, 29)

    expect(await contract.ownerOf(29)).to.equal(owner2.address)
  })

  it('Should add the star name properly', async () => {
    const contractAsOwner1 = await contract.connect(owner1)
    await contractAsOwner1.createStar('star', 50)

    const starName = await contract.tokenIdToStarInfo(50)

    expect(starName).to.equal('star')
  })
})
