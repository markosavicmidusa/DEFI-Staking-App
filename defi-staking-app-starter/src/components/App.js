import React, {Component} from "react";
import NavBar from "./NavBar";
import Main from "./Main";
import Web3 from 'web3'
import Tether from '../truffle_abis/Tether.json'
import RWD from '../truffle_abis/RWD.json'
import DecentralBank from '../truffle_abis/DecentralBank.json'
import ParticleSettings from "./ParticleSettings";

class App extends Component{
    // React code goes here
    


    async UNSAFE_componentWillMount(){
        await this.loadWeb3()
        await this.loadBlockchainData()
    }

    // connecting to Etherium
    async loadWeb3(){

        if(window.ethereum){
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        }else if(window.web3){
            window.web3 = new Web3(window.web3.currentProvider)
        }else{
            alert('No etherium browser detected! You can checkout Metamask !');
        }
    }

    // Getting the account
    async loadBlockchainData(){

        const web3 = window.web3
        const accounts = await web3.eth.getAccounts()
        console.log(accounts)
        this.setState({account: accounts[0]})
        
        // bring the contracts
        const networkId = await web3.eth.net.getId()
        //console.log(networkId, 'Network Id')
        
        //Load tether contract
        const tetherData = Tether.networks[networkId]
        if(tetherData){
            const tether = new web3.eth.Contract(Tether.abi, tetherData.address)
            this.setState({tether});
            let tetherBalance = await tether.methods.balanceOf(this.state.account).call()
            this.setState({tetherBalance: tetherBalance.toString()})
           // console.log({balance: tetherBalance})
        }else{
            alert('Tether contract not deployed to detected network')
        }

        // Load the RWD contract

        const rwdData= RWD.networks[networkId]
        if(rwdData){

            const rwd = new web3.eth.Contract(RWD.abi, rwdData.address)
            this.setState({rwd})
            const rwdBalance = await rwd.methods.balanceOf(this.state.account).call()
            this.setState({rwdBalance: rwdBalance.toString()})
            //console.log({rwdBalance: rwdBalance})

        }else{
            alert('RWD contract not deployed to detected network')
        }


        // Load Decentral Bank contract
        const decentralBankData = DecentralBank.networks[networkId]
      // console.log(decentralBankData.address)
        if(decentralBankData){
            console.log(decentralBankData)
            const decentralBank = new web3.eth.Contract(DecentralBank.abi, decentralBankData.address);
            this.setState({decentralBank})
            // UNDEFINED console.log(this.state.decentralBank.address, 'this.state.decentralBank.address')
            // console.log(this.state.decentralBank._address, 'this.state.decentralBank._address')
            let stakingBalance = await decentralBank.methods.stakingBalance(this.state.account).call()
            this.setState({stakingBalance: stakingBalance.toString()})
            //console.log({stakingBalance: stakingBalance})
        }else{
            alert('Decentral Bank Contract not deployed to detected network')
        }

        this.setState({loading: false})

    }

    // two functions one that stakes and the one that unstakes
    // leverage our decentral bank contract - deposit tokens and unstaking
   
    // STAKING FUNCTION:
    // depositTokens transferfrom...
    // function approve transaction hash ---
    // STAKING FUNCTION ?? >> decentralBank.depositTokens(send send transaction hash)

    stakeTokens = (amount) => {
        this.setState({loading: true })
        this.state.tether.methods.approve(this.state.decentralBank._address, amount).send({from: this.state.account}).on('transactionHash', (hash) => {
          this.state.decentralBank.methods.depositeTokens(amount).send({from: this.state.account}).on('transactionHash', (hash) => {
            this.setState({loading:false})
          })
        }) 
      }

    // UNSTAKING FUNCTION:
   unstakeTokens = () => {
        this.setState({loading: true})
        this.state.decentralBank.methods.unstakeTokens().send({from: this.state.account}).on('transactionHash', (hash) =>{
            this.setState({loading: false})
        })
    
    }



    constructor(props){
        super(props)
        this.state = {
            account: '0x0',
            tether: {},
            rwd: {},
            decentralBank: {},
            tetherBalance: '0',
            rwdBalance: '0',
            stakingBalance: '0',
            loading: true
        }
    }

    render(){

        let content
        {this.state.loading ? 
        content = <h3 id='loader' className="text-center" style={{margin:'30px', color:'white'}}>LOADING PLEASE...</h3> : content= 
        <Main 
            tetherBalance={this.state.tetherBalance}
            rwdBalance = {this.state.rwdBalance}
            stakingBalance = {this.state.stakingBalance}
            stakeTokens = {this.stakeTokens}
            unstakeTokens = {this.unstakeTokens}
            decentralBank ={this.state.decentralBank}
        />}

        return(
            <div style={{position: 'relative'}}>
                <div style={{position: 'absolute'}}>
                    <ParticleSettings/>
                </div>
                <NavBar account={this.state.account}/>
                <div className="container-fluid mt-5" >
                    <div className="row">
                        <main role='main' className="col-lg-12 ml-auto mr-auto" style={{maxWidth:'600px', minHeight:'100vh'}}>
                            {content}
                        </main>
                    </div>
                </div>
            </div>
        )
    }

}

export default App;