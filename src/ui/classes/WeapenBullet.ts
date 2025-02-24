import { TestScene } from "@ui/scenes/test.scene";
import { WeaponObject } from "./Weapen";
import { Assets } from "pixi.js";
import { PixiTexture } from "@src/plugins/engine";
import { WeapenBulletItem } from "./WeapenBulletItem";
export class WeapenBullet extends WeaponObject {

    scene: TestScene
    texture!: PixiTexture
    name: string = "魔弹"
    description: string = "将纯粹的魔力汇聚成团并发射，拥有可靠的伤害、范围和击退效果，是最基础但有效的攻击魔法。";
    constructor(scene: TestScene) {
        super(scene);
        this.scene = scene
        this.frequency = 2
        this.knockback = scene.unitLength(20)
        this.speed = scene.unitLength(14)
        this.range = scene.unitLength(800)
        this.size = scene.unitLength(14)
        this.texture = this.scene.allAssets["weapen-bullet"] as PixiTexture;
    }

    async attack() {

        await this.randomDelay()

        setInterval(async () => {
            // console.log('async attack')
            const targetEnemy = this.scene.findClosestEnemy({ distanceLimit: this.range })
            if (!targetEnemy) {
                console.log('no target')
                return
            }
            // const { WeapenBulletItem } = await import("./WeapenBulletItem");

            const bullet = new WeapenBulletItem({
                scene: this.scene,
                targetEnemy: targetEnemy,
                speed: this.speed,
                size: this.size,
                texture: this.texture,
                range: this.range,
                life: this.life,
                damage: this.damage,
                knockback: this.knockback
            })


        }, 1000 * (1 / this.frequency))
    }
}