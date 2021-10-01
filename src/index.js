import Phaser from "phaser"
import MainScene from "./scenes/main.scene"
import GameOverScene from "./scenes/gameover.scene"
import BootloaderScene from "./scenes/bootloader.scene"
import StartScene from "./scenes/start.scene"

export default new Phaser.Game({
    type: Phaser.AUTO,
    parent: document.getElementById("canvas"),
    width: 480,
    height: 640,
    physics: {
        default: "arcade",
        arcade: {
            gravity: {
                y: 0
            }
        }
    },
    scene: [
        BootloaderScene,
        StartScene,
        GameOverScene,
        MainScene,
    ]
});