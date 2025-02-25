import { TestScene } from "@ui/scenes/test.scene";
import { WeaponObject } from "./Weapen";
import { PixiTexture } from "@src/plugins/engine";
import { WeaponMagicNormalAttackItem } from './WeaponMagicNormalAttackItem'


export class WeaponMagicNormalAttack extends WeaponObject {

    scene: TestScene
    texture!: PixiTexture
    trailTexture!: PixiTexture
    name: string = "一般攻击魔法"
    description: string = "高泛用性的快速攻击魔法，能对目标生物造成可观的伤害。";
    constructor(scene: TestScene) {
        super(scene);
        this.scene = scene
        this.frequency = 1
        this.damage = 200
        this.knockback = scene.unitLength(20)
        this.speed = scene.unitLength(30)
        this.range = scene.unitLength(800)
        this.size = scene.unitLength(10)
        this.texture = this.scene.allAssets["weapon-magic-general-attack-arrow"] as PixiTexture;
        this.trailTexture = this.scene.allAssets["weapon-magic-general-attack"] as PixiTexture;
    }

    async attack() {

        await this.randomDelay()

        setInterval(async () => {
            const targetEnemy = this.scene.findClosestEnemy({ distanceLimit: this.range })
            if (!targetEnemy) {
                return
            }

            const bullet = new WeaponMagicNormalAttackItem({
                scene: this.scene,
                targetEnemy: targetEnemy,
                speed: this.speed,
                size: this.size,
                texture: this.texture,
                otherTextures: [this.trailTexture],
                range: this.range,
                life: this.life,
                damage: this.damage,
                knockback: this.knockback,
            })


        }, 1000 * (1 / this.frequency))
    }
}