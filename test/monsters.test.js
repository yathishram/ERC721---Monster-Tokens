const Monsters = artifacts.require("./Monsters.sol");

contract("Monsters", (accounts) => {
    let contract;

    before(async() => {
        contract = await Monsters.deployed()
    })

    describe('Monsters Contract', async () => {
        it("deploys contract", async () => {
            let address = contract.address
            assert.ok(address)
        })

        it("Mints new Monster", async () => {
            const result = await contract.mint("Test",{from:accounts[0]})
            const totalSupply = await contract.totalSupply()
            assert.equal(1,totalSupply)
        })

        it("Does not mint same token again", async() =>{
            try{
                await contract.mint("Test",{from:accounts[0]})
                assert(false)
            }catch(err){
                assert(err)
            }
        })
        it("Can transfer the tokens", async() => {
            await contract.mint("Test2", {from:accounts[1]})
            await contract.safeTransferFrom(accounts[0],accounts[1],1,{from:accounts[0]})
            const balance = await contract.balanceOf(accounts[1])
            assert.equal(2,balance)
        })
    });
    

})