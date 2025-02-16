import { TestScene } from "@ui/scenes/test.scene";
import { WeapenBullet } from "./WeapenBullet";
import { Graphics, PI_2 } from "pixi.js";
import { EnemyObject } from "./Enemy";

export class WeapenBulletItem extends WeapenBullet {
    scene: TestScene
    // 角度
    angle: number
    size: number //半径
    shape: Graphics
    x1: number
    y1: number
    r1: number
    x2: number
    y2: number
    r2: number
    constructor(scene: TestScene, enemy: EnemyObject,) {
        super(scene);
        this.scene = scene
        this.size = scene.unitLength(8)
        this.shape = new Graphics();
        this.shape.circle(0, 0, this.size);
        // 黄色圆球，白色边框
        // this.shape.setStrokeStyle(2);
        this.shape.lineStyle(2, 0xFFFFFF);
        this.shape.fill(0xFFFF00);

        this.x1 = this.scene.player.shape.position.x
        this.y1 = this.scene.player.shape.position.y
        this.r1 = this.size
        this.x2 = enemy.shape.position.x
        this.y2 = enemy.shape.position.y
        this.r2 = enemy.shape.width / 2

        this.angle = Math.atan2(this.y2 - this.y1, this.x2 - this.x1);

        scene.bg.addChild(this.shape);
        this.shape.position.x = scene.player.shape.position.x;
        this.shape.position.y = scene.player.shape.position.y;

        scene.app.ticker!.add(this.animation)
    }

    animation = (time: any) => {
        let { x, y }: { x: number, y: number } = this.shape.position

        // 根据角度移动
        x += Math.cos(this.angle) * this.speed * time.deltaTime;
        y += Math.sin(this.angle) * this.speed * time.deltaTime;

        this.shape.position.x = x;
        this.shape.position.y = y

        // 对于所有击中的敌人，按情况减血
        const collidedEnemies = this.scene.enemiesCollidedByBullet(x, this.shape.position.y, this.size)
        collidedEnemies.forEach((enemy) => {
            this.collideEnemy(this, enemy)
        })
        //   如果超出范围
        const bulletMoveDistance = Math.sqrt((x - this.x1) ** 2 + (y - this.y1) ** 2);
        if (
            bulletMoveDistance > this.range
        ) {
            this.destroy()
        }
    }

    destroy() {
        this.shape.destroy({ children: true, texture: true });
        // 移除动画
        this.scene.app.ticker!.remove(this.animation);
    }
}