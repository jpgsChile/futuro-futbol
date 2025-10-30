// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FFRoles} from "./ff-roles.sol";

contract FFClub {
	struct Club {
		uint256 id;
		uint256 leagueId;
		string name;
		bool fixedGoalkeeper;
		address owner;
	}

	FFRoles public roles;
	uint256 public nextClubId;
	mapping(uint256 => Club) private clubs;

	event ClubCreated(uint256 indexed id, uint256 indexed leagueId, string name, bool fixedGoalkeeper, address indexed owner);

	constructor(address rolesAddress) {
		roles = FFRoles(rolesAddress);
	}

	function createClub(uint256 leagueId, string calldata name, bool fixedGoalkeeper) external returns (uint256 id) {
		require(
			roles.hasRole(roles.CLUB_ROLE(), msg.sender) || roles.hasRole(roles.DEFAULT_ADMIN_ROLE(), msg.sender),
			"Not authorized"
		);
		id = ++nextClubId;
		clubs[id] = Club({id: id, leagueId: leagueId, name: name, fixedGoalkeeper: fixedGoalkeeper, owner: msg.sender});
		emit ClubCreated(id, leagueId, name, fixedGoalkeeper, msg.sender);
	}

	function getClub(uint256 clubId) external view returns (Club memory) {
		return clubs[clubId];
	}
}
