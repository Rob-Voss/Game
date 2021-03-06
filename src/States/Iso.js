import Phaser from 'phaser'

export default class extends Phaser.State {

  /**
   *
   */
  init() {

  }

  preload() {
    this.game.load.script('iso', 'src/Plugins/phaser-plugin-isometric.js');
    this.game.load.image('tile', 'assets/tile.png');

    this.game.time.advancedTiming = true;

    // Add and enable the plug-in.
    this.game.plugins.add(Phaser.Plugin.Isometric);

    // This is used to set a game canvas-based offset for the 0, 0, 0 isometric coordinate - by default
    // this point would be at screen coordinates 0, 0 (top left) which is usually undesirable.
    this.game.iso.anchor.setTo(0.5, 0.2);
  }

  create() {
    // Create a group for our tiles.
    this.isoGroup = this.game.add.group();

    // Let's make a load of tiles on a grid.
    this.spawnTiles();

    // Provide a 3D position for the cursor
    this.cursorPos = new Phaser.Plugin.Isometric.Point3();
  }

  update() {
    // Update the cursor position.
    // It's important to understand that screen-to-isometric projection means you have to specify a z position manually, as this cannot be easily
    // determined from the 2D pointer position without extra trickery. By default, the z position is 0 if not set.
    this.game.iso.unproject(this.game.input.activePointer.position, this.cursorPos);

    // Loop through all tiles and test to see if the 3D position from above intersects with the automatically generated IsoSprite tile bounds.
    isoGroup.forEach(function (tile) {
      var inBounds = tile.isoBounds.containsXY(this.cursorPos.x, this.cursorPos.y);
      // If it does, do a little animation and tint change.
      if (!tile.selected && inBounds) {
        tile.selected = true;
        tile.tint = 0x86bfda;
        this.game.add.tween(tile).to({isoZ: 4}, 200, Phaser.Easing.Quadratic.InOut, true);
      }
      // If not, revert back to how it was.
      else if (tile.selected && !inBounds) {
        tile.selected = false;
        tile.tint = 0xffffff;
        this.game.add.tween(tile).to({isoZ: 0}, 200, Phaser.Easing.Quadratic.InOut, true);
      }
    });
  }

  spawnTiles() {
    let tile;
    for (let xx = 0; xx < 256; xx += 38) {
      for (let yy = 0; yy < 256; yy += 38) {
        // Create a tile using the new game.add.isoSprite factory method at the specified position.
        // The last parameter is the group you want to add it to (just like game.add.sprite)
        tile = this.game.add.isoSprite(xx, yy, 0, 'tile', 0, this.isoGroup);
        tile.anchor.set(0.5, 0);
      }
    }
  }

}
