// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FFRoles} from "./ff-roles.sol";

contract FFGame {
	struct Game {
		uint256 id;
		uint256 clubAId;
		uint256 clubBId;
		uint64 scheduledAt;
		string metadataCid; // opcional
		bool closed;
	}

	FFRoles public roles;
	uint256 public nextGameId;
	mapping(uint256 => Game) private games;

	event GameCreated(uint256 indexed id, uint256 indexed clubAId, uint256 indexed clubBId, uint64 scheduledAt, string metadataCid);
	event GameClosed(uint256 indexed id, address indexed executor);

	constructor(address rolesAddress) {
		roles = FFRoles(rolesAddress);
	}

	function createGame(uint256 clubAId, uint256 clubBId, uint64 scheduledAt) external returns (uint256 id) {
		require(
			roles.hasRole(roles.CLUB_ROLE(), msg.sender) || roles.hasRole(roles.DEFAULT_ADMIN_ROLE(), msg.sender),
			"Not authorized"
		);
		id = ++nextGameId;
		games[id] = Game({id: id, clubAId: clubAId, clubBId: clubBId, scheduledAt: scheduledAt, metadataCid: "", closed: false});
		emit GameCreated(id, clubAId, clubBId, scheduledAt, "");
	}

	function createGameFF(uint256 clubAId, uint256 clubBId, uint64 scheduledAt, string calldata metadataCid) external returns (uint256 id) {
		require(
			roles.hasRole(roles.CLUB_ROLE(), msg.sender) || roles.hasRole(roles.DEFAULT_ADMIN_ROLE(), msg.sender),
			"Not authorized"
		);
		id = ++nextGameId;
		games[id] = Game({id: id, clubAId: clubAId, clubBId: clubBId, scheduledAt: scheduledAt, metadataCid: metadataCid, closed: false});
		emit GameCreated(id, clubAId, clubBId, scheduledAt, metadataCid);
	}

	function closeGame(uint256 gameId) external {
		Game storage g = games[gameId];
		require(!g.closed, "Already closed");
		require(
			roles.hasRole(roles.REFEREE_ROLE(), msg.sender) || roles.hasRole(roles.DEFAULT_ADMIN_ROLE(), msg.sender),
			"Not authorized"
		);
		g.closed = true;
		emit GameClosed(gameId, msg.sender);
	}

	function getGame(uint256 gameId) external view returns (Game memory) {
		return games[gameId];
	}
}
