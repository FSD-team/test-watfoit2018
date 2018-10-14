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
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Playlist.json', function(data) {
      var Playlist = data;
      App.contracts.Playlist = TruffleContract(Playlist);
      App.contracts.Playlist.setProvider(App.web3Provider);
    });
    
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-add', App.handleAdd);
    $(document).on('click', '.btn-show', App.handleShow);
    $(document).on('click', '.btn-count', App.handleCount);
  },
  handleShow: function(event){
    console.log("Showing...");

    App.contracts.Playlist.deployed().then(function(instance) {
      playlistInstance = instance;
      
      var url = $('#urlDesc').val();

      playlistInstance.getDescription(url).then(function(data){

        console.log(data)
        $('#songDescription').html(data);
      });

      

    }).catch(function(err) {
      console.log(err.message);
    });

  },

  handleCount: function(event){
    console.log("Counting...");

    App.contracts.Playlist.deployed().then(function(instance) {
      playlistInstance = instance;
      playlistInstance.getSongsCount().then(function(data){
        sz = data;
        console.log(data)
        $('#numberOfSongs').html(5);
      });
    }).catch(function(err) {
      console.log(err.message);
    });

  },
  handleAdd: function(event) {
    console.log("Adding..");

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
    
      var account = accounts[1];
    
      App.contracts.Playlist.deployed().then(function(instance) {
        playlistInstance = instance;

        var url = $('#url').val();
        var desc = $('#desc').val();
        var value = $('#val').val();

        return playlistInstance.addSong(desc, url, value);
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
