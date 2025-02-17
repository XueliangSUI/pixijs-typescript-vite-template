import { TestScene } from "@ui/scenes/test.scene";
import { WeapenObject } from "./Weapen";
import { Assets } from "pixi.js";
import { PixiTexture } from "@src/plugins/engine";
import { IWeapenBulletItem, WeapenBulletItem } from "./WeapenBulletItem";
export class WeapenBullet extends WeapenObject {
    level = 0
    scene: TestScene
    texture!: PixiTexture
    constructor(scene: TestScene) {
        super(scene);
        this.scene = scene
        this.frequency = 0.5
        this.speed = scene.unitLength(14)
        this.range = scene.unitLength(800)
        this.size = scene.unitLength(6)
        this.loadTexture()
    }

    async loadTexture() {
        const imageUrl = 'images/weapen-bullet.png'; // 替换为实际的图片URL
        this.texture = this.texture || await Assets.load(imageUrl);
    }

    // 工厂函数
    async create(scene: TestScene): Promise<WeapenBullet> {
        const instance = new WeapenBullet(scene);
        await instance.loadTexture(); // 等待材质加载完成
        return instance;
    }

    upgrade(up = 1) {
        this.level += up
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

            const bullet = new WeapenBulletItem({
                scene: this.scene,
                targetEnemy: targetEnemy,
                speed: this.speed,
                size: this.size,
                texture: this.texture,
                range: this.range,
                life: this.life,
                damage: this.damage
            })
            // await bullet.create(this.scene)

        }, 1000 * this.frequency)
    }
}