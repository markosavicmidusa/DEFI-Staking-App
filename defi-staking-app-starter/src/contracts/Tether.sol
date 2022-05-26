pragma solidity ^0.8.4;

contract Tether {

    string public name = 'Tether';
    string public symbol = 'USDT';
    uint public totalSupply = 1000000000000000000000000; // 1 token 1(+18 zeros), 1 million tokens  1(+18 zeros)(+6zeros)
    uint8 public decimals = 18;


   event Transfer(

       address indexed _from,
       address indexed _to,
       uint indexed _value
   );

   event Approval(

       address indexed _owner,
       address indexed _spender,
       uint indexed _value

   );


    mapping(address => uint256 ) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    constructor() public {
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address _to, uint _value) public returns(bool success){

        // restriction
        require(balanceOf[msg.sender] >= _value); 
        // where we reducing the total amount, total supply for the current value
        balanceOf[msg.sender] -= _value;
        // where we add the total amount, total supply for receiver
        balanceOf[_to] += _value;
        address _from = msg.sender;  
        emit Transfer(_from, _to, _value);
        return true;
    }

    function transferFrom(address _from , address _to, uint _value) public returns(bool success){

        require(balanceOf[_from] >= _value);
        require(allowance[_from][msg.sender] >= _value);
        balanceOf[_to] += _value;
        balanceOf[_from] -= _value;
        allowance[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }

    function approve(address _spender, uint _value) public returns (bool success){
        
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }



}