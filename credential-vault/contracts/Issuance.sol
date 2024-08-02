// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./Verification.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";


contract Issuance is ERC721URIStorage {
    address public owner;
    uint256 private totalMints;
    // status codes:
    // 0 - valid (not suspended or revoked)
    // 1 - suspended
    // 2 - revoked
    mapping (uint256 => uint8) public status;
    Verification public verify_contract;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this.");
        _;
    }

    modifier notRevoked(uint256 id) {
        require(status[id] != 2, "Credential has already been revoked.");
        _;
    }
    event Issue(uint256 id);
    event Revoke(uint256 id, string reason);
    event Suspend(uint256 id, string reason);
    event Reinstate(uint256 id, string reason);

    // Called upon contract creation. Sets the name of the NFT token to "Verifiable Credential",
    // initialises contract owner as the initial creator and deploys a linked verification contract
    // to verify tokens created from this contract.
    constructor() ERC721("Verifiable Credential", "VC") {
        owner = msg.sender;
        totalMints = 0;
        verify_contract = new Verification();
    }

    // Creates a NFT from a IPFS CID and transferes ownership to address specified.
    // parameters: 
    // - address to: virtual address of the credential NFT owner
    // - string CID: takes the URI of the credential document
    // returns:
    // - uint256 id: identifier of the NFT
    function create(address holder, string memory URI) public onlyOwner returns (uint256 id) {
        // change state first then emit changes
        id = totalMints++;
        status[id] = 0;
        _safeMint(holder, id);
        _setTokenURI(id, URI);
        emit Issue(id);
        return id;
    }

    // in accordance with W3C VC data model, the "reason" parameter is added. This parameter is optional
    // however, solidity does not provide support for optional parameters in functions.
    // This functionality could be done through function overloading, however for the sake of keeping gas costs down,
    // if an issuer wishes to provide 'no reason' for revoke/suspend they can do so by supplying an empty string

    // Revokes a NFT. Can never be used again or reinstated.
    // parameters: 
    // - uint256 id: identifier of the NFT
    // - string reason: a string detailing the reason for revocation
    function revoke(uint256 id, string memory reason) public onlyOwner {
        status[id] = 2;
        emit Revoke(id, reason);
    }
    // Suspends a NFT. Can be used again if reinstated, using reinstate() method.
    // parameters: 
    // - uint256 id: identifier of the NFT
    // - string reason: a string detailing the reason for revocation
    function suspend(uint256 id, string memory reason) public onlyOwner notRevoked(id) {
        status[id] = 1;
        emit Suspend(id, reason);
    }
    // Suspends a NFT. Can be used again if reinstated, using reinstate() method.
    // parameters: 
    // - uint256 id: identifier of the NFT
    // - string reason: a string detailing the reason for revocation
    function reinstate(uint256 id, string memory reason) public onlyOwner notRevoked(id) {
        status[id] = 0;
        emit Reinstate(id, reason);
    }

    /**
     * @dev Burns `tokenId`. See {ERC721-_burn}.
     *
     * Requirements:
     *
     * - The caller must own `tokenId` or be an approved operator.
     */
    function burn(uint256 tokenId) public virtual {
        // Setting an "auth" arguments enables the `_isAuthorized` check which verifies that the token exists
        // (from != 0). Therefore, it is not needed to verify that the return value is not 0 here.
        _update(address(0), tokenId, _msgSender());
    }
}