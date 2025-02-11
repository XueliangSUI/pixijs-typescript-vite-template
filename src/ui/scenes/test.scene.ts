import { PixiContainer, PixiSprite, PixiGraphics, PixiSoundLibrary, PixiText } from "../../plugins/engine";
import { Manager, SceneInterface } from "../../entities/manager";
import { Assets } from "pixi.js";
import { Loader } from "pixi.js";
import { App } from '../../app';
export class TestScene extends PixiContainer implements SceneInterface {
    baseLength: number;
    // gameBgImg: PixiSprite;
    enemiesList: EnemyObject[] = [];
    bg: PixiContainer;
    player: PlayerObject;
    bloodBar: BloodBar;
    app: App;

    constructor(app: App) {
        super();
        this.app = app;
        // 屏幕宽高中的较小值，作为基准长度
        this.baseLength = Math.min(Manager.width, Manager.height) / 1000
        this.bg = new PixiContainer();
        this.player = new PlayerObject(this.baseLength);
        this.bloodBar = new BloodBar(this.baseLength)
        this.app.stage?.addChild(this.bloodBar.frameShape);
        this._constructor(app).then(() => {
            console.log('TestScene constructor done');
        });
    }

    async _constructor(app: App) {

        this.interactive = true;
        this.position.x = 0;
        this.position.y = 0;

        const parentWidth = Manager.width;
        const parentHeight = Manager.height;



        // 一个很大的，灰色背景的container

        this.bg.position.x = 0;
        this.bg.position.y = 0;
        this.bg.interactive = true;

        // const imageUrl = 'images/game-bg-scene-1.png'; // 替换为实际的图片URL
        const imageUrl = 'images/game-bg-scene-2.png'; // 替换为实际的图片URL
        const bgTexture = await Assets.load(imageUrl)
        const squareSize = 1100 * this.baseLength
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
        // 将player居中
        this.player.shape.position.x = parentWidth / 2;
        this.player.shape.position.y = parentHeight / 2;
        this.addChild(this.bg);
        generateEmemies(this);
        backgroundMove(app, this.bg, this.player, this.baseLength);
        enemiesMove(this)


    }

    update(framesPassed: number): void {

    }

    resize(parentWidth: number, parentHeight: number): void {

    }
}
// 血条
class BloodBar {
    frameShape: PixiGraphics;
    bloodShape: PixiGraphics;
    baseLength: number;
    constructor(baseLength: number) {
        this.baseLength = baseLength;

        // 外层一个灰色的框，内层一个绿色的矩形
        this.frameShape = new PixiGraphics();
        this.frameShape.setStrokeStyle(0x000000);

        this.frameShape.rect(0, 0, 100 * baseLength, 10 * baseLength);
        this.frameShape.fill(0x00FF00);
        this.frameShape.position.x = 0;
        this.frameShape.position.y = 0;
        this.bloodShape = new PixiGraphics();
        this.bloodShape.rect(0, 0, 100 * baseLength, 10 * baseLength);
        this.bloodShape.fill(0x00FF00);
        this.bloodShape.position.x = 0;
        this.bloodShape.position.y = 0;
        this.frameShape.addChild(this.bloodShape);
    }

    update(hp: number, maxHp: number) {
        this.bloodShape.scale.x = hp / maxHp;
    }
}

class PlayerObject {
    speed: number;
    hp: number;
    shape: PixiSprite | PixiGraphics;
    constructor(baseLength: number) {
        this.speed = 5 * baseLength;
        this.hp = 100;
        // shape是一个黄色的圆形
        const graphics = new PixiGraphics();
        const radius = 10 * baseLength;
        graphics.circle(0, 0, radius);
        graphics.fill(0xFFFF00);
        graphics.pivot.set(radius, radius);
        this.shape = graphics


        // this.shape.width = 50;
        // this.shape.height = 50;

    }
}

class EnemyObject {
    baseLength = Math.min(Manager.width, Manager.height) / 1000
    speed!: number;
    hp!: number;
    maxHp!: number;
    x!: number;
    y!: number;
    shape!: PixiSprite | PixiGraphics;

    init(params: { shape: PixiSprite | PixiGraphics, speed: number, hp: number, maxHp: number }) {
        const { speed, hp, maxHp } = params;
        this.speed = speed * this.baseLength;
        this.hp = hp;
        this.maxHp = maxHp;
        this.shape = params.shape;


    }

    add(container: PixiContainer) {
        if (this.shape) {
            container.addChild(this.shape);
        }
    }

    destroy() {
        if (this.shape) {
            // 从父容器中移除 shape
            if (this.shape.parent) {
                this.shape.parent.removeChild(this.shape);
            }
            // 销毁 shape
            this.shape.destroy({ children: true, texture: true });
            // 清空相关属性
            this.speed = 0;
            this.hp = 0;
            this.maxHp = 0;
            this.x = 0;
            this.y = 0;
            this.shape = null as any;
        }
    }
}

class TestEnemyObject extends EnemyObject {
    constructor() {
        super();

        this.hp = 100;
        // 一个红色的小圆形，中心在自己的中心
        const graphics = new PixiGraphics();
        const radius = 10 * this.baseLength;
        graphics.circle(0, 0, radius);
        graphics.fill(0xFF0000);
        graphics.pivot.set(radius, radius);


        graphics.pivot.set(radius, radius);
        this.init({ shape: graphics, speed: 3, hp: 100, maxHp: 100 });
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

const enemiesMove = (_this: TestScene) => {
    _this.app.ticker!.add((time: any) => {
        _this.enemiesList.forEach((enemy) => {
            if (enemy.shape) {
                const deltaX = _this.player.shape.position.x - enemy.shape.position.x;
                const deltaY = _this.player.shape.position.y - enemy.shape.position.y;
                const angle = Math.atan2(deltaY, deltaX);
                const speedX = Math.cos(angle) * enemy.speed * time.deltaTime;
                const speedY = Math.sin(angle) * enemy.speed * time.deltaTime;
                enemy.shape.position.x += speedX;
                enemy.shape.position.y += speedY;
            }
        })
    })
}

const generateEmemies = (_this: TestScene) => {
    const enemyInitDistance = Math.max(Manager.width, Manager.height) / 2 + 100 * _this.baseLength;
    const timer = setInterval(() => {
        const enemy = new TestEnemyObject();
        _this.enemiesList.push(enemy);
        // 以enemyInitDistance为半径，以player为中心生成敌人
        const angle = Math.random() * Math.PI * 2;
        enemy.shape.position.x = _this.player.shape.position.x + Math.cos(angle) * enemyInitDistance;
        enemy.shape.position.y = _this.player.shape.position.y + Math.sin(angle) * enemyInitDistance;

        _this.bg.addChild(enemy.shape);

    }, 1000);
}