Meteor.startup(function () {
language = window.navigator.userLanguage || window.navigator.language;
 //console.log(language);
 if (language.indexOf('-') !== -1)
    language = language.split('-')[0];

if (language.indexOf('_') !== -1)
    language = language.split('_')[0];

    TAPi18n.setLanguage(language)
      .done(function () {
        //Session.set("showLoadingIndicator", false);
      })
      .fail(function (error_message) {
        console.log(error_message);
      });
});
