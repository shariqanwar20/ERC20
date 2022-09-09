// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

error ERC20__NotEnoughBalance();
error ERC20__NotEnoughApprovedBalance();

contract ERC20 {
    string private _name;
    string private _symbol;
    uint8 private immutable i_decimals;
    uint256 private immutable i_totalSupply;

    mapping(address => uint256) _balance;
    mapping(address => mapping(address => uint256)) _allowance;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint256 _totalSupply
    ) {
        _name = _name;
        _symbol = _symbol;
        i_decimals = _decimals;
        i_totalSupply = _totalSupply;
        _balance[msg.sender] = _totalSupply;
    }

    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function decimals() public view returns (uint8) {
        return i_decimals;
    }

    function totalSupply() public view returns (uint256) {
        return i_totalSupply;
    }

    function balanceOf(address _owner) public view returns (uint256 balance) {
        return _balance[_owner];
    }

    function transfer(address _to, uint256 _value)
        public
        returns (bool success)
    {
        if (_balance[msg.sender] < _value) revert ERC20__NotEnoughBalance();

        _balance[msg.sender] -= _value;
        _balance[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        if (_balance[_from] < _value) revert ERC20__NotEnoughBalance();
        if (_allowance[_from][_to] < _value)
            revert ERC20__NotEnoughApprovedBalance();

        _balance[_from] -= _value;
        _balance[_to] += _value;
        _allowance[_from][_to] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value)
        public
        returns (bool success)
    {
        if (_balance[msg.sender] < _value) revert ERC20__NotEnoughBalance();
        _allowance[msg.sender][_spender] = _value;

        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function allowance(address _owner, address _spender)
        public
        view
        returns (uint256 remaining)
    {
        return _allowance[_owner][_spender];
    }
}
