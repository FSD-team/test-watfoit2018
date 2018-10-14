App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fall back to Ganache
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Playlist.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var PlaylistArtifact = data;
      App.contracts.Playlist = TruffleContract(PlaylistArtifact);

      // Set the provider for our contract
      App.contracts.Playlist.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the adopted pets
      //return App.vote(data.id);
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    App.getSongsCount();
    $(document).on('click', '#btnAddSong', App.addSong);
    $(document).on('click', '#btnGetDescription', App.getSongDescription);
    $(document).on('click', '#btnVoteSong', App.voteForSong);
  },

  getSongsCount: function(event) {

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Playlist.deployed().then(function(instance) {
        playlistInstance = instance;

        return playlistInstance.getSongsCount();
      }).then(function(result) {
        $("#songsNumber").html(result['c']);
      });
    })
  },

  getSongDescription: function(event) {

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      var id = $("#song-id").val();

      App.contracts.Playlist.deployed().then(function(instance) {
        playlistInstance = instance;
        playlistInstance.getSongDescription(id).then(function(result){
          alert("Description:" + result);
        });
      });
    });
  },

  voteForSong: function(event) {

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      var id = $("#vote-song-id").val();

      App.contracts.Playlist.deployed().then(function(instance) {
        playlistInstance = instance;
        playlistInstance.vote(id).then(function(instance) {
          playlistInstance.getSongVoteCount(id).then(function(result){
            alert("Total votes:" + result);
          });
        });
      });
    });
  },

  addSong: function(event) {
    event.preventDefault();

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Playlist.deployed().then(function(instance) {
        playlistInstance = instance;

        var description = $("#song-description").val();
        var url = $("#song-url").val();
        var value = $("#song-value").val();

        return playlistInstance.addSong(description, url, value);
      });
    });

  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
