App = {
    web3Provider: null,
    contracts: {},
  
    init: function() {
      $.getJSON('../songs.json', function(data) {
        var songsRow = $('#songsRow');
        var songsTemplate = $('#songsTemplate');
  
        for (i = 0; i < data.length; i ++) {
            songsTemplate.find('.panel-title').text(data[i].description);
            songsTemplate.find('.song-url').text(data[i].url);
            songsTemplate.find('.song-value').text(data[i].value);
            songsTemplate.find('.song-voteCount').text(data[i].voteCount);
            songsTemplate.find('.btn-vote').attr('data-id', data[i].id);
  
            songsRow.append(songsTemplate.html());
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
      $.getJSON('Playlist.json', function(data) {
        // Get the necessary contract artifact file and instantiate it with truffle-contract
        var PlaylistArtifact = data;
        App.contracts.Playlist = TruffleContract(PlaylistArtifact);
      
        // Set the provider for our contract
        App.contracts.Playlist.setProvider(App.web3Provider);
      
        var voteInstance;
    
        App.contracts.Playlist.deployed().then(function(instance) {
            voteInstance = instance;
            return voteInstance.getSongsCount.call();
        }).then(function(count) {
            console.log('songCount: ' +  count);
            $('#songsCount').html('Number of songs:' + count);

            console.log('0 songDescription' + voteInstance.getSongDescription(0));
        }).catch(function(err) {
            console.log(err.message);
        });

        // set voteCounts
        return App.setVoteCounts();
      });
      
      return App.bindEvents();
    },
  
    bindEvents: function() {
      $(document).on('click', '.btn-vote', App.handleVote);
      $(document).on('click', '#submitButton', App.handleAdd);


    },
  
    setVoteCounts: function(account) {
      console.log('setVoteCounts');
      var voteInstance;
  
      App.contracts.Playlist.deployed().then(function(instance) {
        voteInstance = instance;
        return voteInstance.getSongsCount.call();
      }).then(function(votes) {
        console.log('pesmi: '+ votes);
        for (i = 0; i < votes; i++) {
            console.log(i);
            $('.panel-pet').eq(i).find('.song-voteCount').text(voteInstance.getSongVoteCount(i));
        }
      }).catch(function(err) {
        console.log(err.message);
      });
    },
    
    handleAdd: function(event) {
        console.log('handleAdd');
        event.preventDefault();

        var desc = $('#desc').val();
        var url = $('#url').val();
        var value = $('#value').val();
        alert(url);

        var voteInstance;
  
        web3.eth.getAccounts(function(error, accounts) {
            if (error) {
            console.log(error);
            }
        
            var account = accounts[0];
        
            App.contracts.Playlist.deployed().then(function(instance) {
                voteInstance = instance;
                console.log('AddingSong');
                return voteInstance.addSong(desc, url, value, {from: account});
            }).then(function(result) {
                var songsRow = $('#songsRow');
                var songsTemplate = $('#songsTemplate');

                songsTemplate.find('.panel-title').text(desc);
                songsTemplate.find('.song-url').text(url);
                songsTemplate.find('.song-value').text(value);
                songsTemplate.find('.song-voteCount').text('0');
                songsRow.append(songsTemplate.html());

                return App.setVoteCounts();
            }).catch(function(err) {
            console.log(err.message);
            });
        });
    },

    handleVote: function(event) {
      
  
      var songId = parseInt($(event.target).data('id'));
  //
      var voteInstance;
  
      web3.eth.getAccounts(function(error, accounts) {
        if (error) {
          console.log(error);
        }
      
        var account = accounts[0];
      
        App.contracts.Playlist.deployed().then(function(instance) {
            voteInstance = instance;
      
          // Execute adopt as a transaction by sending account
          return voteInstance.adopt(songId, {from: account});
        }).then(function(result) {
          return App.setVoteCounts();
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