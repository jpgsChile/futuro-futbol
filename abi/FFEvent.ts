export const FFEventAbi = [
  {
    type: "function",
    name: "registerEventFF",
    stateMutability: "nonpayable",
    inputs: [
      { name: "gameId", type: "uint256" },
      { name: "clubId", type: "uint256" },
      { name: "playerId", type: "uint256" },
      { name: "eventType", type: "uint8" },
      { name: "dataCid", type: "string" }
    ],
    outputs: [{ name: "", type: "uint256" }]
  }
] as const;
