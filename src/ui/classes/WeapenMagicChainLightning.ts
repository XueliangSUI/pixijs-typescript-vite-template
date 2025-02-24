import { TestScene } from "@ui/scenes/test.scene";
import { WeaponObject } from "./Weapen";
import { Assets } from "pixi.js";
import { PixiTexture } from "@src/plugins/engine";
import { WeapenBulletItem } from "./WeapenBulletItem";
import { WeaponMagicChainLightningItem } from "./WeapenMagicChainLightningItem";
export class WeaponMagicChainLightning extends WeaponObject {

    scene: TestScene
    texture!: PixiTexture
    name: string = "连锁闪电"
    description: string = "引导闪电之力攻击对手，并会在相邻敌人间造成连锁伤害。";
    chainCount = 3
    chainRange: number
    damage: number = 200

    constructor(scene: TestScene) {
        super(scene);
        this.scene = scene
        this.frequency = 1 / 3
        this.knockback = scene.unitLength(0)
        this.speed = scene.unitLength(0)
        this.range = scene.unitLength(600)
        this.size = scene.unitLength(14)
        this.chainRange = this.range


        this.texture = this.scene.allAssets["weapon-magic-chain-lightning"] as PixiTexture;
    }

    async attack() {

        await this.randomDelay()

        setInterval(async () => {

            const targetEnemy = this.scene.findClosestEnemy({ distanceLimit: this.range })
            if (!targetEnemy) {
                // console.log('weapon-magic-chain-lightning no target')
                return
            }

            const weaponItem = new WeaponMagicChainLightningItem({
                scene: this.scene,
                targetEnemy: targetEnemy,
                speed: this.speed,
                size: this.size,
                texture: this.texture,
                range: this.range,
                life: this.life,
                damage: this.damage,
                knockback: this.knockback,
                refPosition: this.scene.player.shape,
                chainCount: this.chainCount,
                chainRange: this.chainRange,
                chainedEnemies: [targetEnemy.id]
            })


        }, 1000 * (1 / this.frequency))
    }
}