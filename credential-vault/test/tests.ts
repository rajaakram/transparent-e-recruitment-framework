import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { ZeroAddress } from "ethers";
import CryptoJS from "crypto-js";
import verify_abi from "../abi/contracts/Verification.sol/Verification.json"

interface Credential {
    first_name: string,
    last_name: string,
    date_birth: string,
    place_birth: string,
    issuence_date: string,
    expiration: string,
    issuing_authority: string,
    driver_number: string,
    photo: string,
    holder_address:string,
    entitlements: Object[]
}
async function deployIssuance() {
    // the encryption algorithms and keys will be different later
    const fname = CryptoJS.AES.encrypt("John", "Secret").toString();
    const lname = CryptoJS.AES.encrypt("Doe", "Secret").toString();
    const dob = CryptoJS.AES.encrypt(new Date(1995, 11, 26).toISOString(), "Secret").toString();
    const pob = CryptoJS.AES.encrypt("New York", "Secret").toString();
    const issuence_date = CryptoJS.AES.encrypt(new Date(2000, 6, 4).toISOString(), "Secret").toString();
    const expiration = CryptoJS.AES.encrypt(new Date(2025, 6, 3).toISOString(), "Secret").toString();
    const issuing_authority = CryptoJS.AES.encrypt("DVLA", "Secret").toString();
    const driver_number = CryptoJS.AES.encrypt("12345", "Secret").toString();
    const photograph = CryptoJS.AES.encrypt("https://example.png", "Secret").toString();
    const holder_address = CryptoJS.AES.encrypt("10 Bogus Street, Example City", "Secret").toString(); 
    const entitlements = [{
        category: CryptoJS.AES.encrypt("B1", "Secret").toString(),
        valid_from: CryptoJS.AES.encrypt(new Date(2010, 3, 14).toISOString(), "Secret").toString(),
        valid_to: CryptoJS.AES.encrypt(new Date(2030, 3, 13).toISOString(), "Secret").toString(),
    },
    {
        category: CryptoJS.AES.encrypt("B2", "Secret").toString(),
        valid_from: CryptoJS.AES.encrypt(new Date(2010, 3, 14).toISOString(), "Secret").toString(),
        valid_to: CryptoJS.AES.encrypt(new Date(2020, 3, 13).toISOString(), "Secret").toString(),
    }]
    const [issuer, holder, holder2] = await ethers.getSigners();
    const Issue = await ethers.getContractFactory("Issuance");
    const issue = await Issue.deploy();
    const credential: Credential = {first_name: fname, last_name: lname, date_birth: dob, place_birth: pob, 
        issuence_date: issuence_date, expiration: expiration, issuing_authority: issuing_authority,
        driver_number: driver_number, photo: photograph, holder_address: holder_address, entitlements: entitlements}

    return { issue, holder, issuer, holder2 , credential }
}

async function issueLicence() {
    const { issue, issuer, credential, holder, holder2} = await loadFixture(deployIssuance);
    
    const tx = await issue.create(holder.address, "1234")
    // @ts-ignore linter
    const id = (await tx.wait()).logs[0].args[2]
    return { issue, issuer, tx, id, credential, holder, holder2 }
}

async function deployVerification() {
    const { issue, issuer, tx, id, credential, holder, holder2 } = await loadFixture(issueLicence);
    const verify = new ethers.Contract(await issue.verify_contract(), verify_abi, issuer)

    return { issue, issuer, id, credential, holder, holder2,  verify }
}

// IMPORTANT - sometimes in these tests the "await" keyword is inside or outside the "expect" function
// this is because it is different for bigNumber equality and all other matchings
// see docs here https://ethereum-waffle.readthedocs.io/en/latest/matchers.html
describe("Issuance", function() {
    describe("Deployment", function () {
        describe("Licence Interaction", function() {
            it("Should emit an event after licence creation", async function () {
                const { issue, issuer } = await loadFixture(deployIssuance);

                await expect(issue.create(issuer.address, "1234"))
                    .to.emit(issue, "Issue")
                    .withArgs(0)
            })
            it("Should emit an event after licence suspension", async function () {
                const { issue, id } = await loadFixture(issueLicence);

                await expect(issue.suspend(id, ""))
                    .to.emit(issue, "Suspend")
                    .withArgs(id, "")
            })
            it("Should emit an event after licence reinstation", async function () {
                const { issue, id } = await loadFixture(issueLicence);
                await issue.suspend(id, "Speeding")
                await expect(issue.reinstate(id, "Speeding ban expired"))
                    .to.emit(issue, "Reinstate")
                    .withArgs(id, "Speeding ban expired")
            })
            it("Should emit an event after licence revocation", async function () {
                const { issue, id } = await loadFixture(issueLicence);

                await expect(issue.revoke(id, "Drunk driving"))
                    .to.emit(issue, "Revoke")
                    .withArgs(id, "Drunk driving")
            })
            it("Holder should own a licence NFT after creation", async function () {
                const { issue, holder, id } = await loadFixture(issueLicence);
                expect((await issue.ownerOf(id))).to.equal(holder.address)
            })
            it("Licence NFT should be revoked properly", async function () {
                const { issue, id } = await loadFixture(issueLicence);
                expect((await issue.ownerOf(id))).to.exist
                await issue.revoke(id, "")
                expect(await issue.status(id)).to.equal(2)
            })
            it("Licence NFT should be suspended properly", async function () {
                const { issue, id } = await loadFixture(issueLicence);
                await issue.suspend(id, "")
                expect(await issue.status(id)).to.equal(1)
            })
            it("Licence NFT should be reinstated properly", async function () {
                const { issue, id } = await loadFixture(issueLicence);
                await issue.suspend(id, "")
                await issue.reinstate(id, "")
                expect(await issue.status(id)).to.equal(0)
            })
            it("NFTs should be transferable", async function () {
                const { holder, issue, id, issuer } = await loadFixture(issueLicence);
                await expect(issue.connect(holder).safeTransferFrom(holder, issuer, id)).to.not.be.reverted
            })
            it("NFT should change ownership when transfered", async function () {
                const { holder, issue, id, issuer } = await loadFixture(issueLicence);
                await issue.connect(holder).safeTransferFrom(holder, issuer, id)
                expect(await issue.ownerOf(id)).to.equal(issuer)
            })
            it("Licence NFT URI should be extractable", async function () {
                const { issue, id } = await loadFixture(issueLicence);
                await issue.tokenURI(id)
                expect(await issue.tokenURI(id)).to.equal("1234")
            })
        });
    });
    describe("Validation", function () {
        describe("Access Restrictions", function() {
            it("Only the creator of the licence contract should be able to call functions on it", async function() {
                // always checks if the owner is calling the function first before any other validation
                const { issue, issuer, holder } = await loadFixture(deployIssuance);
                await expect(issue.connect(holder).create(issuer.address, "1234"))
                .to.be.revertedWith('Only the owner can call this.');
                await expect(issue.connect(issuer).create(issuer.address, "1234"))
                .to.not.be.reverted;
                const { id } = await loadFixture(issueLicence);
                await expect(issue.connect(holder).suspend(id, ""))
                .to.be.revertedWith('Only the owner can call this.');
                await expect(issue.connect(issuer).suspend(id, ""))
                .to.not.be.reverted;
                await expect(issue.connect(holder).reinstate(id, ""))
                .to.be.revertedWith('Only the owner can call this.');
                await expect(issue.connect(issuer).reinstate(id, ""))
                .to.not.be.reverted;
                await expect(issue.connect(holder).revoke(id, ""))
                .to.be.revertedWith('Only the owner can call this.');
                await expect(issue.connect(issuer).revoke(id, ""))
                .to.not.be.reverted;
            });
            it("NFT should only be transferable by their owner", async function () {
                const { holder, issue, id, issuer } = await loadFixture(issueLicence);
                await expect(issue.connect(issuer).safeTransferFrom(holder, issuer, id)).to.be.revertedWithCustomError(issue, "ERC721InsufficientApproval")
            })
            it("NFT should not be transferable to the zero address", async function () {
                const { holder, issue, id } = await loadFixture(issueLicence);
                await expect(issue.connect(holder).safeTransferFrom(holder, ZeroAddress, id)).to.be.revertedWithCustomError(issue, "ERC721InvalidReceiver")
            })
            it("Should be unable to suspend/reinstate a revoked licence", async function () {
                const { issue, id } = await loadFixture(issueLicence);
                await issue.revoke(id, "");
                await expect(issue.suspend(id, "")).to.be.revertedWith("Credential has already been revoked.");
                await expect(issue.reinstate(id, "")).to.be.revertedWith("Credential has already been revoked.");
            })
        });
    });
});
describe("Verification", function () {
    describe("Verification Contract Interaction", function (){
        it("Verification of NFT should accept fresh licence", async function() {
            const { issue, holder,  id, verify } = await loadFixture(deployVerification);

            expect(await verify.verify(id, holder.address)).to.equal(0)
        });
        it("Verification of NFT should reject revoked licence", async function() {
            const { issue, holder,  id, verify } = await loadFixture(deployVerification);
            await issue.revoke(id, "");
            expect(await verify.verify(id, holder.address)).to.equal(2)
        });
        it("Verification of NFT should reject suspended licence", async function() {
            const { issue, holder,  id, verify } = await loadFixture(deployVerification);
            await issue.suspend(id, "");
            expect(await verify.verify(id, holder.address)).to.equal(1)
        });
        it("Verification of NFT should accept after suspension and then resinstation of licence", async function() {
            const { issue, holder,  id, verify } = await loadFixture(deployVerification);
            await issue.suspend(id, "");
            await issue.reinstate(id, "");
            expect(await verify.verify(id, holder.address)).to.equal(0)
        });
        it("Verification of NFT should reject if the owner of token is not who is specified", async function() {
            const { issue, holder, holder2, id, verify } = await loadFixture(deployVerification);
            expect(await verify.verify(id, holder2.address)).to.equal(3)
        });
    });
});
