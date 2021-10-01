import Phaser from "phaser";

export default class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
    }

    create() {
        this.createBackground();
        this.createScore();
        this.createStatusBar();
        this.createAnimations();
        this.createYori();
        this.createControls();
        this.createBugs();
        this.createCollisions();
        this.createMusic();
    }

    update() {
        this.checkYoriMovement();
        this.checkPowerups();
        this.checkBugCreation();

    }

    createStatusBar() {
        this.life = 100;
        this.statusBar = this.add.rectangle(
            0,
            100,
            480,
            4,
            0xff0000
        ).setOrigin(0);
    }

    refreshStatusBar() {
        100 - 480
        life
        const width = (this.life * 480) / 100
        this.statusBar.setDisplaySize(
            width,
            4
        );
    }

    bugPunch() {
        this.cameras.main.shake();
        this.sound.play("bug-punch")
        this.life -= 5;
        this.refreshStatusBar();
        this.createGlitch();
        this.increaseBugTimer(2);
        if (this.life <= 0) {
            clearInterval(this.bugTimer);
            this.sound.stopAll();
            this.scene.start("GameOverScene", {
                score: this.score
            });
        }
    }

    createBackground() {
        this.cameras.main.setBackgroundColor(0xededed);
        this.add.image(0, 0, "fury-background").setOrigin(0);
        this.glitchs = this.add.group();
    }

    createAnimations() {
        this.anims.create({
            key: "yori_walk",
            frames: this.anims.generateFrameNumbers("yori")
        })
        this.anims.create({
            key: "mati_walk",
            frames: this.anims.generateFrameNumbers("mati")
        })
        this.anims.create({
            key: "bug_walk",
            frames: this.anims.generateFrameNumbers("bug"),
            repeat: -1,
            frameRate: 16
        })
    }

    createYori() {
        this.yori = this.physics.add.sprite(320, 80, "yori");
        this.yori.setImmovable(true);
        this.bullets = this.physics.add.group();
        this.powerups = this.physics.add.group();
        this.bulletReady = true;
        this.bulletReloadTime = 200;
        if (this.mati) {
            this.mati.destroy();
            this.mati = undefined;
        }
    }

    createMati() {
        if (!this.mati) {

            this.mati = this.physics.add.sprite(this.yori.x + 80, this.yori.y, "mati");
            this.mati.setImmovable(true);
            this.sound.play("mati");
        }
    }

    createControls() {
        this.controls = {
            left: this.input.keyboard.addKey("left"),
            right: this.input.keyboard.addKey("right"),
            fire: this.input.keyboard.addKey("space"),
            mati: this.input.keyboard.addKey("m"),
        }
    }

    createCollisions() {
        this.physics.add.collider(this.bullets, this.bugs, (f, b) => {
            f.destroy();
            b.destroy();
            this.bugs.remove(b);
            this.bullets.remove(f);
            this.increaseBugTimer(20);
            this.increaseBugVelocity();
            this.increaseScore();
            this.sound.play("kill")
        })
        this.physics.add.collider(this.yori, this.powerups, (y, p) => {
            if (p.texture.key === "pr") {
                this.regenerate();
                this.sound.play("pr");
            }
            if (p.texture.key === "fix") {
                this.killBugs();
                this.sound.play("fix");
            }
            p.destroy();
        })


    }

    createBullet(x, y) {

        const bullet = this.physics.add.sprite(x, y, "bullet");
        this.bullets.add(bullet);
        bullet.setPosition(x, y);
        bullet.setVelocityY(500);
        bullet.setCollideWorldBounds(true);
        bullet.body.onWorldBounds = true;
        this.sound.play("bullet", {
            volume: 0.6
        })
        bullet.body.world.on('worldbounds', (body) => {
            if (body.gameObject == bullet) {
                body.gameObject.destroy();
            }
        });
        this.bulletReady = false;
        setTimeout(() => {
            this.bulletReady = true;
        }, this.bulletReloadTime);


    }

    createBugs() {
        this.bugVelocity = -400;
        this.bugs = this.physics.add.group();
        this.appearTime = 800;
    }

    increaseBugVelocity() {
        this.bugVelocity -= 3;
    }

    increaseBugTimer(time) {
        if (this.appearTime > 200) {
            this.appearTime -= time;

        }
    }


    createBug() {
        const y = 600;
        const x = Phaser.Math.Between(20, 460);

        const bug = this.physics.add.sprite(x, y, "bug");
        this.bugs.add(bug);
        bug.setCollideWorldBounds(true);
        bug.body.onWorldBounds = true;
        bug.setVelocityY(this.bugVelocity);
        bug.anims.play("bug_walk", true)

        bug.body.world.on('worldbounds', (body) => {
            if (body.gameObject == bug) {
                this.bugPunch();
                body.gameObject.destroy();
            }
        });

    }

    createPr() {
        const y = 600;
        const x = Phaser.Math.Between(80, 400);

        const pr = this.physics.add.sprite(x, y, "pr");
        this.powerups.add(pr);
        pr.setVelocityY(-300);
        pr.body.world.on('worldbounds', (body) => {
            if (body.gameObject == pr) {
                body.gameObject.destroy();
            }
        });
    }

    createHotfix() {
        const y = 600;
        const x = Phaser.Math.Between(80, 400);

        const fix = this.physics.add.sprite(x, y, "fix");
        this.powerups.add(fix);
        fix.setVelocityY(-300);
        fix.body.world.on('worldbounds', (body) => {
            if (body.gameObject == fix) {
                body.gameObject.destroy();
            }
        });
    }

    createGlitch() {
        const x = Phaser.Math.Between(0, 480);
        const y = Phaser.Math.Between(0, 80);
        const glitch = this.add.image(x, y, "glitch");
        glitch.setScale(0.2);
        this.glitchs.add(glitch);
    }

    checkPowerups() {
        const r = Phaser.Math.Between(1, 2000);
        if (r === 1000) {
            this.createPr();
        }
        if (r < 10 && r > 3) {
            this.createHotfix();
        }
        if (r < 3) {
            if (!this.mati) {
                this.mostrarMati();
            }
        }
    }

    checkBugCreation() {
        const r = Phaser.Math.Between(1, this.appearTime);
        if (r < 15) {
            this.createBug();
        }
    }

    killBugs() {
        this.bugs.children.getArray().forEach(bug => {
            if (bug.active) {
                bug.destroy();
                this.bugs.remove(bug);
                this.increaseScore();
            }
        });
    }

    regenerate() {
        this.killBugs();
        this.life = 100;
        this.refreshStatusBar();
        this.glitchs.children.getArray().forEach(g => {
            if (g.active) {
                g.destroy();
                this.glitchs.remove(g);
            }
        });
    }

    checkYoriMovement() {
        if (this.controls.left.isDown) {
            this.yori.x -= 5;
            this.yori.play("yori_walk", true);
            if (this.mati) {
                this.mati.x -= 5;
                this.mati.play("mati_walk", true);
            }
        }
        if (this.controls.right.isDown) {
            this.yori.x += 5;
            this.yori.play("yori_walk", true);
            if (this.mati) {
                this.mati.x += 5;
                this.mati.play("mati_walk", true);
            }
        }

        if (this.controls.fire.isDown) {

            if (this.bulletReady) {
                this.createBullet(this.yori.x, this.yori.y);
                if (this.mati) {
                    this.createBullet(this.mati.x, this.mati.y);
                }
            }
        }

        if (this.controls.mati.isDown) {
            if (this.matiHelpMessage == true) {
                this.createMati();
            }
        }
    }

    createScore() {
        this.score = 0;
        this.scoreText = this.add.text(
            10,
            620,
            "Puntaje: 0 yoris"
        ).setColor("#000000");
    }

    updateScore() {
        this.scoreText.setText(`Puntaje: ${this.score} yoris`)
    }

    increaseScore() {
        this.score += 2;
        this.updateScore();
    }

    mostrarMati() {
        if (!this.matiHelpMessage) {
            this.matiHelpMessage = true;
            const matiText = this.add.text(
                240,
                300,
                "Apretá [M] para que Mati te ayude"
            ).setColor("#000000").setOrigin(0.5);
            const blinkTimer = setInterval(() => {
                const color = Phaser.Display.Color.RandomRGB();
                const hex = Phaser.Display.Color.RGBToString(
                    color.red,
                    color.blue,
                    color.green
                )
                matiText.setColor(hex);
            }, 50);

            const matiHelp = this.add.sprite(
                240,
                400,
                "mati"
            ).setOrigin(0.5);;
            matiHelp.anims.play("mati_walk");
            setTimeout(() => {
                matiHelp.destroy();
                matiText.destroy();
                clearInterval(blinkTimer);
                this.matiHelpMessage = false;
            }, 2000);

        }
    }

    createMusic() {
        this.sound.play("music", {
            loop: true,
            volume: 0.35
        });
    }




}