import { TestScene } from "@ui/scenes/test.scene";
import { WeapenBullet } from "./WeapenBullet";
import { Container, Graphics, PI_2, Point, } from "pixi.js";
import { EnemyObject } from "./Enemy";
import { PixiSprite, PixiTexture } from "@src/plugins/engine";
import { WeaponObject } from "./Weapen";
import { INewWeaponBulletItem } from "@ui/interfaces/INewWeaponBulletItem";
import { IWeaponItem } from "@ui/interfaces/IWeaponItem";
import { gsap } from 'gsap'
import { Manager } from "@src/entities/manager";



export class WeaponMagicGeneralDefenseItem implements IWeaponItem {
    scene: TestScene
    angle: number = 0 // 角度
    size: number //半径
    shape: PixiSprite
    shapeContainer: Container = new Container()
    speed: number
    texture: PixiTexture
    range: number
    life: number
    damage: number
    knockback: number
    duration: number

    constructor(props: INewWeaponBulletItem) {
        const { scene, speed, texture, otherTextures, size, range, life, damage, knockback, duration, angle, radius } = props
        this.texture = texture
        this.speed = speed
        this.scene = scene
        this.size = size
        this.range = range
        this.life = life
        this.damage = damage
        this.knockback = knockback
        this.duration = duration!
        this.angle = angle!


        this.shape = new PixiSprite(this.texture)
        this.shape.width = 0
        this.shape.height = 0
        this.shape.anchor.set(0.5, 0.5);
        this.shape.position.x = 0;
        this.shape.position.y = 0
        this.shape.angle = -angle! * 180 / Math.PI - 90
        this.shapeContainer.position.x = scene.player.shape.position.x
        this.shapeContainer.position.y = scene.player.shape.position.y;
        this.shapeContainer.pivot.set(0, 0.5);
        this.shapeContainer.rotation = this.angle
        // 把shape放入container
        this.shapeContainer.addChild(this.shape);
        scene.bg.addChild(this.shapeContainer);

        scene.app.ticker!.add(this.animation)

        gsap.to(this.shape, {
            duration: 0.5,
            alpha: 1,
            x: radius,
            width: this.size,
            height: this.size,
        })
        gsap.to(this.shape, {
            delay: this.duration - 0.5,
            duration: 0.5,
            alpha: 0,
            x: 0,
            // 缩小
            width: 0,
            height: 0,
            onComplete: () => {
                this.destroy()
            }
        })
    }

    animation = (time: any) => {
        // shapeContainer旋转
        this.shapeContainer.angle += this.speed * time.deltaTime
        this.shapeContainer.position.x = this.scene.player.shape.position.x
        this.shapeContainer.position.y = this.scene.player.shape.position.y;
        const targetPos = new Point()
        this.shape.toLocal(new Point(0, 0), this.scene.bg, targetPos)

        // 判断击中敌人
        const collidedEnemies = this.scene.enemiesCollidedByBulletGlobal(
            this.shape.getGlobalPosition(),
            this.shape.width / 2,
        )

        collidedEnemies.forEach(targetEnemy => {
            WeaponObject.collideEnemy({ weapenItem: this, enemy: targetEnemy, reduceWeaponLife: false })
        })
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