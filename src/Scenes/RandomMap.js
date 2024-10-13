class RandomMap extends Phaser.Scene {
    constructor() {
        super("randomMapScene");
        this.tileTypes = {
            water: 0,
            land1: 1,
            land2: 2
        };
        this.noiseSeed = Math.random(); // Random seed for noise
        this.noiseScale = 0.1; // Control the size of the noise sample window
    }

    preload() {
        this.load.image('smb_tiles', 'path_to_tileset_image.png'); // Load your tile set
    }

    create() {
        this.generateMap();

        // Create scene switcher / reload keys
        this.swap = this.input.keyboard.addKey('S');
        this.reload = this.input.keyboard.addKey('R');
        this.shrink = this.input.keyboard.addKey(188); // , key
        this.grow = this.input.keyboard.addKey(190); // . key

        // Update instruction text
        document.getElementById('description').innerHTML = '<h2>RandomMap.js</h2><br>S: Next Scene<br>R: Restart Scene (to randomize tiles)<br>, : Shrink Noise Window<br>. : Grow Noise Window';
    }

    update() {
        // Scene switching / restart
        if (Phaser.Input.Keyboard.JustDown(this.reload)) {
            this.noiseSeed = Math.random(); // New seed
            this.generateMap();
        }
        if (Phaser.Input.Keyboard.JustDown(this.swap)) {
            this.scene.start("tiledSimpleScene");
        }
        if (Phaser.Input.Keyboard.JustDown(this.shrink)) {
            this.noiseScale = Math.max(0.01, this.noiseScale - 0.01); // Decrease noise scale
            this.generateMap();
        }
        if (Phaser.Input.Keyboard.JustDown(this.grow)) {
            this.noiseScale += 0.01; // Increase noise scale
            this.generateMap();
        }
    }

    generateMap() {
        const width = 20;
        const height = 15;
        const rndlvl = [];

        for (let y = 0; y < height; y++) {
            const row = [];
            for (let x = 0; x < width; x++) {
                const noiseValue = this.perlinNoise(x * this.noiseScale, y * this.noiseScale);
                if (noiseValue < -0.05) {
                    row.push(this.tileTypes.water);
                } else if (noiseValue < 0.2) {
                    row.push(this.tileTypes.land1);
                } else {
                    row.push(this.tileTypes.land2);
                }
            }
            rndlvl.push(row);
        }

        // Make tilemap
        const map = this.make.tilemap({
            data: rndlvl,
            tileWidth: 15,
            tileHeight: 20
        });
        const tilesheet = map.addTilesetImage("smb_tiles");
        const layer = map.createLayer(0, tilesheet, 0, 0);
    }

    // Simple wrapper for Perlin noise
    perlinNoise(x, y) {
        // Initialize noise
        const noise = new Noise(this.noiseSeed); // Use noisejs
        return noise.perlin2(x, y);
    }
}
