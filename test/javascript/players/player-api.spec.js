describe('Player API', function() {

  DivinePlayer.players.forEach(function(Player) {

    describe(Player.name, function() {

      describe('static functionality', function() {
        it('should support Player.canPlay', function() {
          expect(Player.canPlay).toBeDefined();
        });
      });

      describe('instance functionality', function() {

        beforeEach(function() {
          jasmine.getFixtures().set('<video id="video"></video>');
          this.player = new Player(document.getElementById('video'), {});
        });

        it('should support Player#play', function() {
          expect(this.player.play).toBeDefined();
        });

        it('should support Player#pause', function() {
          expect(this.player.pause).toBeDefined();
        });

        it('should support Player#paused', function() {
          expect(this.player.paused).toBeDefined();
        });

        it('should support Player#mute', function() {
          expect(this.player.mute).toBeDefined();
        });

        it('should support Player#unmute', function() {
          expect(this.player.unmute).toBeDefined();
        });

        it('should support Player#muted', function() {
          expect(this.player.muted).toBeDefined();
        });
      });

    });

  });
});