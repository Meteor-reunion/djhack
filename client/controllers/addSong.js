/* globals gapi: false */

var songsList = new ReactiveVar([], function(a, b) {
  if (a === b) {return true;}
  if (!a || !b) {return false;}
  if (a.length !== b.length) {return false;}
  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) {return false;}
  }
  return true;
});

var apiCall = function() {
  if (Session.get("query")) {
    gapi.client.load('youtube', 'v3', function() {

      var request = gapi.client.youtube.search.list({
        q: Session.get("query"),
        part: 'snippet',
        type: 'video',
        fields: 'items(id,snippet)',
        key: 'AIzaSyA3a9eYs5e6_Td1CT-ohQA6nCEBE2KhSds'
      });

      request.execute(function(response) {
        var newArr = response.items.filter(function(element) {
          return element.id !== undefined;
        }).map(function(element, i) {
          return {
            index: i,
            id: element.id.videoId,
            title: element.snippet.title,
            image: element.snippet.thumbnails.medium.url
          };
        });
        songsList.set(newArr);
      });
    });
  }
};

Template.addSong.rendered = function() {
  this.autorun(apiCall);
};

Template.addSong.helpers({
  youtubeSongs: function() {
    return songsList.get();

  }
});

Template.addSong.events({
  "click .back": function(e) {
    e.preventDefault();
    Session.set("query", null);
    Session.set("page", "client");
  },
  "input #query": function(e) {
    e.preventDefault();
    Session.set("query", e.currentTarget.value);
  },
  "submit": function(e) {
    e.preventDefault();
  },
  "click .song": function(e) {
    e.preventDefault();
    var song = songsList.get()[e.currentTarget.id];
    if (song) {
      Meteor.call("addSong", Session.get('userId'), Session.get('partyId'),
       song.id, song.title, song.image, function(error) {
        if (error) {
          console.log("Can't add the song", error);
        } else {
          Session.set("query", null);
          Session.set("page", "client");
        }
      });
    }
  }
});
