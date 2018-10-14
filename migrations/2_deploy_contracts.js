var Playlist = artifacts.require("Playlist");

module.exports = function(deployer) {
  deployer.deploy(Playlist);
};