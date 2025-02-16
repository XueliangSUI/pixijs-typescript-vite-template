import { TestScene } from "@ui/scenes/test.scene";
import { WeapenObject } from "./Weapen";

export class WeapenBullet extends WeapenObject {
    level = 0
    scene: TestScene
    constructor(scene: TestScene) {
        super(scene);
        this.scene = scene
        this.frequency = 0.5
        this.speed = scene.unitLength(10)
        this.range = scene.unitLength(800)
        this.size = 2 * scene.baseLength
        
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
            const { WeapenBulletItem } = await import("./WeapenBulletItem");

            const bullet = new WeapenBulletItem(this.scene, targetEnemy)

        }, 1000 * this.frequency)
    }
}