App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    // Load pets.
    /*$.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });*/

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
      return App.printSongsCount2();
    });
    
    //App.bindEvents();
    App.bindAdd();
    App.bindDesc();
    App.bindCount();
  },

  /*bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },*/
  

  bindAdd: function() {
    $(document).on('click', '.btn-sound-add', App.addNewSong);
  },

  bindDesc: function() {
    $(document).on('click', '.btn-sound-desc', App.giveDesc);
  },

  bindCount: function() {
    $(document).on('click', '.btn-sound-count', App.printSongsCount);
  },

 addNewSong: function(){
  var SongInstance;
  var description = document.getElementById("desc").value;
  var url = document.getElementById("url").value
  console.log(url);
  App.contracts.Playlist.deployed().then(function(instance) {
    SongInstance = instance;
    return SongInstance.addSong(description, url);
  })
 },

 giveDesc: function(){
  window.alert("sometextDesc");
  var SongInstance;
  var id = document.getElementById("song_id").value;
  App.contracts.Playlist.deployed().then(function(instance) {
    SongInstance = instance;
    var desc = SongInstance.getSummary(id);
    document.getElementById("song_desc").value = desc;
  })
 },

 printSongsCount: function(){
  window.alert("sometextCount");
  var SongInstance;
  App.contracts.Playlist.deployed().then(function(instance) {
    SongInstance = instance;
    var count = SongInstance.getSongsCount();
    document.getElementById("song_count").value = count;
  })
 },

 printSongsCount2: function(adopters, account) {
  var adoptionInstance;

  App.contracts.Playlist.deployed().then(function(instance) {
    adoptionInstance = instance;
  console.log('instance: ', instance);
    return adoptionInstance.getSongsCount.call();
  }).then(function(adopters) {
    console.log('adopters: ', adopters);
    document.getElementById("song_count").value = adopters;
  }).catch(function(err) {
    console.log(err.message);
  });
},


  /*markAdopted: function(adopters, account) {
    var adoptionInstance;

    App.contracts.Adoption.deployed().then(function(instance) {
      adoptionInstance = instance;
    console.log('instance: ', instance);
      return adoptionInstance.getAdopters.call();
    }).then(function(adopters) {
      console.log('adopters: ', adopters);
      for (i = 0; i < adopters.length; i++) {
        if (adopters[i] !== "0x0000000000000000000000000000000000000000") {
          $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  handleAdopt: function(event) {
    event.preventDefault();

    //var petId = parseInt($(event.target).data('id'));
    var petId = parseInt($(event.target).attr('data-id'));

    var adoptionInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
    
      var account = accounts[0];
    
      App.contracts.Adoption.deployed().then(function(instance) {
        adoptionInstance = instance;
    
        // Execute adopt as a transaction by sending account
        return adoptionInstance.adopt(petId, {from: account});
      }).then(function(result) {
        return App.markAdopted();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }*/

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
