export const FFPlayerAbi = [
  {
    type: "function",
    name: "registerPlayerFF",
    stateMutability: "nonpayable",
    inputs: [
      { name: "nickname", type: "string" },
      { name: "primaryPosition", type: "uint8" },
      { name: "level", type: "uint8" },
      { name: "isMinor", type: "bool" },
      { name: "guardian", type: "address" },
      { name: "visibility", type: "uint8" }
    ],
    outputs: [{ name: "", type: "uint256" }]
  },
  {
    type: "function",
    name: "playerJoinClub",
    stateMutability: "nonpayable",
    inputs: [
      { name: "playerId", type: "uint256" },
      { name: "clubId", type: "uint256" }
    ],
    outputs: []
  }
] as const;
