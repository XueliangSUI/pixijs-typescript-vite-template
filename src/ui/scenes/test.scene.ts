import { PixiContainer, PixiSprite, PixiGraphics, PixiSoundLibrary, PixiText } from "../../plugins/engine";
import { Manager, SceneInterface } from "../../entities/manager";
import { Assets, Graphics } from "pixi.js";
import { Loader } from "pixi.js";
import { App } from '../../app';
import gsap from "gsap";
import { PlayerObject } from "@ui/classes/Player"
import { BloodBar } from "@ui/classes/BloodBar"
import { EnemyObject } from "@ui/classes/Enemy"
import { TestEnemyObject } from "@ui/classes/TestEnemyObject"
import { WeapenObject } from "@ui/classes/Weapen"
import { WeapenBullet } from "@ui/classes/WeapenBullet"


export class TestScene extends PixiContainer implements SceneInterface {
    baseLength: number;
    // gameBgImg: PixiSprite;
    enemiesList: EnemyObject[] = [];
    bg: PixiContainer;
    player: PlayerObject;
    bloodBar: BloodBar;
    app: App;
    weapenns: WeapenObject[] = []
    enemyId: number = 0 //给敌人生成自增id

    constructor(app: App) {
        super();
        this.app = app;
        // 屏幕宽高中的较小值，作为基准长度
        this.baseLength = Math.min(Manager.width, Manager.height) / 1000
        this.bg = new PixiContainer();
        this.player = new PlayerObject(this, this.baseLength);
        this.bloodBar = new BloodBar(this.baseLength)
        this.addChild(this.bg);
        this.addChild(this.bloodBar.frameShape);
        this._constructor(app).then(() => {
            console.log('TestScene constructor done');
        });
    }

    async _constructor(app: App) {

        this.interactive = true;
        this.position.x = 0;
        this.position.y = 0;


        // 一个很大的，灰色背景的container

        this.bg.position.x = 0;
        this.bg.position.y = 0;
        this.bg.interactive = true;

        // const imageUrl = 'images/game-bg-scene-1.png'; // 替换为实际的图片URL
        const imageUrl = 'images/game-bg-scene-2.png'; // 替换为实际的图片URL
        const bgTexture = await Assets.load(imageUrl)
        const squareSize = this.unitLength(1100)
        for (let row = 0; row < 100; row++) {
            for (let col = 0; col < 100; col++) {
                const sprite = new PixiSprite(bgTexture);
                sprite.width = squareSize;
                sprite.height = squareSize;
                sprite.x = col * squareSize;
                sprite.y = row * squareSize;
                // 将Sprite添加到Container中
                this.bg.addChild(sprite);
            }
        }



        this.bg.on('pointerdown', () => {
            console.log('bg pointerdown');
        });
        this.bg.addChild(this.player.shape);


        generateEmemies(this);
        backgroundMove(app, this.bg, this.player, this.baseLength);
        enemiesMove(this)
        this.collisionDetections(this);


    }

    unitLength(length: number) {
        return length * this.baseLength
    }

    update(framesPassed: number): void {

    }

    resize(parentWidth: number, parentHeight: number): void {

    }

    newEnemyId() {
        this.enemyId += 1;
        return this.enemyId;
    }

    findClosestEnemy = (distanceLimit?: number): EnemyObject | null => {
        let closestEnemy: EnemyObject | null = null;
        let minDistance = Infinity;
        this.enemiesList.forEach((enemy) => {
            if (enemy.shape) {
                const distance = Math.sqrt((enemy.shape.position.x - this.player.shape.position.x) ** 2 + (enemy.shape.position.y - this.player.shape.position.y) ** 2);

                if (distance < minDistance) {
                    minDistance = distance;
                    closestEnemy = enemy;
                    if (closestEnemy) {
                    }
                }
            }
        })
        if (distanceLimit && minDistance > distanceLimit) {
            console.log("minDistance: ", minDistance);
            console.log("distanceLimit: ", distanceLimit);
            return null;
        } else {
            return closestEnemy
        }
    }

    collisionDetections = (scene: TestScene) => {
        scene.app.ticker!.add((time: any) => {
            scene.enemiesList.forEach((enemy) => {
                if (enemy.shape) {
                    if (this.collisionDetectionCircle(scene.player, enemy)) {
                        enemy.destroy();
                        scene.player.minusHp(enemy.atk);
                        // 输出所有scene.bg的子元素
                        console.log(scene.bg.children);
                    }
                }
            })
        })

    }

    // 圆形碰撞检测
    collisionDetectionCircle = (obj1: PlayerObject | EnemyObject | any, obj2: PlayerObject | EnemyObject | any) => {
        const distanceX = obj1.shape.position.x - obj2.shape.position.x;
        const distanceY = obj1.shape.position.y - obj2.shape.position.y;
        const radiusSum = obj1.shape.width / 2 + obj2.shape.width / 2;

        return distanceX ** 2 + distanceY ** 2 <= radiusSum ** 2;
    }

    collisionDetectionCirclePosition = (positionObj: { x1: number, y1: number, x2: number, y2: number, r1: number, r2: number }) => {
        return (positionObj.x1 - positionObj.x2) ** 2 + (positionObj.y1 - positionObj.y2) ** 2 <= (positionObj.r1 + positionObj.r2) ** 2
    }

    // 检测子弹碰到任何敌人
    enemiesCollidedByBullet = (x: number, y: number, radius: number): EnemyObject[] => {
        const enemies = this.enemiesList.filter((enemy: EnemyObject) => {
            if (!enemy.shape) return false
            return this.collisionDetectionCirclePosition({ x1: x, y1: y, x2: enemy.shape.position.x, y2: enemy.shape.position.y, r1: radius, r2: enemy.shape.width / 2 })
        })
        return enemies
    }

}















const backgroundMove = (app: App, bg: PixiContainer, player: PlayerObject, baseLength: number) => {
    let mouseX = 0;
    let mouseY = 0;
    bg.on('mousemove', (event: any) => {
        mouseX = event.data.global.x;
        mouseY = event.data.global.y;

    });
    app.ticker!.add((time: any) => {
        // console.log("MouseX: ", mouseX, "MouseY: ", mouseY);
        const centerX = app._app.renderer.width / 2;
        const centerY = app._app.renderer.height / 2;
        const deltaX = mouseX - centerX;
        const deltaY = mouseY - centerY;
        const angle = Math.atan2(deltaY, deltaX);
        const speedX = Math.cos(angle) * player.speed * time.deltaTime;
        const speedY = Math.sin(angle) * player.speed * time.deltaTime;
        bg.position.x -= speedX;
        player.shape.position.x += speedX;
        bg.position.y -= speedY;
        player.shape.position.y += speedY;

    })

}

const enemiesMove = (scene: TestScene) => {
    scene.app.ticker!.add((time: any) => {
        scene.enemiesList.forEach((enemy) => {
            if (enemy.shape) {
                const deltaX = scene.player.shape.position.x - enemy.shape.position.x;
                const deltaY = scene.player.shape.position.y - enemy.shape.position.y;
                const angle = Math.atan2(deltaY, deltaX);
                const speedX = Math.cos(angle) * enemy.speed * time.deltaTime;
                const speedY = Math.sin(angle) * enemy.speed * time.deltaTime;
                enemy.shape.position.x += speedX;
                enemy.shape.position.y += speedY;
            }
        })
    })
}

const generateEmemies = (scene: TestScene) => {
    const enemyInitDistance = Math.max(Manager.width, Manager.height) / 2 + 100 * scene.baseLength;
    const timer = setInterval(() => {
        const enemy = new TestEnemyObject(scene);
        scene.enemiesList.push(enemy);
        // 以enemyInitDistance为半径，以player为中心生成敌人
        const angle = Math.random() * Math.PI * 2;
        enemy.shape.position.x = scene.player.shape.position.x + Math.cos(angle) * enemyInitDistance;
        enemy.shape.position.y = scene.player.shape.position.y + Math.sin(angle) * enemyInitDistance;

        scene.bg.addChild(enemy.shape);

    }, 1000);
}



