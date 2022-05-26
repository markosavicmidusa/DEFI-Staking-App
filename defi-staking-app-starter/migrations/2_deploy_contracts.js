const Tether = artifacts.require('Tether');
const RWD = artifacts.require('RWD');
const DecentralBank = artifacts.require('DecentralBank');

module.exports = async function(deployer, network, accounts){
    
    // Deploy MOck Tether Contract    
    await deployer.deploy(Tether)
    const tether = await Tether.deployed();

    // Deploy RWD contract
    await deployer.deploy(RWD)
    const rwd = await RWD.deployed();
    
    // Deploy Decentral Bank
    await deployer.deploy(DecentralBank, rwd.address, tether.address)
    const decentralBank = await DecentralBank.deployed(); 

    // Transfer all RWD tokens to decentral bank 1 milion tokens
    await rwd.transfer(decentralBank.address, '1000000000000000000000000');

    //transfer 100 tether tokens
    await tether.transfer(accounts[1], '100000000000000000000');


}