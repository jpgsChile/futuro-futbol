// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FFRoles} from "./ff-roles.sol";

contract FFLeague {
	struct League {
		uint256 id;
		string name;
		string location;
		string category;
		address owner;
		uint8 verificationLevel; // 0 none, 1 verified, 2 official
	}

	FFRoles public roles;
	uint256 public nextLeagueId;
	mapping(uint256 => League) private leagues;

	event LeagueCreated(uint256 indexed id, string name, string location, string category, address indexed owner);
	event LeagueVerificationLevelUpdated(uint256 indexed id, uint8 level);

	constructor(address rolesAddress) {
		roles = FFRoles(rolesAddress);
	}

	function createLeague(string calldata name, string calldata location, string calldata category) external returns (uint256 id) {
		require(
			roles.hasRole(roles.LEAGUE_ROLE(), msg.sender) || roles.hasRole(roles.DEFAULT_ADMIN_ROLE(), msg.sender),
			"Not authorized"
		);
		id = ++nextLeagueId;
		leagues[id] = League({id: id, name: name, location: location, category: category, owner: msg.sender, verificationLevel: 0});
		emit LeagueCreated(id, name, location, category, msg.sender);
	}

	function setVerificationLevel(uint256 leagueId, uint8 level) external {
		League storage lg = leagues[leagueId];
		require(lg.owner == msg.sender || roles.hasRole(roles.DEFAULT_ADMIN_ROLE(), msg.sender), "Not league owner");
		lg.verificationLevel = level;
		emit LeagueVerificationLevelUpdated(leagueId, level);
	}

	function getLeague(uint256 leagueId) external view returns (League memory) {
		return leagues[leagueId];
	}
}
