// script that issues tokens

const DecentralBank  = artifacts.require('DecentralBank.sol');

module.exports = async function issueRewards(callback){

    let decentralBank = await DecentralBank.deployed();
    await decentralBank.issueTokens();
    console.log('The tokens have been issued successfully!');
    callback();

}