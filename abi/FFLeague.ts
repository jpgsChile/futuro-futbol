export const FFLeagueAbi = [
  {
    type: "function",
    name: "createLeague",
    stateMutability: "nonpayable",
    inputs: [
      { name: "name", type: "string" },
      { name: "location", type: "string" },
      { name: "category", type: "string" }
    ],
    outputs: [{ name: "", type: "uint256" }]
  }
] as const;
