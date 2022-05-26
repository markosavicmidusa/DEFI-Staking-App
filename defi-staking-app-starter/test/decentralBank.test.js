const RWD = artifacts.require('RWD.sol')
const Tether = artifacts.require('Tether.sol')
const DecentralBank = artifacts.require('DecentralBank.sol')

require('chai')
.use(require('chai-as-promised'))
.should()

contract('DecentralBank', ([owner, customer]) => {

    let tether, tetherName, rwd, rwdName, decentralBank, rewardTokens;
    
    function tokens(number){
        return web3.utils.toWei(number, 'Ether')
    }

    
    before( async () => {
        //tether
       tether = await Tether.new()
       tetherName = await tether.name()
        // reward
       rwd = await RWD.new()
       rwdName = await rwd.name()

       //bank
       decentralBank = await DecentralBank.new(tether.address, rwd.address);

       //Transfer all tokens to Decentral bank (1 million)
       await rwd.transfer(decentralBank.address, tokens('1000000'));

       // Transfer 100 mock Tethers to Customer
       await tether.transfer(customer, tokens('100'), {from: owner});
       
    })


    // All of our code goes here  // this is a arrow function
    describe('Tether Deployment', async () => {
        it('matches name successfully', async () =>{
       
            assert.equal(tetherName, 'Tether')
        })
    })

    describe('Reward Token Deployment', async () => {
        it('matches name successfully', async () =>{
        
            assert.equal(rwdName, 'Reward Token')
        })
    })

    describe('Decentral Bank Deployment', async () =>{
        it('matches name successfully', async () =>{
            const name = await decentralBank.name()
            assert.equal(name, 'DecentralBank')
        })
        it('matches balance successfully', async () => {
            const balance = await rwd.balanceOf(decentralBank.address)
            assert.equal(balance, tokens('1000000'))
        })

    })

    describe('Yield farming', async () => {
        it('checking reward tokens for staking', async () =>{

            let result;

            // Check Investors balance
            result = await tether.balanceOf(customer);
            assert.equal(result.toString(), tokens('100'), 'Customer balance before staking ');
            
            //Check Staking For Customer
            await tether.approve(decentralBank.address, tokens('100'), {from: customer});
            await decentralBank.depositeTokens(tokens('100'), {from: customer});

            // Check updated balance of the customer
            updatedResult =await tether.balanceOf(customer);
            assert.equal(updatedResult.toString(), tokens('0'),'Customer balance after staking 100 tokens');
            
            // Checking the result of the decentral bank deposit
            decentralBankBalance = await decentralBank.stakingBalance(customer);
            assert.equal(decentralBankBalance.toString(),tokens('100'), 'Bank balance after staking 1000100' );

            //Checking the isStaking
            isStaking = await decentralBank.isStaking(customer);
            assert.equal('true', isStaking.toString(), 'Customer stacking status after staking is true');


            // Checking if the sum of the reward token is 1/9 of the total deposit value
            await decentralBank.issueTokens({from:owner});
            

            // Ensure Only the owner ca issue tokens
            // mistake
            await decentralBank.issueTokens({from:customer}).should.be.rejected;

            // Unstake Tokens 

            await decentralBank.unstakeTokens({from:customer});

            // Check unstaking balances
            result = await tether.balanceOf(customer);
            assert.equal(result.toString(), tokens('100'), 'Checking the customer balance after unstaking ');

            //Checking the isStaking after unstaking
            result = await tether.balanceOf(decentralBank.address);
            assert.equal(result.toString(), tokens('0'), 'Checking the Bank balance after unstakin Tokens');

            //Checking the isStaking after unstaking
            isStaking = await decentralBank.isStaking(customer);
            assert.equal('false', isStaking.toString(), 'Customer stacking status after staking is true');

        })

    })

})



// const randomNumber = () => Math.random;

//document.addEventListener('click', () => console.log('click'))

// arrow functions because key word this...Arrow function can acces global variables this.name
// if it is a regular function it needs to be redefined in the scope, cannot read directly