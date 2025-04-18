// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

contract Patient {
    uint public key;
    string public name;
    uint public phone;
    string public gender;

    
    constructor(uint _key,string memory _name,uint _phone,string memory _gender) {
        key = _key;
        name = _name;
        phone = _phone;
        gender = _gender;
    }
    mapping (address => bool) private isAllowed;
    
    event UserAuthorized(address indexed user);
    event UserLoggedOut(address indexed user);

    function authorizeUser(uint _pass) public {
        require(_pass == key, "Incorrect password");
        isAllowed[msg.sender] = true;
        emit UserAuthorized(msg.sender);
    }

    function logoutUser() public {
        require(isAllowed[msg.sender], "User not authorized");
        isAllowed[msg.sender] = false;
        emit UserLoggedOut(msg.sender);
    }

    function checkUser(address _addr) public view returns(bool) {
        return isAllowed[_addr];
    }
}
// contract SimpleContract {
    // string public message; // State variable to store the argument
    
    // constructor(string memory _message) {
    //     message = _message; // Storing the argument in the state variable
    // }
    
//     function setMessage(string memory _message) public {
//         message = _message;
//     }
    
//     function getMessage() public view returns (string memory) {
//         return message;
//     }
// }