export const FFClubAbi = [
  {
    type: "function",
    name: "createClub",
    stateMutability: "nonpayable",
    inputs: [
      { name: "leagueId", type: "uint256" },
      { name: "name", type: "string" },
      { name: "fixedGoalkeeper", type: "bool" }
    ],
    outputs: [{ name: "", type: "uint256" }]
  }
] as const;
