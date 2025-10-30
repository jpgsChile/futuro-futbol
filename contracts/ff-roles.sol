// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

contract FFRoles is AccessControl {
	bytes32 public constant LEAGUE_ROLE = keccak256("LEAGUE_ROLE");
	bytes32 public constant CLUB_ROLE = keccak256("CLUB_ROLE");
	bytes32 public constant REFEREE_ROLE = keccak256("REFEREE_ROLE");
	bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
	bytes32 public constant GUARDIAN_ROLE = keccak256("GUARDIAN_ROLE");

	event RoleAssigned(bytes32 indexed role, address indexed account, address indexed sender);

	constructor() {
		_grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
	}

	function assignRole(bytes32 role, address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
		_grantRole(role, account);
		emit RoleAssigned(role, account, msg.sender);
	}
}
