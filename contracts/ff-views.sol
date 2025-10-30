// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IFFLeague {
	struct League { uint256 id; string name; string location; string category; address owner; uint8 verificationLevel; }
	function getLeague(uint256 leagueId) external view returns (League memory);
}

interface IFFClub {
	struct Club { uint256 id; uint256 leagueId; string name; bool fixedGoalkeeper; address owner; }
	function getClub(uint256 clubId) external view returns (Club memory);
}

interface IFFPlayer {
	enum Visibility { Public, Restricted }
	struct Player { uint256 id; address account; string fullName; string nickname; uint8 primaryPosition; uint8 secondaryPosition; uint8 tertiaryPosition; uint8 level; bool isMinor; address guardian; Visibility visibility; uint256 clubId; }
	function getPlayer(uint256 playerId) external view returns (Player memory);
}

interface IFFGame {
	struct Game { uint256 id; uint256 clubAId; uint256 clubBId; uint64 scheduledAt; string metadataCid; bool closed; }
	function getGame(uint256 gameId) external view returns (Game memory);
}

interface IFFLineup {
	function getLineup(uint256 gameId, uint256 clubId) external view returns (uint256[] memory);
}

interface IFFEvent {
	struct GameEvent { uint256 id; uint256 gameId; uint256 clubId; uint256 playerId; uint8 eventType; string dataCid; uint64 timestamp; }
	function eventsById(uint256 id) external view returns (GameEvent memory);
	function getGameEvents(uint256 gameId) external view returns (GameEvent[] memory);
}

contract FFViews {
	IFFLeague public league;
	IFFClub public club;
	IFFPlayer public player;
	IFFGame public game;
	IFFLineup public lineup;
	IFFEvent public ffEvent;

	constructor(address league_, address club_, address player_, address game_, address lineup_, address event_) {
		league = IFFLeague(league_);
		club = IFFClub(club_);
		player = IFFPlayer(player_);
		game = IFFGame(game_);
		lineup = IFFLineup(lineup_);
		ffEvent = IFFEvent(event_);
	}

	function getLiga(uint256 leagueId) external view returns (IFFLeague.League memory) { return league.getLeague(leagueId); }
	function getClub(uint256 clubId) external view returns (IFFClub.Club memory) { return club.getClub(clubId); }
	function getJugador(uint256 playerId) external view returns (IFFPlayer.Player memory) { return player.getPlayer(playerId); }
	function getJuego(uint256 gameId) external view returns (IFFGame.Game memory) { return game.getGame(gameId); }
	function getAlineacion(uint256 gameId, uint256 clubId) external view returns (uint256[] memory) { return lineup.getLineup(gameId, clubId); }
	function getEvento(uint256 eventId) external view returns (IFFEvent.GameEvent memory) { return ffEvent.eventsById(eventId); }
}
