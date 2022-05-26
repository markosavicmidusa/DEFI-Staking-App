import React, {Component} from "react";
import bank from '../bank.png'



class NavBar extends Component{

    render(){
        return(
            <nav className="navbar navbar-dark fixed-top shadow p-0" style={{backgroundColor: 'black', height:'50px'}}>
                
                <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="#" style={{color:'white'}}>
                <img src={bank} alt='bank.png' width='50' height='30' className="d-inline-block align-top" />
                &nbsp; &nbsp; Dapp Yield Staking (Decentralized Banking) 
                
                </a>
                <ul className="navbar-nav px-3">
                    <li className="text-nowrap d-none nav-item d-sm-none d-sm-block">
                        <small style={{color:'white'}}>ACCOUNT NUMBER: {this.props.account}
                        </small>
                    </li>
                </ul>
            </nav>
            
        )
    }

}

export default NavBar;