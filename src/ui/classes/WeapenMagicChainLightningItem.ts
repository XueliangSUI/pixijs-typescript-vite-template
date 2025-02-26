import { TestScene } from "@ui/scenes/test.scene";
import { WeapenBullet } from "./WeapenBullet";
import { Graphics, PI_2, TilingSprite } from "pixi.js";
import { EnemyObject } from "./Enemy";
import { PixiSprite, PixiTexture } from "@src/plugins/engine";
import { WeaponObject } from "./Weapen";
import { INewWeaponBulletItem } from "@ui/interfaces/INewWeaponBulletItem";
import { IWeaponItem } from "@ui/interfaces/IWeaponItem";
import gsap from "gsap";

interface INewWeaponMagicChainLightningItem extends INewWeaponBulletItem {
    refPosition?: { x: number, y: number }
    chainCount: number
    chainRange: number
    chainedEnemies: number[]
}


export class WeaponMagicChainLightningItem implements IWeaponItem {
    scene: TestScene
    angle: number // 角度
    size: number //半径
    shape: PixiSprite | TilingSprite
    speed: number
    texture: PixiTexture
    range: number
    life: number
    damage: number
    knockback: number
    targetEnemy?: EnemyObject
    refPosition: { x: number, y: number }
    chainCount: number
    chainRange: number
    chainedEnemies: number[]

    constructor(props: INewWeaponMagicChainLightningItem) {
        const { scene, targetEnemy, speed, texture, size, range, life, damage, knockback, refPosition, chainCount, chainRange, chainedEnemies } = props
        this.texture = texture
        this.speed = speed
        this.scene = scene
        this.size = size
        this.range = range
        this.life = life
        this.damage = damage
        this.knockback = knockback
        this.targetEnemy = targetEnemy
        this.refPosition = refPosition!
        this.chainCount = chainCount
        this.chainRange = chainRange
        this.chainedEnemies = chainedEnemies
        const unitWidth = this.size * 2

        // length 为两点之间的距离
        const length = Math.sqrt((this.refPosition.x - targetEnemy!.shape.position.x) ** 2 + (this.refPosition.y - targetEnemy!.shape.position.y) ** 2)
        const number = Math.floor(length / unitWidth)
        // shape 由number个this.texture横向拼接而成

        this.shape = new TilingSprite(this.texture, length, this.texture.height)
        this.shape.scale.set(1, 0.5)
        // 起点和终点的坐标为this.refPosition和targetEnemy!.shape.position
        // 计算角度
        this.angle = Math.atan2(targetEnemy!.shape.position.y - this.refPosition.y, targetEnemy!.shape.position.x - this.refPosition.x);
        this.shape.rotation = this.angle
        this.shape.anchor.set(0.5);
        // 初始透明度为0
        this.shape.alpha = 0
        this.shape.position.x = (this.refPosition.x + targetEnemy!.shape.position.x) / 2
        this.shape.position.y = (this.refPosition.y + targetEnemy!.shape.position.y) / 2
        scene.bg.addChild(this.shape);
        gsap.to(this.shape, {
            alpha: 1, duration: 0.1, onComplete: () => {
                gsap.to(this.shape, {
                    alpha: 0, duration: 0.05, onComplete: () => {
                        this.destroy()
                    }
                })
            }
        })
        this.chainAttack()


    }

    chainAttack = () => {
        if (!this.targetEnemy) return

        WeaponObject.collideEnemy({ weapenItem: this, enemy: this.targetEnemy!, reduceWeaponLife: false })
        const cloestEnemy = this.scene.findClosestEnemy({
            distanceLimit: this.chainRange,
            refPosition: this.targetEnemy?.shape.position,
            exceptedEnemiesIds: this.chainedEnemies
        })

        if (!cloestEnemy || (this.chainCount - 1 < 0)) return

        const weaponItem = new WeaponMagicChainLightningItem({
            scene: this.scene,
            targetEnemy: cloestEnemy,
            speed: this.speed,
            size: this.size,
            texture: this.texture,
            range: this.range,
            life: this.life,
            damage: this.damage,
            knockback: this.knockback,
            refPosition: this.targetEnemy.shape.position,
            chainCount: this.chainCount - 1,
            chainRange: this.chainRange,
            chainedEnemies: [...this.chainedEnemies, this.targetEnemy.id]
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

    }
}