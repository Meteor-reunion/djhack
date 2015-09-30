/* globals $: false */
UI.body.helpers({
  gapi: function() {
    $('body').append('<script src="https://apis.google.com/js/client.js?onload=googleApiClientReady"></script>');
    return "";
  }
});

Template.home.events({
	"click .create" : function(e) {
		e.preventDefault();

		Session.set("page", "createParty");
	},
	"submit #join" : function(e, t) {
		e.preventDefault();

		Meteor.call("joinParty", t.find("#partyName").value, function(err, result) {
			if (err) {
				console.log("error to join to the party: ", err);
			} else {
				Session.set("page", "client");
				Session.set("partyId", result);
			}
		});
	},
  'click .scanner' : function(e, t){
		e.preventDefault();
		if(Meteor.isCordova){
        cordova.plugins.barcodeScanner.scan(
            function (result) {
            	if(result.cancelled==false && result.text && result.format=='QR_CODE'){
            				Session.set("page", "client");
            				Session.set("partyId", result.text);
            		}else{
                    return ;
            			}
            },
            function (error) {
                alert("Scanning failed: " + error);
                	return ;
            }
        );
        }
        	return ;
}
});
