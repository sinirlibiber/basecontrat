// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title BuilderCodeRegistry (ERC-8021)
 * @dev Registry contract for mapping builder codes to developer addresses
 * Builder codes enable automated revenue attribution for application developers
 */
contract BuilderCodeRegistry {
    // Mapping from builder code to developer address
    mapping(bytes32 => address) public codeToAddress;
    
    // Mapping to check if a code is already registered
    mapping(bytes32 => bool) public isCodeRegistered;
    
    // Mapping from address to their registered codes
    mapping(address => bytes32[]) public addressToCodes;
    
    // Event emitted when a code is registered
    event CodeRegistered(bytes32 indexed code, address indexed developer);
    
    // Event emitted when a code is transferred
    event CodeTransferred(bytes32 indexed code, address indexed from, address indexed to);
    
    /**
     * @dev Register a builder code to the sender's address
     * @param code The builder code to register (must be unique)
     */
    function registerCode(bytes32 code) external {
        require(!isCodeRegistered[code], "Code already registered");
        require(code != bytes32(0), "Invalid code");
        
        codeToAddress[code] = msg.sender;
        isCodeRegistered[code] = true;
        addressToCodes[msg.sender].push(code);
        
        emit CodeRegistered(code, msg.sender);
    }
    
    /**
     * @dev Register multiple builder codes at once
     * @param codes Array of builder codes to register
     */
    function registerMultipleCodes(bytes32[] calldata codes) external {
        for (uint256 i = 0; i < codes.length; i++) {
            bytes32 code = codes[i];
            require(!isCodeRegistered[code], "Code already registered");
            require(code != bytes32(0), "Invalid code");
            
            codeToAddress[code] = msg.sender;
            isCodeRegistered[code] = true;
            addressToCodes[msg.sender].push(code);
            
            emit CodeRegistered(code, msg.sender);
        }
    }
    
    /**
     * @dev Transfer a builder code to a new address
     * @param code The builder code to transfer
     * @param newAddress The address to transfer the code to
     */
    function transferCode(bytes32 code, address newAddress) external {
        require(isCodeRegistered[code], "Code not registered");
        require(codeToAddress[code] == msg.sender, "Not code owner");
        require(newAddress != address(0), "Invalid address");
        
        address oldAddress = msg.sender;
        codeToAddress[code] = newAddress;
        addressToCodes[newAddress].push(code);
        
        // Remove from old address's codes
        bytes32[] storage oldCodes = addressToCodes[oldAddress];
        for (uint256 i = 0; i < oldCodes.length; i++) {
            if (oldCodes[i] == code) {
                oldCodes[i] = oldCodes[oldCodes.length - 1];
                oldCodes.pop();
                break;
            }
        }
        
        emit CodeTransferred(code, oldAddress, newAddress);
    }
    
    /**
     * @dev Get the developer address for a given code
     * @param code The builder code to look up
     * @return The address associated with the code
     */
    function getAddress(bytes32 code) external view returns (address) {
        require(isCodeRegistered[code], "Code not registered");
        return codeToAddress[code];
    }
    
    /**
     * @dev Check if a code is registered
     * @param code The builder code to check
     * @return True if the code is registered
     */
    function isRegistered(bytes32 code) external view returns (bool) {
        return isCodeRegistered[code];
    }
    
    /**
     * @dev Get all codes registered by an address
     * @param developer The address to look up
     * @return Array of builder codes
     */
    function getCodesByAddress(address developer) external view returns (bytes32[] memory) {
        return addressToCodes[developer];
    }
    
    /**
     * @dev Get the total number of codes registered by an address
     * @param developer The address to look up
     * @return The number of codes
     */
    function getCodeCount(address developer) external view returns (uint256) {
        return addressToCodes[developer].length;
    }
}
