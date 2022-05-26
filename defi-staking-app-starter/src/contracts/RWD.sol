pragma solidity ^0.8.4;

contract RWD {

    string public name = 'Reward Token';
    string public symbol = 'RWD';
    uint256 public totalSupply = 1000000000000000000000000; // 1 token 1(+18 zeros), 1 million tokens  1(+18 zeros)(+6zeros)
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

    function transferFrom(address _from , address _to, uint256 _value) public returns(bool success){

        require(balanceOf[_from] >= _value);
        require(allowance[msg.sender][_from] >= _value);
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[msg.sender][_from] = _value;
        emit Transfer(_from, _to, _value);
        return true;
    }

    function approve(address _spender, uint _value)public returns(bool success){
        allowance[msg.sender][_spender] = _value;
        address _owner = msg.sender;
        emit Approval(_owner, _spender, _value);
        return true;
    }



}