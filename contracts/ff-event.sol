// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FFRoles} from "./ff-roles.sol";

contract FFEvent {
	enum EventType {
		Unknown,
		Start,
		End,
		Goal,
		Foul,
		Offside,
		YellowCard,
		RedCard,
		Substitution
	}

	struct GameEvent {
		uint256 id;
		uint256 gameId;
		uint256 clubId;
		uint256 playerId; // 0 si aplica a nadie
		EventType eventType;
		string dataCid; // metadata IPFS opcional
		uint64 timestamp;
	}

	FFRoles public roles;
	uint256 public nextEventId;
	mapping(uint256 => GameEvent) public eventsById;
	mapping(uint256 => uint256[]) public gameToEventIds;
	mapping(uint256 => int256) public playerReputation; // reputación simple local

	event EventRegistered(uint256 indexed id, uint256 indexed gameId, uint256 indexed playerId, EventType eventType, string dataCid);
	event ReputationUpdated(uint256 indexed playerId, int256 newScore);

	constructor(address rolesAddress) {
		roles = FFRoles(rolesAddress);
	}

	function registerEvent(
		uint256 gameId,
		uint256 clubId,
		uint256 playerId,
		EventType eventType
	) external returns (uint256 id) {
		require(
			roles.hasRole(roles.REFEREE_ROLE(), msg.sender) || roles.hasRole(roles.DEFAULT_ADMIN_ROLE(), msg.sender),
			"Not authorized"
		);
		id = ++nextEventId;
		GameEvent memory ge = GameEvent({
			id: id,
			gameId: gameId,
			clubId: clubId,
			playerId: playerId,
			eventType: eventType,
			dataCid: "",
			timestamp: uint64(block.timestamp)
		});
		eventsById[id] = ge;
		gameToEventIds[gameId].push(id);
		emit EventRegistered(id, gameId, playerId, eventType, "");
	}

	function registerEventFF(
		uint256 gameId,
		uint256 clubId,
		uint256 playerId,
		EventType eventType,
		string calldata dataCid
	) public returns (uint256 id) {
		require(
			roles.hasRole(roles.REFEREE_ROLE(), msg.sender) || roles.hasRole(roles.DEFAULT_ADMIN_ROLE(), msg.sender),
			"Not authorized"
		);
		id = ++nextEventId;
		GameEvent memory ge = GameEvent({
			id: id,
			gameId: gameId,
			clubId: clubId,
			playerId: playerId,
			eventType: eventType,
			dataCid: dataCid,
			timestamp: uint64(block.timestamp)
		});
		eventsById[id] = ge;
		gameToEventIds[gameId].push(id);
		emit EventRegistered(id, gameId, playerId, eventType, dataCid);
	}

	function registerEventAndReputation(
		uint256 gameId,
		uint256 clubId,
		uint256 playerId,
		EventType eventType,
		int256 reputationDelta,
		string calldata dataCid
	) external returns (uint256 id) {
		id = registerEventFF(gameId, clubId, playerId, eventType, dataCid);
		if (playerId != 0 && reputationDelta != 0) {
			playerReputation[playerId] += reputationDelta;
			emit ReputationUpdated(playerId, playerReputation[playerId]);
		}
	}

	function getGameEvents(uint256 gameId) external view returns (GameEvent[] memory list) {
		uint256[] memory ids = gameToEventIds[gameId];
		list = new GameEvent[](ids.length);
		for (uint256 i = 0; i < ids.length; i++) {
			list[i] = eventsById[ids[i]];
		}
	}
}
