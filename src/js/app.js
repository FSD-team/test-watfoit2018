App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    $.getJSON("../songs.json", function(data) {
      var songsRow = $("#songsRow");
      var songTemplate = $("#songTemplate");

      for (i = 0; i < data.length; i++) {
        songTemplate.find(".song-title").text(data[i].title);
        songTemplate.find(".song-description").text(data[i].description);
        songTemplate.find(".song-value").text(data[i].value);
        songTemplate.find(".song-url").text(data[i].url);

        songsRow.append(songTemplate.html());
      }
    });

    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== "undefined") {
      App.web3Provider = web3.currentProvider;
    } else {
      App.web3Provider = new Web3.providers.HttpProvider(
        "http://localhost:8545"
      );
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Playlist.json", function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var PlaylistArtifact = data;
      App.contracts.Playlist = TruffleContract(PlaylistArtifact);

      // Set the provider for our contract
      App.contracts.Playlist.setProvider(App.web3Provider);
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on("click", ".btn-add", App.handleAdd);
    $(document).on("click", ".btn-vote", App.handleVote);
    $(document).on("click", ".btn-count", App.handleCount);
    $(document).on("click", ".btn-description", App.handleDescription);
  },

  handleAdd: function(event) {
    event.preventDefault();

    var songTitle = document.getElementById("add-title").value;
    var songDescription = document.getElementById("add-desc").value;
    var songValue = document.getElementById("add-value").value;
    console.log(songTitle, songDescription, songValue);
    alert(songTitle);

    var playlistInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Playlist.deployed()
        .then(function(instance) {
          playlistInstance = instance;

          // Execute adopt as a transaction by sending account
          return playlistInstance.addSong(
            songTitle,
            songDescription,
            songValue,
            { from: account }
          );
        })
        .then(function(result) {
          alert("Uspesno dodata pesma");
        })
        .catch(function(err) {
          console.log(err.message);
        });
    });
  },

  handleVote: function(event) {
    alert("vote");
  },

  handleCount: function(event) {
    event.preventDefault();

    var playlistInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Playlist.deployed()
        .then(function(instance) {
          playlistInstance = instance;

          return playlistInstance.getSongsCount({ from: account });
        })
        .then(function(result) {
          console.log(result.c[0]);
        })
        .catch(function(err) {
          console.log(err.message);
        });
    });
  },

  handleDescription: function(event) {
    alert("description");
    event.preventDefault();

    var playlistInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Playlist.deployed()
        .then(function(instance) {
          playlistInstance = instance;

          return playlistInstance.getSummary(1, { from: account });
        })
        .then(function(result) {
          console.log(result.c[0]);
        })
        .catch(function(err) {
          console.log(err.message);
        });
    });
  },

  handleAdopt: function(event) {
    event.preventDefault();

    var songId = parseInt($(event.target).data("id"));

    var playlistInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Playlist.deployed()
        .then(function(instance) {
          playlistInstance = instance;

          // Execute adopt as a transaction by sending account
          return playlistInstance.adopt(songId, { from: account });
        })
        .then(function(result) {
          return;
        })
        .catch(function(err) {
          console.log(err.message);
        });
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
