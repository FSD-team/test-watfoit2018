pragma solidity ^0.4.22;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Playlist.sol";

contract PlaylistTest {

    Playlist private playlist;

    constructor() public {
        playlist = new Playlist();

        playlist.addSong("Tets", "Test");
        playlist.addSong("Tets2", "Test2");
    }

    function testVote() public {
        playlist.vote(0);

        Assert.equal(playlist.getSongVoteCount(0), 1, "Song should have vote!");
    }

    function testClose() public {
        playlist.closeVoting(0);

        Assert.equal(playlist.isSongCompleted(0), true, "Song should be completed!");
    }
}