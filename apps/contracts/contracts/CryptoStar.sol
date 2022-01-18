//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import 'hardhat/console.sol';

contract CryptoStar is ERC721 {
  struct Star {
    string name;
  }

  constructor() ERC721('CryptoStar', 'CS') {}

  mapping(uint256 => Star) public tokenIdToStarInfo;
  mapping(uint256 => uint256) public starsForSale;

  function createStar(string memory _name, uint256 _tokenId) public {
    Star memory newStar = Star(_name);
    tokenIdToStarInfo[_tokenId] = newStar;
    _mint(msg.sender, _tokenId);
  }

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
    transferFrom(ownerAddress, msg.sender, _tokenId);
    address payable ownerAddressPayable = payable(ownerAddress);
    ownerAddressPayable.transfer(starCost);
    if (msg.value > starCost) {
      payable(msg.sender).transfer(msg.value - starCost);
    }
  }

  function lookUptokenIdToStarInfo(uint256 _tokenId)
    public
    view
    returns (string memory)
  {
    return tokenIdToStarInfo[_tokenId].name;
  }

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

  function transferStar(address _to1, uint256 _tokenId) public {
    require(
      ownerOf(_tokenId) == msg.sender,
      'Only the owner of the Star can exchange it'
    );

    transferFrom(msg.sender, _to1, _tokenId);
  }
}
