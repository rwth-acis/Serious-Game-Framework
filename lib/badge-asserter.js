function BadgeAsserter () {
  this.host = "http://gaudi.informatik.rwth-aachen.de:8383/Serious-Game-Framework/";
  this.badges_path = "data/badges/";
  this.assertions_path = this.badges_path + "assertions/";
  this.gleaner_frontend_host = "http://gaudi.informatik.rwth-aachen.de:3000/"; // TODO MARKO use real location

  this.assertBadge = function (game_name, oidc_userinfo, badge_name) {
    this.game_name = game_name || "other";
    this.user_info = oidc_userinfo;
    this.badge_name = badge_name || game_name;

    // check if user is logged in
    if(this.user_info) {}
    else {
      console.log("User not logged in. No action!");
      return;
    }

    // determine uid, which is: (game_name)-(badge-name)-(user.firstname)-(user.lastname)
    // will also be used as the file_name with a .json ending
    // EXAMPLES: tutorial-tutorial-marko-kajzer(.json) | other-ten-correct-marko-kajzer(.json)
    this.uid = this.game_name + "-" + this.badge_name + "-" + this.user_info.name.toLowerCase().split(' ').join('-')
    this.assertion_file_name = this.uid + ".json";
    // this.assertion_file_name = "tutorial-marko-kajzer";

    this.assertion_host_path = this.host + this.assertions_path + this.assertion_file_name;
    this.identity = this.user_info.email;
    this.badge_host_path = this.host + this.badges_path + this.game_name + "/" + this.badge_name + "-badge.json";
    this.badge_total_name = this.game_name + "/" + this.badge_name;

    // Some debugging information, choose at own needs
    // console.log(this.host);
    // console.log(this.badges_path);
    // console.log(this.assertions_path);
    // console.log(this.game_name);
    // console.log(this.user_info);
    // console.log(this.badge_name);
    // console.log(this.uid);
    // console.log(this.assertion_file_name);
    // console.log(this.assertion_host_path);
    // console.log(this.identity);
    // console.log(this.badge_host_path);
    // console.log(this.badge_total_name)

    // Check if this badge is included in badges of user via AJAX Request to Gleaner API
    var request = $.ajax({
      async: false,
      url: this.gleaner_frontend_host + "collect/profiles",
      dataType: "json",
      headers: {
        'Email': this.user_info.email,
      }
    });

    var found = false;

    for(var i = 0; i < request.responseJSON.earnedBadges.length; i++) {
      if(request.responseJSON.earnedBadges[i].path == this.badge_total_name) {
        // Record for this bagde and user does already exist
        // -> User has already earned the badge, abort assertion process
        console.log("Record found for this badge, incrementing awarded counter... Abort assertion!");
        found = true;
        break;
      }
      else {
        // Record does not already exists
        // -> User does not have earned this badge yet, add record and go on with assertion process
      }
    }

    // Add badge to profile or increment # of times the badge was awarded
    $.ajax({
      type: "POST",
      url: this.gleaner_frontend_host + "collect/badges", // TODO MARKO use gleanerhost variable
      headers: {
          'Email': this.user_info.email,
          'badge_path': this.badge_total_name
      },
      success: function() {
        console.log("Badge added to earned Badges!");
      },
      error: function() {
        console.log("Something went terribly wrong!");
      }
    });

    // Return if previously the badge was already found
    if(found) return;

    // create the badge assertion
    this.assertion = {
      "uid": this.uid,
      "recipient": {
        "type": "email",
        "identity": this.identity,
        "hashed": false
      },
      "badge": this.badge_host_path,
      "verify": {
        "type": "hosted",
        "url": this.assertion_host_path
      },
      "issuedOn": Date.now() / 1000 | 0
    }
    this.assertion = JSON.stringify(this.assertion);

    // prepare params for PHP BadgeAsserter
    this.file_path = "../" + this.assertions_path + this.assertion_file_name;

    var params = "action=create";
        params += "&path=" + this.file_path;
        params += "&assertion=" + this.assertion;

    // POST Request to PHP Badge Assertion to create the actual assertion file
    var xhr = new XMLHttpRequest();
    xhr.open('post', './lib/badge-asserter.php', true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(params);

    // issue the Badge
    this.issueBadge([this.assertion_host_path], this.file_path)
  };

  this.issueBadge = function (assertion_host_path, file_path) {
    // Play an achievement sound
    document.getElementById('achievement_sound').play();

    // Issue the Badge
    OpenBadges.issue(assertion_host_path, function(errors, successes) {
      console.log(errors);
      console.log(successes);

      // If there was a success, add new badge to earnedBadges via Gleaner API
      // if(typeof successes !== 'undefined' && successes.length > 0) {}

      // delete the assertions file
      // prepare params for PHP BadgeAsserter
      var params = "action=delete";
          params += "&path=" + file_path;

      // POST Request to PHP Badge Asserter to delete the assertion file
      var xhr = new XMLHttpRequest();
      xhr.open('post', './lib/badge-asserter.php', true);
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.send(params);
    });
  };



    this.assertBadgeConfigured = function (game_name, oidc_userinfo, badge_name, badge_src, badgeFeedbackMessage) {
    this.game_name = game_name || "other";
    this.user_info = oidc_userinfo;
    this.badge_name = badge_name || game_name;
    this.badge_src = badge_src;

    this.badges_path = "game_badges/";
    this.assertions_path = this.badges_path + "assertions/";
    // check if user is logged in
    if(this.user_info) {}
    else {
      console.log("User not logged in. No action!");
      return;
    }

    // determine uid, which is: (game_name)-(badge-name)-(user.firstname)-(user.lastname)
    // will also be used as the file_name with a .json ending
    // EXAMPLES: tutorial-tutorial-marko-kajzer(.json) | other-ten-correct-marko-kajzer(.json)
    this.uid = this.game_name + "-" + this.badge_name + "-" + this.user_info.name.toLowerCase().split(' ').join('-')
    this.assertion_file_name = this.uid + ".json";
    // this.assertion_file_name = "tutorial-marko-kajzer";

    this.assertion_host_path = this.host + this.assertions_path + this.assertion_file_name;
    this.identity = this.user_info.email;
    this.badge_host_path = this.host + this.badges_path + this.game_name + "/" + this.badge_name + "-badge.json";
    this.badge_total_name = badge_src;

    // Check if this badge is included in badges of user via AJAX Request to Gleaner API
    var request = $.ajax({
      async: false,
      url: this.gleaner_frontend_host + "collect/profiles",
      dataType: "json",
      headers: {
        'Email': this.user_info.email,
      }
    });

    var found = false;

    for(var i = 0; i < request.responseJSON.earnedBadges.length; i++) {
      if(request.responseJSON.earnedBadges[i].path == this.badge_total_name) {
        // Record for this bagde and user does already exist
        // -> User has already earned the badge, abort assertion process
        $('#feedbackmessage').text("");
        $("#feedbackmessage").show();
        var createGameMessage = $('<h2 style="color:#6ca53e">'+badgeFeedbackMessage+'</h2>');
        $('#feedbackmessage').append(createGameMessage);
        setTimeout(function() { $("#feedbackmessage").hide(); }, 10000);
        console.log("Record found for this badge, incrementing awarded counter... Abort assertion!");
        found = true;
        break;
      }
      else {
        // Record does not already exists
        // -> User does not have earned this badge yet, add record and go on with assertion process
      }
    }

    // Add badge to profile or increment # of times the badge was awarded
    $.ajax({
      type: "POST",
      url: this.gleaner_frontend_host + "collect/badges", // TODO MARKO use gleanerhost variable
      headers: {
          'Email': this.user_info.email,
          'badge_path': this.badge_total_name
      },
      success: function() {
        $('#feedbackmessage').text("");
        $("#feedbackmessage").show();
        var createGameMessage = $('<h2 style="color:#6ca53e">'+badgeFeedbackMessage+'</h2>');
        $('#feedbackmessage').append(createGameMessage);
        setTimeout(function() { $("#feedbackmessage").hide(); }, 10000);
        console.log("Badge added to earned Badges!");
      },
      error: function() {
        console.log("Something went terribly wrong!");
      }
    });

    // Return if previously the badge was already found
    if(found) return;

    // create the badge assertion
    this.assertion = {
      "uid": this.uid,
      "recipient": {
        "type": "email",
        "identity": this.identity,
        "hashed": false
      },
      "badge": this.badge_host_path,
      "verify": {
        "type": "hosted",
        "url": this.assertion_host_path
      },
      "issuedOn": Date.now() / 1000 | 0
    }
    this.assertion = JSON.stringify(this.assertion);

    // prepare params for PHP BadgeAsserter
    this.file_path = "../" + this.assertions_path + this.assertion_file_name;

    var params = "action=create";
        params += "&path=" + this.file_path;
        params += "&assertion=" + this.assertion;

    // POST Request to PHP Badge Assertion to create the actual assertion file
    var xhr = new XMLHttpRequest();
    xhr.open('post', './lib/badge-asserter.php', true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(params);

    // issue the Badge
    this.issueBadgeConfigured([this.assertion_host_path], this.file_path,badgeFeedbackMessage)
  };

  this.issueBadgeConfigured = function (assertion_host_path, file_path, badgeFeedbackMessage) {
     $('#feedbackmessage').text("");
    $("#feedbackmessage").show();
    var createGameMessage = $('<h2 style="color:#6ca53e">'+badgeFeedbackMessage+'</h2>');
    $('#feedbackmessage').append(createGameMessage);
    setTimeout(function() { $("#feedbackmessage").hide(); }, 10000);
    // Play an achievement sound
    document.getElementById('achievement_sound').play();
   

    // Issue the Badge
    OpenBadges.issue(assertion_host_path, function(errors, successes) {
      console.log(errors);
      console.log(successes);

      // If there was a success, add new badge to earnedBadges via Gleaner API
      // if(typeof successes !== 'undefined' && successes.length > 0) {}

      // delete the assertions file
      // prepare params for PHP BadgeAsserter
      var params = "action=delete";
          params += "&path=" + file_path;

      // POST Request to PHP Badge Asserter to delete the assertion file
      var xhr = new XMLHttpRequest();
      xhr.open('post', './lib/badge-asserter.php', true);
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.send(params);
    });
  };
}
