import Phaser from "phaser"
import YoriPng from "../assets/yori.png";
import MatiPng from "../assets/mati.png";
import BugPng from "../assets/bug.png";
import BulletPng from "../assets/bullet.png";
import PrPng from "../assets/pr.png";
import FixPng from "../assets/fix.png";
import FuryBackgroundPng from "../assets/fury-background.png";
import GlitchPng from "../assets/glitch.png";
import IntroMp3 from "../assets/intro.mp3";
import MusicMp3 from "../assets/music.mp3";
import BulletMp3 from "../assets/bullet.mp3";
import KillMp3 from "../assets/kill.mp3";
import BugPunchMp3 from "../assets/bug-punch.mp3";
import GameoverMp3 from "../assets/gameover.mp3";
import PrMp3 from "../assets/pr.mp3";
import FixMp3 from "../assets/fix.mp3";
import MatiMp3 from "../assets/mati.mp3";

export default class BootloaderScene extends Phaser.Scene {
    constructor() {
        super("BootloaderScene")
    }

    preload() {
        this.load.spritesheet("yori", YoriPng, {
            frameWidth: 128,
            frameHeight: 128
        });
        this.load.spritesheet("mati", MatiPng, {
            frameWidth: 128,
            frameHeight: 128
        });
        this.load.spritesheet("bug", BugPng, {
            frameWidth: 42,
            frameHeight: 37
        });
        this.load.image("bullet", BulletPng);
        this.load.image("pr", PrPng);
        this.load.image("fix", FixPng);
        this.load.image("fury-background", FuryBackgroundPng);
        this.load.image("glitch", GlitchPng);

        this.load.audio("intro", [IntroMp3]);
        this.load.audio("bug-punch", [BugPunchMp3]);
        this.load.audio("bullet", [BulletMp3]);
        this.load.audio("gameover", [GameoverMp3]);
        this.load.audio("kill", [KillMp3]);
        this.load.audio("music", [MusicMp3]);
        this.load.audio("fix", [FixMp3]);
        this.load.audio("pr", [PrMp3]);
        this.load.audio("mati", [MatiMp3]);

        this.load.on("complete", () => {
            this.scene.start("StartScene")
        });
    }

}