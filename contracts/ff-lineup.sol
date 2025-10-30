// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FFRoles} from "./ff-roles.sol";

contract FFLineup {
	FFRoles public roles;

	// gameId => clubId => players
	mapping(uint256 => mapping(uint256 => uint256[])) private lineups;

	event LineupAdded(uint256 indexed gameId, uint256 indexed clubId, uint256 indexed playerId, address executor);
	event LineupRemoved(uint256 indexed gameId, uint256 indexed clubId, uint256 indexed playerId, address executor);

	constructor(address rolesAddress) {
		roles = FFRoles(rolesAddress);
	}

	function addToLineup(uint256 gameId, uint256 clubId, uint256 playerId) external {
		require(
			roles.hasRole(roles.CLUB_ROLE(), msg.sender) || roles.hasRole(roles.DEFAULT_ADMIN_ROLE(), msg.sender),
			"Not authorized"
		);
		lineups[gameId][clubId].push(playerId);
		emit LineupAdded(gameId, clubId, playerId, msg.sender);
	}

	function removeFromLineup(uint256 gameId, uint256 clubId, uint256 playerId) external {
		require(
			roles.hasRole(roles.CLUB_ROLE(), msg.sender) || roles.hasRole(roles.DEFAULT_ADMIN_ROLE(), msg.sender),
			"Not authorized"
		);
		uint256[] storage arr = lineups[gameId][clubId];
		for (uint256 i = 0; i < arr.length; i++) {
			if (arr[i] == playerId) {
				arr[i] = arr[arr.length - 1];
				arr.pop();
				break;
			}
		}
		emit LineupRemoved(gameId, clubId, playerId, msg.sender);
	}

	function getLineup(uint256 gameId, uint256 clubId) external view returns (uint256[] memory) {
		return lineups[gameId][clubId];
	}
}
