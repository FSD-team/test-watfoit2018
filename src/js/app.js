App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    $.getJSON('../songs.json', function(data) {
      var songsRow = $('#songsRow');
      var songTemplate = $('#songTemplate');

      for (i = 0; i < data.length; i ++) {
        songTemplate.find('.panel-title').text('Song ' + data[i].id);
        songTemplate.find('.description').text(data[i].description);
        songTemplate.find('.url').text(data[i].url);
        songTemplate.find('.votes').text(data[i].voteCount);
        songTemplate.find('.complete').text(data[i].complete);

        songsRow.append(songTemplate.html());
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

  initContract: function() {
    $.getJSON('songs.json', function(data){
      var SongsArtifact = data;
      App.contracts.Playlist = TruffleContract(SongsArtifact);
      App.contracts.Playlist.setProvider(App.web3Provider);
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-vote', App.handleVote);
    $(document).on('click', '.songsNumber', App.handleGetSongsNumber);
    $(document).on('click', '.btn-addSong', App.handleAddSong);
  },

  handleVote: function(event) {
    event.preventDefault();
  },

  handleAddSong: function(event) {
    event.preventDefault();
    let url = $('input[name="url"]').val();
	  let description = $('input[name="description"]').val();
    let value = $('select[name="value"]').val();
    var playlistInstance;
      App.contracts.Playlist.deployed().then(function(instance) {
      playlistInstance = instance;
      return playlistInstance.addSong(description,url,value);
    }).then(function() {
      var songsRow = $('#songsRow');
      var songTemplate = $('#songTemplate');
      songTemplate.find('.description').text(description);
      songTemplate.find('.url').text(url);
      songTemplate.find('.votes').text(0);
      songTemplate.find('.complete').text(false);
      songsRow.append(songTemplate.html());
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  handleGetSongsNumber: function(event) {
    event.preventDefault();
    var playlistInstance;
    App.contracts.Playlist.deployed().then(function(instance) {
      playlistInstance = instance;      
      return playlistInstance.getSongsCount.call();
    }).then(function(number) {
      alert('Songs number: ' + number);
    }).catch(function(err) {
      console.log(err.message);
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
