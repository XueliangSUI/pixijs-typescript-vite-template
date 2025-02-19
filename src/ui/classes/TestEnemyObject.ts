import { TestScene } from "@ui/scenes/test.scene";
import { EnemyObject } from "./Enemy";
import { PixiGraphics } from "@src/plugins/engine";
import { AnimatedSprite, Assets, Sprite, Texture } from "pixi.js";
import '@pixi/gif';
export class TestEnemyObject extends EnemyObject {
    constructor(scene: TestScene) {
        super(scene);

        this.hp = 100;
        this.atk = 10;
        this.initShape()
    }

    initShape() {
        const assest = this.scene.allAssets["test-slime"] as Texture[]
        const shape = new AnimatedSprite(assest)
        shape.animationSpeed = 0.05
        shape.play()
        shape.width = this.scene.unitLength(40)
        shape.height = this.scene.unitLength(40)
        shape.anchor.set(0.5, 0.5)
        this.init({ shape: shape, speed: 3, hp: 150, maxHp: 100 });
    }



}