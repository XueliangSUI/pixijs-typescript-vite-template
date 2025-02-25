import { TestScene } from "@ui/scenes/test.scene";
import { WeaponObject } from "./Weapen";
import { Assets } from "pixi.js";
import { PixiTexture } from "@src/plugins/engine";
import { WeaponMagicGeneralDefenseItem } from "./WeaponMagicGeneralDefenseItem";

export class WeaponMagicGeneralDefense extends WeaponObject {

    scene: TestScene
    texture!: PixiTexture
    duration: number = 6
    radius!: number
    name: string = "一般防御魔法"
    description: string = "环绕于自身周围的防御魔法，能有效击退敌人及阻挡伤害。";

    constructor(scene: TestScene) {
        super(scene);
        this.scene = scene
        this.frequency = 1 / 10

        this.damage = 200
        this.knockback = scene.unitLength(40)
        this.speed = scene.unitLength(3)
        this.radius = scene.unitLength(150)
        this.size = scene.unitLength(100)
        this.texture = this.scene.allAssets["weapon-magic-general-defense"] as PixiTexture;
    }

    async attack() {

        await this.randomDelay()

        this.scene.doSetInterval(async () => {


            [0, Math.PI].forEach(angle => {

                const bullet = new WeaponMagicGeneralDefenseItem({
                    scene: this.scene,
                    speed: this.speed,
                    size: this.size,
                    texture: this.texture,
                    range: this.range,
                    life: this.life,
                    damage: this.damage,
                    knockback: this.knockback,
                    duration: this.duration,
                    angle: angle,
                    radius: this.radius
                })
            })


        }, 1000 * (1 / this.frequency))
    }

}