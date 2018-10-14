pragma solidity ^0.4.22;

contract Playlist {
    struct Song {
        string description;
        string url;
        uint value;
        uint voteCount;
        bool complete;
    }

    Song[] private songs;

    constructor() public {
    }

    function addSong(string description, string url, uint value) public {
        Song memory newSong = Song({
            description: description,
            url: url,
            value: value,
            voteCount: 0,
            complete: false
        });
        songs.push(newSong);
    }

    // TODO: this method should increase vote count by 1
    function vote(uint index) public{
        uint length = songs.length;
        require(index<length);

        Song storage song = songs[index];
        song.voteCount = song.voteCount + 1;
    }

    function closeVoting(uint index) public {
        Song storage song = songs[index];
        
        require(!song.complete);
        
        song.complete = true;
    }

    function getSummary(uint index) public view returns (string, string, uint, bool) {
        uint length = songs.length;
        require(index<length);
        Song storage song = songs[index];
        return (
          song.description,
          song.url,
          song.voteCount,
          song.complete
        );
    }

    // TODO: implement this method to return number of songs (uint type)
    function getSongsCount() public view returns (uint) {
        uint length = songs.length;
        return length;
    }

    function getSongVoteCount(uint index) public view returns (uint) {
        uint length = songs.length;
        require(index<length);
        Song storage song = songs[index];
        return song.voteCount;
    }
    function isSongCompleted(uint index) public view returns (bool) {
        uint length = songs.length;
        require(index<length);
        Song storage song = songs[index];
        return song.complete;
    }
}
