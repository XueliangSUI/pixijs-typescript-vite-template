import { TestScene } from "@ui/scenes/test.scene";
import { WeapenBullet } from "./WeapenBullet";
import { Graphics, PI_2 } from "pixi.js";
import { EnemyObject } from "./Enemy";
import { PixiSprite, PixiTexture } from "@src/plugins/engine";
import { WeaponObject } from "./Weapen";
import { INewWeaponBulletItem } from "@ui/interfaces/INewWeaponBulletItem";
import { IWeaponItem } from "@ui/interfaces/IWeaponItem";
import { gsap } from 'gsap'



export class WeaponMagicNormalAttackItem implements IWeaponItem {
    scene: TestScene
    angle: number // 角度
    size: number //半径
    shape: PixiSprite
    speed: number
    texture: PixiTexture
    trailTexture: PixiTexture
    range: number
    life: number
    damage: number
    knockback: number
    targetEnemy?: EnemyObject
    x1: number
    y1: number
    r1: number
    x2: number
    y2: number
    r2: number
    constructor(props: INewWeaponBulletItem) {
        const { scene, targetEnemy, speed, texture, otherTextures, size, range, life, damage, knockback } = props
        this.texture = texture
        this.trailTexture = otherTextures![0]
        this.speed = speed
        this.scene = scene
        this.size = size
        this.range = range
        this.life = life
        this.damage = damage
        this.knockback = knockback
        this.targetEnemy = targetEnemy

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
        // 为了营造跟踪的视觉效果，提供初始偏差角度
        const distance = Math.sqrt((this.x2 - this.x1) ** 2 + (this.y2 - this.y1) ** 2) / this.scene.unitLength(1);
        const expectedAngle = Math.atan2(this.y2 - this.y1, this.x2 - this.x1);
        // maxDeviationAngle不超过90度,不小于30度
        const maxDeviationAngle = Math.max(Math.min(distance / 1000, Math.PI / 2), Math.PI / 6);

        this.angle = expectedAngle + (Math.random() - 1) * maxDeviationAngle;
        this.shape.angle = this.angle * 180 / Math.PI

        scene.app.ticker!.add(this.animation)
    }

    animation = (time: any) => {
        let { x, y }: { x: number, y: number } = this.shape.position

        this.createTrail()

        if (this.ifTargetEnemyExist()) {



            // 如果目标敌人还在，修正角度
            let x2 = this.targetEnemy!.shape.position.x
            let y2 = this.targetEnemy!.shape.position.y
            const expectedAngle = Math.atan2(y2 - y, x2 - x);
            let angleDiff = expectedAngle - this.angle;
            Math.abs(angleDiff) > Math.PI && (angleDiff > 0 ? angleDiff -= Math.PI * 2 : angleDiff += Math.PI * 2);
            this.angle += angleDiff / 5 * time.deltaTime;
            if (this.angle > Math.PI) {
                this.angle = this.angle - Math.PI * 2
            } else if (this.angle < -Math.PI) {
                this.angle = this.angle + Math.PI * 2
            }
            this.shape.angle = this.angle * 180 / Math.PI
        }
        // 如果目标敌人不在，不修正角度





        // 根据角度移动
        x += Math.cos(this.angle) * this.speed * time.deltaTime;
        y += Math.sin(this.angle) * this.speed * time.deltaTime;

        this.shape.position.x = x;
        this.shape.position.y = y


        // 对于所有击中的敌人，按情况减血
        const collidedEnemies = this.scene.enemiesCollidedByBullet(x, this.shape.position.y, this.size)
        collidedEnemies.forEach((targetEnemy) => {
            WeaponObject.collideEnemy(this, targetEnemy)
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

    ifTargetEnemyExist() {
        return this.targetEnemy?.shape && this.targetEnemy?.shape.position && this.targetEnemy?.shape.position.x && this.targetEnemy?.shape.position.y
    }

    createTrail(position: { x: number, y: number } = this.shape.position) {
        // 在该位置创建尾迹
        const trail = new PixiSprite(this.trailTexture)
        trail.width = this.size * 4
        trail.height = this.size * 2
        trail.anchor.set(0.5);
        trail.position.x = position.x;
        trail.position.y = position.y;
        trail.angle = this.angle * 180 / Math.PI
        this.scene.bg.addChild(trail);
        gsap.to(trail, { alpha: 0, duration: 0.4, onComplete: () => { trail.destroy() } })
    }
}