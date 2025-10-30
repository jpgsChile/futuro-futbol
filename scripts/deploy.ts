import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  const Roles = await ethers.getContractFactory("FFRoles");
  const roles = await Roles.deploy();
  await roles.waitForDeployment();
  const rolesAddr = await roles.getAddress();
  console.log("FFRoles:", rolesAddr);

  const League = await ethers.getContractFactory("FFLeague");
  const league = await League.deploy(rolesAddr);
  await league.waitForDeployment();
  const leagueAddr = await league.getAddress();
  console.log("FFLeague:", leagueAddr);

  const Club = await ethers.getContractFactory("FFClub");
  const club = await Club.deploy(rolesAddr);
  await club.waitForDeployment();
  const clubAddr = await club.getAddress();
  console.log("FFClub:", clubAddr);

  const Player = await ethers.getContractFactory("FFPlayer");
  const player = await Player.deploy(rolesAddr);
  await player.waitForDeployment();
  const playerAddr = await player.getAddress();
  console.log("FFPlayer:", playerAddr);

  const Game = await ethers.getContractFactory("FFGame");
  const game = await Game.deploy(rolesAddr);
  await game.waitForDeployment();
  const gameAddr = await game.getAddress();
  console.log("FFGame:", gameAddr);

  const Lineup = await ethers.getContractFactory("FFLineup");
  const lineup = await Lineup.deploy(rolesAddr);
  await lineup.waitForDeployment();
  const lineupAddr = await lineup.getAddress();
  console.log("FFLineup:", lineupAddr);

  const FFEvent = await ethers.getContractFactory("FFEvent");
  const ffEvent = await FFEvent.deploy(rolesAddr);
  await ffEvent.waitForDeployment();
  const eventAddr = await ffEvent.getAddress();
  console.log("FFEvent:", eventAddr);

  const Attest = await ethers.getContractFactory("FFAttest");
  const attest = await Attest.deploy(rolesAddr);
  await attest.waitForDeployment();
  const attestAddr = await attest.getAddress();
  console.log("FFAttest:", attestAddr);

  const Views = await ethers.getContractFactory("FFViews");
  const views = await Views.deploy(leagueAddr, clubAddr, playerAddr, gameAddr, lineupAddr, eventAddr);
  await views.waitForDeployment();
  const viewsAddr = await views.getAddress();
  console.log("FFViews:", viewsAddr);

  console.log("\nAddresses JSON:\n", JSON.stringify({
    FFRoles: rolesAddr,
    FFLeague: leagueAddr,
    FFClub: clubAddr,
    FFPlayer: playerAddr,
    FFGame: gameAddr,
    FFLineup: lineupAddr,
    FFEvent: eventAddr,
    FFAttest: attestAddr,
    FFViews: viewsAddr
  }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
