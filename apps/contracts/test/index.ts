import { expect } from 'chai'
import { ethers } from 'hardhat'

describe('CryptoStar', async () => {
  let owner1: string, owner2: string
  let contract: string
  let starId: number

  beforeEach(async () => {
    ;[, owner1, owner2] = await ethers.getSigners()
    starId = 1

    const starNotaryV2 = await ethers.getContractFactory('StarNotaryV2')
    contract = await starNotaryV2.deploy()
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
    const receipt = await buyStarTx.wait()
    const balanceOfOwner2AfterTransaction = await owner2.getBalance()

    const gasPrice = buyStarTx.gasPrice.toString()
    const gasUsed = receipt.gasUsed.toString()
    const effectiveGasPrice = receipt.effectiveGasPrice.toString()
    console.log(receipt)

    console.log(
      Number(balanceOfOwner2BeforeTransaction) -
      Number(balanceOfOwner2AfterTransaction) -
      Number(sellingPrice) -
      Number(gasPrice) -
      Number(gasUsed),
    )

    expect(Number(balanceOfOwner2BeforeTransaction)).to.greaterThan(
      Number(balanceOfOwner2AfterTransaction) + Number(sellingPrice),
    )
  })

  // it('can add the star name and star symbol properly', async () => {
  //     // 1. create a Star with different tokenId
  //     //2. Call the name and symbol properties in your Smart Contract and compare with the name and symbol provided
  // });

  // it('lets 2 users exchange stars', async () => {
  //     // 1. create 2 Stars with different tokenId
  //     // 2. Call the exchangeStars functions implemented in the Smart Contract
  //     // 3. Verify that the owners changed
  // });

  // it('lets a user transfer a star', async () => {
  //     // 1. create a Star with different tokenId
  //     // 2. use the transferStar function implemented in the Smart Contract
  //     // 3. Verify the star owner changed.
  // });

  // it('lookUptokenIdToStarInfo test', async () => {
  //     // 1. create a Star with different tokenId
  //     // 2. Call your method lookUptokenIdToStarInfo
  //     // 3. Verify if you Star name is the same
  // });
})
