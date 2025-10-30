// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FFRoles} from "./ff-roles.sol";

contract FFAttest {
	struct Attestation {
		bytes32 id;
		address subject;
		address issuer;
		uint8 level; // 0 none, 1 verified, 2 official
		string schema;
		string data;
		uint64 timestamp;
	}

	FFRoles public roles;
	uint256 public nextAttestationSeq;
	mapping(bytes32 => Attestation) public attestations;
	mapping(address => uint8) public subjectVerificationLevel; // nivel agregado por sujeto

	event Attested(bytes32 indexed id, address indexed subject, address indexed issuer, uint8 level, string schema);
	event VerificationElevated(address indexed subject, uint8 newLevel, address indexed executor);

	constructor(address rolesAddress) {
		roles = FFRoles(rolesAddress);
	}

	function attest(address subject, uint8 level, string calldata schema, string calldata data) external returns (bytes32 id) {
		require(
			roles.hasRole(roles.VERIFIER_ROLE(), msg.sender) || roles.hasRole(roles.DEFAULT_ADMIN_ROLE(), msg.sender),
			"Not authorized"
		);
		id = keccak256(abi.encodePacked(++nextAttestationSeq, subject, msg.sender, block.timestamp, schema));
		attestations[id] = Attestation({
			id: id,
			subject: subject,
			issuer: msg.sender,
			level: level,
			schema: schema,
			data: data,
			timestamp: uint64(block.timestamp)
		});
		if (level > subjectVerificationLevel[subject]) {
			subjectVerificationLevel[subject] = level;
		}
		emit Attested(id, subject, msg.sender, level, schema);
	}

	function elevateVerification(address subject, uint8 newLevel) external {
		require(
			roles.hasRole(roles.LEAGUE_ROLE(), msg.sender) || roles.hasRole(roles.DEFAULT_ADMIN_ROLE(), msg.sender),
			"Not authorized"
		);
		require(newLevel > subjectVerificationLevel[subject], "Must elevate");
		subjectVerificationLevel[subject] = newLevel;
		emit VerificationElevated(subject, newLevel, msg.sender);
	}
}
