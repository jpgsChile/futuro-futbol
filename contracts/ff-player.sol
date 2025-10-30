// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FFRoles} from "./ff-roles.sol";

contract FFPlayer {
	enum Visibility { Public, Restricted }

	struct Player {
		uint256 id;
		address account;
		string fullName;
		string nickname;
		uint8 primaryPosition; // 0-10 por ejemplo
		uint8 secondaryPosition; // opcional
		uint8 tertiaryPosition; // opcional
		uint8 level; // 1-10
		bool isMinor;
		address guardian; // requerido si isMinor
		Visibility visibility;
		uint256 clubId; // 0 si sin club
	}

	FFRoles public roles;
	uint256 public nextPlayerId;
	mapping(uint256 => Player) private players;
	mapping(address => uint256) public accountToPlayerId;

	event PlayerRegistered(uint256 indexed id, address indexed account, string fullName, string nickname, bool isMinor);
	event PlayerJoinedClub(uint256 indexed playerId, uint256 indexed clubId, address indexed executor);

	constructor(address rolesAddress) {
		roles = FFRoles(rolesAddress);
	}

	function registerPlayerFF(
		string calldata fullName,
		string calldata nickname,
		uint8 primaryPosition,
		uint8 secondaryPosition,
		uint8 tertiaryPosition,
		uint8 level,
		bool isMinor,
		address guardian,
		Visibility visibility
	) external returns (uint256 id) {
		require(accountToPlayerId[msg.sender] == 0, "Already registered");
		if (isMinor) {
			require(guardian != address(0), "Guardian required");
			require(roles.hasRole(roles.GUARDIAN_ROLE(), guardian) || guardian == msg.sender, "Guardian invalid");
		}
		id = ++nextPlayerId;
		players[id] = Player({
			id: id,
			account: msg.sender,
			fullName: fullName,
			nickname: nickname,
			primaryPosition: primaryPosition,
			secondaryPosition: secondaryPosition,
			tertiaryPosition: tertiaryPosition,
			level: level,
			isMinor: isMinor,
			guardian: guardian,
			visibility: visibility,
			clubId: 0
		});
		accountToPlayerId[msg.sender] = id;
		emit PlayerRegistered(id, msg.sender, fullName, nickname, isMinor);
	}

	function playerJoinClub(uint256 playerId, uint256 clubId) external {
		Player storage p = players[playerId];
		require(p.account == msg.sender || roles.hasRole(roles.CLUB_ROLE(), msg.sender) || roles.hasRole(roles.DEFAULT_ADMIN_ROLE(), msg.sender), "Not allowed");
		p.clubId = clubId;
		emit PlayerJoinedClub(playerId, clubId, msg.sender);
	}

	function getPlayer(uint256 playerId) external view returns (Player memory) {
		return players[playerId];
	}
}
