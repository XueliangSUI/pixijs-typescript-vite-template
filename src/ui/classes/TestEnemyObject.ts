import { TestScene } from "@ui/scenes/test.scene";
import { EnemyObject } from "./Enemy";
import { PixiGraphics } from "@src/plugins/engine";

export class TestEnemyObject extends EnemyObject {
    constructor(scene: TestScene) {
        super(scene);

        this.hp = 100;
        this.atk = 10
        // 一个红色的小圆形，中心在自己的中心
        const graphics = new PixiGraphics();
        const radius = 10 * this.baseLength;
        graphics.circle(0, 0, radius);
        graphics.fill(0xFF0000);
        graphics.pivot.set(radius, radius);


        graphics.pivot.set(radius, radius);
        this.init({ shape: graphics, speed: 3, hp: 100, maxHp: 100 });
    }



}