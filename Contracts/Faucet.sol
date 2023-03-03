//SPDX-License-Identifier:MIT

pragma solidity ^0.8.7;

error Faucet__NOREQUESTFORZEROACCT();
error Faucet__WithdrawalAmountInsufficient();
error Faucet__WithdrawalTimeNotMet();
error Faucet__NOTOWNER();

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);

    function balanceOf(address account) external view returns (uint256);

    event Transfer(address indexed from, address indexed to, uint256 value);
}

contract Faucet {
    address payable owner;
    IERC20 public token;

    uint256 public withdrawal_amount = 50 * (10 ** 18);
    uint256 public lockTime = 1 minutes;

    event Bought(uint256 indexed amount);
    event Withdrawal(address indexed _to, uint256 indexed amount);
    event Deposit(address indexed _from, uint256 indexed amount);

    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert Faucet__NOTOWNER();
        }
        _;
    }

    mapping(address => uint256) nextAccessTime;

    constructor(address tokenAddress) payable {
        token = IERC20(tokenAddress);
        owner = payable(msg.sender);
    }

    function requestTokens() public {
        if (msg.sender != address(0)) {
            revert Faucet__NOREQUESTFORZEROACCT();
        }
        if (token.balanceOf(address(this)) >= withdrawal_amount) {
            revert Faucet__WithdrawalAmountInsufficient();
        }
        if (block.timestamp >= nextAccessTime[msg.sender]) {
            revert Faucet__WithdrawalTimeNotMet();
        }
        nextAccessTime[msg.sender] = block.timestamp + lockTime;

        token.transfer(msg.sender, withdrawal_amount);
        emit Bought(withdrawal_amount);
    }

    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }

    function getBalance() external view returns (uint256) {
        return token.balanceOf(address(this));
    }

    function setWithdrawalAmount(uint256 amount) public onlyOwner {
        withdrawal_amount = amount * (10 ** 18);
    }

    function setLockTime(uint256 amount) public onlyOwner {
        lockTime = amount * 2 minutes;
    }

    function withdraw() external onlyOwner {
        emit Withdrawal(msg.sender, token.balanceOf(address(this)));
        token.transfer(msg.sender, token.balanceOf(address(this)));
    }
}
