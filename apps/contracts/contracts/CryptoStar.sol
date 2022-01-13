//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import 'hardhat/console.sol';

contract CryptoStar is ERC721 {
  struct Star {
    string name;
  }

  constructor() ERC721('CryptoStar', 'CS') {}

  // mapping the Star with the Owner Address
  mapping(uint256 => Star) public tokenIdToStarInfo;
  // mapping the TokenId and price
  mapping(uint256 => uint256) public starsForSale;

  // Create Star using the Struct
  function createStar(string memory _name, uint256 _tokenId) public {
    // Passing the name and tokenId as a parameters
    Star memory newStar = Star(_name); // Star is an struct so we are creating a new Star
    tokenIdToStarInfo[_tokenId] = newStar; // Creating in memory the Star -> tokenId mapping
    _mint(msg.sender, _tokenId); // _mint assign the the star with _tokenId to the sender address (ownership)
  }

  // Putting an Star for sale (Adding the star tokenid into the mapping starsForSale, first verify that the sender is the owner)
  function putStarUpForSale(uint256 _tokenId, uint256 _price) public {
    require(
      ownerOf(_tokenId) == msg.sender,
      "You can't sale the Star you don't owned"
    );
    starsForSale[_tokenId] = _price;
  }

  function buyStar(uint256 _tokenId) public payable {
    require(starsForSale[_tokenId] > 0, 'The Star should be up for sale');
    uint256 starCost = starsForSale[_tokenId];
    address ownerAddress = ownerOf(_tokenId);
    require(msg.value > starCost, 'You need to have enough Ether');
    transferFrom(ownerAddress, msg.sender, _tokenId); // We can't use _addTokenTo or_removeTokenFrom functions, now we have to use _transferFrom
    address payable ownerAddressPayable = payable(ownerAddress); // We need to make this conversion to be able to use transfer() function to transfer ethers
    ownerAddressPayable.transfer(starCost);
    if (msg.value > starCost) {
      payable(msg.sender).transfer(msg.value - starCost);
    }
  }

  // Implement Task 1 lookUptokenIdToStarInfo
  function lookUptokenIdToStarInfo(uint256 _tokenId)
    public
    view
    returns (string memory)
  {
    return tokenIdToStarInfo[_tokenId].name;
  }

  // Implement Task 1 Exchange Stars function
  function exchangeStars(uint256 _tokenId1, uint256 _tokenId2) public {
    address ownerAddress1 = ownerOf(_tokenId1);
    address ownerAddress2 = ownerOf(_tokenId2);
    require(
      ownerAddress1 == msg.sender || ownerAddress2 == msg.sender,
      'Only the owner of the Star can exchange it'
    );

    transferFrom(ownerAddress1, ownerAddress2, _tokenId1);
    transferFrom(ownerAddress2, ownerAddress1, _tokenId2);
  }

  // Implement Task 1 Transfer Stars
  function transferStar(address _to1, uint256 _tokenId) public {
    require(
      ownerOf(_tokenId) == msg.sender,
      'Only the owner of the Star can exchange it'
    );

    transferFrom(msg.sender, _to1, _tokenId);
  }
}
