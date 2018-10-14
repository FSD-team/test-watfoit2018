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
      return App.songNum();
    });
    
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '#btn-addsong', App.handleAdd);
    $(document).on('click', '#btn-getinfo', App.handleGet);
  },
  songNum:function() {
    var songnumPlace = $('#song-num');

    var playlistInstance;
    App.contracts.Playlist.deployed().then(function(instance) {
      playlistInstance = instance;
      console.log('instance: ', instance);
      return playlistInstance.getSongsCount.call();
    }).then(function(count) {
      songnumPlace.text(count);
      console.log('count: ', count);
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  handleGet: function(event) {
    event.preventDefault();
    var num = parseInt($('#song-broj').val());
    var infoime = $('#info-ime');
    var infourl = $('#info-url');

    var playlistInstance;
    App.contracts.Playlist.deployed().then(function(instance) {
      playlistInstance = instance;
      console.log('instance: ', instance);
      return playlistInstance.getSummary(num);
    }).then(function(summary) {
      infoime.text(summary[0]);
      infourl.text(summary[1]);
      console.log('summary: ', summary);
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  handleAdd: function(event) {
    event.preventDefault();

    var description = $('#song-name').val();
    var url = $('#song-url').val();
    var value = 0;

    var songInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
    
      var account = accounts[0];
    
      App.contracts.Playlist.deployed().then(function(instance) {
        songInstance = instance;
        return songInstance.addSong(description, url, parseInt(value), {from: account});
      }).then(function(result) {
        return App.songNum();
      }).catch(function(err) {
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
