export const FFGameAbi = [
  {
    type: "function",
    name: "createGame",
    stateMutability: "nonpayable",
    inputs: [
      { name: "clubAId", type: "uint256" },
      { name: "clubBId", type: "uint256" },
      { name: "scheduledAt", type: "uint64" }
    ],
    outputs: [{ name: "", type: "uint256" }]
  },
  {
    type: "function",
    name: "createGameFF",
    stateMutability: "nonpayable",
    inputs: [
      { name: "clubAId", type: "uint256" },
      { name: "clubBId", type: "uint256" },
      { name: "scheduledAt", type: "uint64" },
      { name: "metadataCid", type: "string" }
    ],
    outputs: [{ name: "", type: "uint256" }]
  },
  {
    type: "function",
    name: "closeGame",
    stateMutability: "nonpayable",
    inputs: [
      { name: "gameId", type: "uint256" }
    ],
    outputs: []
  }
] as const;
