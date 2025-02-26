import { TestScene } from "@ui/scenes/test.scene";
import { WeapenBullet } from "./WeapenBullet";
import { Graphics, PI_2 } from "pixi.js";
import { EnemyObject } from "./Enemy";
import { PixiSprite, PixiTexture } from "@src/plugins/engine";
import { WeaponObject } from "./Weapen";
import { INewWeaponBulletItem } from "@ui/interfaces/INewWeaponBulletItem";
import { IWeaponItem } from "@ui/interfaces/IWeaponItem";



export class WeapenBulletItem implements IWeaponItem {
    scene: TestScene
    angle: number // 角度
    size: number //半径
    shape: PixiSprite
    speed: number
    texture: PixiTexture
    range: number
    life: number
    damage: number
    knockback: number
    x1: number
    y1: number
    r1: number
    x2: number
    y2: number
    r2: number
    constructor(props: INewWeaponBulletItem) {
        const { scene, targetEnemy, speed, texture, size, range, life, damage, knockback } = props
        this.texture = texture
        this.speed = speed
        this.scene = scene
        this.size = size
        this.range = range
        this.life = life
        this.damage = damage
        this.knockback = knockback

        this.shape = new PixiSprite(this.texture)
        this.shape.width = this.size * 2
        this.shape.height = this.size * 2
        this.shape.anchor.set(0.5);


        this.x1 = this.scene.player.shape.position.x
        this.y1 = this.scene.player.shape.position.y
        this.r1 = this.size
        this.x2 = targetEnemy!.shape.position.x
        this.y2 = targetEnemy!.shape.position.y
        this.r2 = targetEnemy!.shape.width / 2

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
        collidedEnemies.forEach((targetEnemy) => {
            WeaponObject.collideEnemy({ weapenItem: this, enemy: targetEnemy })
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
        if (this.shape) {
            try {
                this.shape.parent?.removeChild(this.shape);
            } catch (e) {
                console.error("WeapenBulletItem destroy", e)
            }
        }
        // 移除动画
        this.scene.app.ticker!.remove(this.animation);
    }
}