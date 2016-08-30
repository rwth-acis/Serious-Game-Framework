function GleanerTracker () {
  this.gleaner_path = "http://gaudi.informatik.rwth-aachen.de:3000/"; // TODO MARKO use real location
  this.gleaner_url = this.gleaner_path + "collect/track";
  this.gleaner_traces_url = this.gleaner_path + "collect/traces";
  this.tracking_code = '575e84edfdfebe1b71164a72gy9dv8otw2miy66r'; // ENTER REAL TRACKINGCODE HERE

  this.startTracking = function (user_info) {
    // Call collect/start method of Gleaner API
    // TODO MARKO add real url
    $.ajax({
      type: 'POST',
      url: this.gleaner_path + "collect/start/" + this.tracking_code,
      dataType: "json",
      headers: {
        'Authorization': 'a:',
        'Email': user_info.email
      },
      success: function(result) {
        console.log("Login registered!");
        gleaner_tracker.trackTrace(user_info, "login")
      },
      error: function(error) {
        console.log(error);
        console.log("Cannot start tracking. Server down?");
      }
    });
  }

  this.trackTrace = function (user_info, type, data) {
    // check if user is logged in
    if(user_info) {}
      else {
        console.log("User not logged in. No action!");
        return;
      }

      var trace;
      var badge_statistic;
      var configure = "old";
      if(type == "level_completion") {
      // Prepare the trace for level_completion with Level and Game IDs and the level result
      trace = [{
        "type": "logic",
        "event": "level_end",
        "target_level": data.levelID,
        "target_game": data.gameID,
        "user": user_info.email,
        "time": Date.now() / 1000 | 0,
        "result": data.result
      }];
      configure = data.configure || "old";
      badge_statistic = data.result;
    }
    else if(type == "elearning") {
      // Prepare the trace for level_completion with Level and Game IDs and the level result
      trace = [{
        "type": "input",
        "target": "elearning",
        "action": "clicked",
        "context_game": data.gameID,
        "context_level": data.levelID,
        "time": Date.now() / 1000 | 0,
        "user": user_info.email
      }];
      configure = data.configure || "old";
      badge_statistic = trace[0].target;
    }

    else if(type == "moreInformation") {
      // Prepare the trace for level_completion with Level and Game IDs and the level result
      trace = [{
        "type": "input",
        "target": "moreInformation",
        "action": "clicked",
        "context_game": data.gameID,
        "context_level": data.levelID,
        "time": Date.now() / 1000 | 0,
        "user": user_info.email
      }];
      configure = data.configure || "old";
      badge_statistic = trace[0].target;
    }
    else if(type == "game_start") {
      // Prepare the trace for starting a game with Game ID
      trace = [{
        "type": "logic",
        "event": "game_start",
        "target_game": data.gameID,
        "time": Date.now() / 1000 | 0,
        "user": user_info.email
      }];
      configure = data.configure || "old";
    }
    else if(type == "login") {
      // Prepare the trace for logging in, which contains the login time
      trace = [{
        "type": "logic",
        "event": "login",
        "time": Date.now() / 1000 | 0,
        "user": user_info.email
      }];
    }

    // Now send the prepared trace
    $.ajax({
      type: 'POST',
      dataType: 'json',
      contentType:'application/json',
      url: this.gleaner_url,
      headers: {
        'Email': user_info.email
      },
      data: JSON.stringify(trace),
      success: function(result) {
        console.log("Trace saved!");
        if(badge_statistic && configure == "new") {
          gleaner_tracker.configuredQueryStatisticsRecords(user_info, badge_statistic);
        }else if(badge_statistic){
         gleaner_tracker.queryStatisticsRecords(user_info, badge_statistic);
       }
     },
     error: function() {
      console.log("Trace could not be saved!");
    }
  });
  }

  this.configuredQueryStatisticsRecords = function(user_info, statistic) {
    // Query count of records of the given statistic from this user
    $.ajax({
      url: this.gleaner_traces_url,
      dataType: "json",
      headers: {
        'Statistic': statistic,
        'Email': user_info.email,
      },
      success: function(result) {
        gleaner_tracker.configuredCheckBadgeRequirements(user_info, result);
      },
      error: function() {
        console.log("An error occured while checking requirements...");
      }
    });
  }

  this.configuredCheckBadgeRequirements = function(user_info, result) {
    // Check requirements based on the previously saved statistic
    // Award badges depending on the statistics:
    // Ten correct answers
    // Clicked elearning three times
    for(var i=0; i < GAME_BADGES.length; i++){
      if(result.statistic === "correct") {
        if(GAME_BADGES[i].badgeRequirementId == 2){
          if(result.count % GAME_BADGES[i].requirementValue === 0) {
            badge_asserter.assertBadgeConfigured("other", user_info, GAME_BADGES[i].badgeName,GAME_BADGES[i].badgeSrc,GAME_BADGES[i].badgeFeedbackMessage);
          }
        } 
      } else if(result.statistic === "elearning") {
        if(GAME_BADGES[i].badgeRequirementId == 3){
          if(result.count % GAME_BADGES[i].requirementValue === 0) {
            badge_asserter.assertBadgeConfigured("other", user_info, GAME_BADGES[i].badgeName,GAME_BADGES[i].badgeSrc,GAME_BADGES[i].badgeFeedbackMessage);
          }
        }
      } else if(result.statistic === "moreInformation") {
        if(GAME_BADGES[i].badgeRequirementId == 4){
          if(result.count % GAME_BADGES[i].requirementValue === 0) {
            badge_asserter.assertBadgeConfigured("other", user_info, GAME_BADGES[i].badgeName,GAME_BADGES[i].badgeSrc,GAME_BADGES[i].badgeFeedbackMessage);
          }
        }
      }
    }


  }

  this.queryStatisticsRecords = function(user_info, statistic) {
    // Query count of records of the given statistic from this user
    $.ajax({
      url: this.gleaner_traces_url,
      dataType: "json",
      headers: {
        'Statistic': statistic,
        'Email': user_info.email,
      },
      success: function(result) {
        gleaner_tracker.checkBadgeRequirements(user_info, result);
      },
      error: function() {
        console.log("An error occured while checking requirements...");
      }
    });
  }
//old one used while everything was hardcoded
this.checkBadgeRequirements = function(user_info, result) {
    // Check requirements based on the previously saved statistic
    // Award badges depending on the statistics:
    // Ten correct answers
    // Clicked elearning three times
    if(result.statistic === "correct") {
      if(result.count % 10 === 0) {
        badge_asserter.assertBadge("other", user_info, "ten-correct");
      }
    }
    else if(result.statistic === "elearning") {
      if(result.count % 3 === 0) {
        badge_asserter.assertBadge("other", user_info, "basic-link");
      }
    }
  }
}
