import { TestScene } from "@ui/scenes/test.scene";
import { WeaponObject } from "./Weapen";
import { Assets } from "pixi.js";
import { PixiTexture } from "@src/plugins/engine";
import { WeapenBulletItem } from "./WeapenBulletItem";
import { WeaponMagicNormalAttackItem } from './WeaponMagicNormalAttackItem'


export class WeaponMagicNormalAttack extends WeaponObject {

    scene: TestScene
    texture!: PixiTexture
    name: string = "一般攻击魔法"
    description: string = "高泛用性的快速攻击魔法，能对目标生物造成可观的伤害。";
    constructor(scene: TestScene) {
        super(scene);
        this.scene = scene
        this.frequency = 1
        this.damage = 200
        this.knockback = scene.unitLength(20)
        this.speed = scene.unitLength(40)
        this.range = scene.unitLength(800)
        this.size = scene.unitLength(10)
        this.texture = this.scene.allAssets["weapon-magic-normal-attack"] as PixiTexture;
    }

    async attack() {

        setInterval(async () => {
            // console.log('async attack')
            const targetEnemy = this.scene.findClosestEnemy(this.range)
            if (!targetEnemy) {
                console.log('no target')
                return
            }
            // const { WeapenBulletItem } = await import("./WeapenBulletItem");

            const bullet = new WeaponMagicNormalAttackItem({
                scene: this.scene,
                targetEnemy: targetEnemy,
                speed: this.speed,
                size: this.size,
                texture: this.texture,
                range: this.range,
                life: this.life,
                damage: this.damage,
                knockback: this.knockback,
            })


        }, 1000 * (1 / this.frequency))
    }
}