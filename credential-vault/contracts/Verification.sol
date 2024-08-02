// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.20;

import "contracts/Issuance.sol";
contract Verification {

    Issuance public issue_contract;
    // Called upon contract creation. Saves the address of 
    // deployment sender. Sender will always be the issuance smart contract
    constructor(){
        issue_contract = Issuance(msg.sender);
    }

    function verify(uint256 token_id, address holder) view public returns (uint8 valid){
        // returns status uint codes:
        // 0 - Token is valid
        // 1 - token is suspended
        // 2 - token and owner valid
        // 3 - supplied address is not the owner of the token
        // note: this function can throw an ERC721NonexistentToken error, in which case the token was revoked or never existed
        if(issue_contract.ownerOf(token_id) != holder){
            return 3;
        } 
        else if(issue_contract.status(token_id) == 1){
            return 1;
        }
        else if(issue_contract.status(token_id) == 2){
            return 2;
        }
        else{
            return 0;
        }
    }
}
