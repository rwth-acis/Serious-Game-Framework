module.exports = {
  'before': function(client) {
    client.globals.experience = {};
    client.globals.highscores = {};
    client.globals.badges = {};
    client.globals.stats = {
      highscore: 20 * 5,
      exp: (5 * 20) + (3 * 10) + 1 // highscore + (game completed + 2 * ten-correct) + login
    };
  },

  'CheckProfile': function (client) {
    client
      .url('http://localhost:8888/Serious-Game-Framework')
      .waitForElementVisible('#profilelink', 1000)
      .click('#profilelink')
      .pause(1000)
      .assert.title('Profile')
      .useCss()
      .assert.containsText('#user_name', 'marko.kajzer')
      .assert.containsText('#user_real_name', 'Marko Kajzer')
      .assert.containsText('#user_email', 'marko.kajzer@hotmail.de')
      .assert.elementPresent('#experience-badge')
      .assert.elementPresent('#total-exp')
      .getText('#total-exp', function(result) {
        client.globals.experience.total = result.value;
      })
      .assert.elementPresent('#level-exp')
      .getText('#level-exp', function(result) {
        client.globals.experience.level = result.value;
      })
      .assert.elementPresent('#exp-to-next')
      .getText('#exp-to-next', function(result) {
        client.globals.experience.to_next = result.value;
      })
      .assert.elementPresent('img.badge-img')
      .useXpath()
      .assert.elementPresent("//div[@id='badges-container']/span[2]/img")
      .assert.elementPresent("//div[@id='badges-container']/span[3]/img")
      .assert.elementPresent("//div[@id='badges-container']/span[4]/img")
      .useCss()
      .click('#game-header-home')
      .end();
  },

  'PlayFixedGame': function (client) {
    client
      .url('http://localhost:8888/Serious-Game-Framework')
      .pause(1000)
      .click("#game-id-1")
      .assert.title('Hormones')
      .pause(1000)

      // Level 1
      .moveToElement('#piece-id-68',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot0',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-69',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot1',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-70',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot2',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-47',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot3',  10,  10).mouseButtonUp(0)
      .pause(500)
      .click('#button-next')
      .pause(500)

      // Level 2
      .moveToElement('#piece-id-1',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot0',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-12',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot1',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-31',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot2',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-48',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot3',  10,  10).mouseButtonUp(0)
      .pause(500)
      .click('#button-next')
      .pause(500)

      // Level 3
      .moveToElement('#piece-id-0',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot0',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-13',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot1',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-32',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot2',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-49',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot3',  10,  10).mouseButtonUp(0)
      .pause(500)
      .click('#button-next')
      .pause(500)

      // Level 4 (14 statt 15 wäre richtig)
      .moveToElement('#piece-id-0',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot0',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-14',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot1',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-33',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot2',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-50',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot3',  10,  10).mouseButtonUp(0)
      .pause(500)
      .click('#button-next')
      .pause(500)

      // Level 5
      .moveToElement('#piece-id-0',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot0',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-15',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot1',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-34',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot2',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-51',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot3',  10,  10).mouseButtonUp(0)
      .pause(500)
      .click('#button-next')
      .pause(500)

      // Level 6
      .moveToElement('#piece-id-1',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot0',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-16',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot1',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-35',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot2',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-52',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot3',  10,  10).mouseButtonUp(0)
      .pause(500)
      .click('#button-next')
      .pause(500)

      // Level 7
      .moveToElement('#piece-id-0',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot0',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-17',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot1',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-36',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot2',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-53',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot3',  10,  10).mouseButtonUp(0)
      .pause(500)
      .click('#button-next')
      .pause(500)

      // Level 8
      .moveToElement('#piece-id-0',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot0',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-18',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot1',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-37',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot2',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-54',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot3',  10,  10).mouseButtonUp(0)
      .pause(500)
      .click('#button-next')
      .pause(500)

      // Level 9
      .moveToElement('#piece-id-0',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot0',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-19',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot1',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-38',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot2',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-55',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot3',  10,  10).mouseButtonUp(0)
      .pause(500)
      .click('#button-next')
      .pause(500)

      // Level 10
      .moveToElement('#piece-id-0',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot0',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-20',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot1',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-37',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot2',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-56',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot3',  10,  10).mouseButtonUp(0)
      .pause(500)
      .click('#button-next')
      .pause(500)

      // Level 11
      .moveToElement('#piece-id-0',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot0',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-21',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot1',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-39',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot2',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-57',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot3',  10,  10).mouseButtonUp(0)
      .pause(500)
      .click('#button-next')
      .pause(500)

      // Level 12
      .moveToElement('#piece-id-2',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot0',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-22',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot1',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-40',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot2',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-58',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot3',  10,  10).mouseButtonUp(0)
      .pause(500)
      .click('#button-next')
      .pause(500)

      // Level 13
      .moveToElement('#piece-id-3',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot0',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-23',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot1',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-40',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot2',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-48',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot3',  10,  10).mouseButtonUp(0)
      .pause(500)
      .click('#button-next')
      .pause(500)

      // Level 14
      .moveToElement('#piece-id-4',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot0',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-24',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot1',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-41',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot2',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-60',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot3',  10,  10).mouseButtonUp(0)
      .pause(500)
      .click('#button-next')
      .pause(500)

      // Level 15
      .moveToElement('#piece-id-5',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot0',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-25',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot1',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-42',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot2',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-61',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot3',  10,  10).mouseButtonUp(0)
      .pause(500)
      .click('#button-next')
      .pause(500)

      // Level 16
      .moveToElement('#piece-id-6',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot0',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-26',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot1',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-42',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot2',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-62',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot3',  10,  10).mouseButtonUp(0)
      .pause(500)
      .click('#button-next')
      .pause(500)

      // Level 17
      .moveToElement('#piece-id-7',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot0',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-27',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot1',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-43',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot2',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-63',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot3',  10,  10).mouseButtonUp(0)
      .pause(500)
      .click('#button-next')
      .pause(500)

      // Level 18
      .moveToElement('#piece-id-8',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot0',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-28',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot1',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-44',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot2',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-64',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot3',  10,  10).mouseButtonUp(0)
      .pause(500)
      .click('#button-next')
      .pause(500)

      // Level 19
      .moveToElement('#piece-id-9',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot0',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-29',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot1',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-45',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot2',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-65',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot3',  10,  10).mouseButtonUp(0)
      .pause(500)
      .click('#button-next')
      .pause(500)

      // Level 20
      .moveToElement('#piece-id-10',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot0',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-67',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot1',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-46',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot2',  10,  10).mouseButtonUp(0)
      .moveToElement('#piece-id-66',  0,  0).mouseButtonDown(0)
      .moveToElement('#wrapperslot3',  10,  10).mouseButtonUp(0)
      .pause(500)
      .click('#button-next')
      .pause(500)

      .pause(1000)
      .click('#game-header-home')
      .pause(1500)

      .end();
  },

  'returnToProfileAndCheckChanges': function (client) {
    client
      .url('http://localhost:8888/Serious-Game-Framework')
      .waitForElementVisible('#profilelink', 1000)
      .click('#profilelink')
      .pause(1000)
      .assert.title('Profile')
      .assert.containsText('#total-exp',
          parseInt(client.globals.experience.total) + parseInt(client.globals.stats.exp))
      .assert.elementPresent('#level-exp')
      .assert.elementPresent('#exp-to-next')
      .click('#game-header-home')
      .end();
  }
};
