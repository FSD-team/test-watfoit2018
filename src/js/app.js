App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    // Load songs.
    $.getJSON('../songs.json', function(data) {
      var songsRow = $('#songsRow');
      
      var songsTemplate = $('#songTemplate');

      for (i = 0; i < data.length; i ++) {
        App.addSongFront(data[i].description, data[i].url, data[i].voteCount, data[i].value)
      }
    });

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

  addSongFront: function(description, url, value, voteCount){
    var songsRow = $('#songsRow');
    var songsTemplate = $('#songTemplate');

    songsTemplate.find('.panel-title').text(description);
    songsTemplate.find('.song-url').text(url);
    songsTemplate.find('.vote-count').text(voteCount);
    songsTemplate.find('.val').text(value);

    songsRow.append(songsTemplate.html());
  },

  initContract: function() {
    $.getJSON('Playlist.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var PlaylistArtifact = data;
      App.contracts.Playlist = TruffleContract(PlaylistArtifact);
    
      // Set the provider for our contract
      App.contracts.Playlist.setProvider(App.web3Provider);
    
      // Use our contract to retrieve and mark the adopted pets
      //return App.markAdopted();
    });
    
    return App.bindEvents();
  },

  bindEvents: function() {
    //$(document).on('click', '.btn-adopt', App.handleAdopt);
    $(document).on('click', '.btn-add-song', App.addSong);
  },

  addSong: function(){

    var description = $('#desc-input').val();
    var value = $('#value-input').val();
    var url = $('#url-input').val();
    
    App.handleAddSong(description, value, url)

    
    // add to front
    App.addSongFront(description, value, url, 0)
    
  },

  markAdopted: function(adopters, account) {
    // var adoptionInstance;

    // App.contracts.Adoption.deployed().then(function(instance) {
    //   adoptionInstance = instance;
    // console.log('instance: ', instance);
    //   return adoptionInstance.getAdopters.call();
    // }).then(function(adopters) {
    //   console.log('adopters: ', adopters);
    //   for (i = 0; i < adopters.length; i++) {
    //     if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
    //       $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
    //     }
    //   }
    // }).catch(function(err) {
    //   console.log(err.message);
    // });
  },

  handleAddSong: function(description, value, url) {


    var adoptionInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
    
      var account = accounts[0];
    
      App.contracts.Playlist.deployed().then(function(instance) {
        adoptionInstance = instance;
        console.log(instance)
        // Execute adopt as a transaction by sending account
        return adoptionInstance.addSong(description, value, url);
      }).then(function(result) {
        return App.markAdopted();
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
