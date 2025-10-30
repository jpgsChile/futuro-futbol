export const FFViewsAbi = [
  {
    type: "function",
    name: "getLiga",
    stateMutability: "view",
    inputs: [{ name: "leagueId", type: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "id", type: "uint256" },
          { name: "name", type: "string" },
          { name: "location", type: "string" },
          { name: "category", type: "string" },
          { name: "owner", type: "address" },
          { name: "verificationLevel", type: "uint8" }
        ]
      }
    ]
  },
  {
    type: "function",
    name: "getClub",
    stateMutability: "view",
    inputs: [{ name: "clubId", type: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "id", type: "uint256" },
          { name: "leagueId", type: "uint256" },
          { name: "name", type: "string" },
          { name: "fixedGoalkeeper", type: "bool" },
          { name: "owner", type: "address" }
        ]
      }
    ]
  },
  {
    type: "function",
    name: "getJugador",
    stateMutability: "view",
    inputs: [{ name: "playerId", type: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "id", type: "uint256" },
          { name: "account", type: "address" },
          { name: "fullName", type: "string" },
          { name: "nickname", type: "string" },
          { name: "primaryPosition", type: "uint8" },
          { name: "secondaryPosition", type: "uint8" },
          { name: "tertiaryPosition", type: "uint8" },
          { name: "level", type: "uint8" },
          { name: "isMinor", type: "bool" },
          { name: "guardian", type: "address" },
          { name: "visibility", type: "uint8" },
          { name: "clubId", type: "uint256" }
        ]
      }
    ]
  },
  {
    type: "function",
    name: "getJuego",
    stateMutability: "view",
    inputs: [{ name: "gameId", type: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "id", type: "uint256" },
          { name: "clubAId", type: "uint256" },
          { name: "clubBId", type: "uint256" },
          { name: "scheduledAt", type: "uint64" },
          { name: "metadataCid", type: "string" },
          { name: "closed", type: "bool" }
        ]
      }
    ]
  },
  {
    type: "function",
    name: "getAlineacion",
    stateMutability: "view",
    inputs: [
      { name: "gameId", type: "uint256" },
      { name: "clubId", type: "uint256" }
    ],
    outputs: [{ name: "", type: "uint256[]" }]
  },
  {
    type: "function",
    name: "getEvento",
    stateMutability: "view",
    inputs: [{ name: "eventId", type: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "id", type: "uint256" },
          { name: "gameId", type: "uint256" },
          { name: "clubId", type: "uint256" },
          { name: "playerId", type: "uint256" },
          { name: "eventType", type: "uint8" },
          { name: "dataCid", type: "string" },
          { name: "timestamp", type: "uint64" }
        ]
      }
    ]
  }
] as const;

