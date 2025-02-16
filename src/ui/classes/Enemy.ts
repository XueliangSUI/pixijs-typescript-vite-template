import { TestScene } from "@ui/scenes/test.scene";
import { Manager } from "@src/entities/manager";
import { PixiContainer, PixiGraphics, PixiSprite } from "@src/plugins/engine";

export class EnemyObject {
    baseLength = Math.min(Manager.width, Manager.height) / 1000
    id: number = 0
    speed!: number;
    hp!: number;
    maxHp!: number;
    atk: number = 0;
    x!: number;
    y!: number;
    shape!: PixiSprite | PixiGraphics;
    scene: TestScene

    constructor(scene: TestScene) {
        this.scene = scene
        this.id = scene.newEnemyId();
    }

    init(params: { shape: PixiSprite | PixiGraphics, speed: number, hp: number, maxHp: number }) {
        const { speed, hp, maxHp } = params;
        this.speed = speed * this.baseLength;
        this.hp = hp;
        this.maxHp = maxHp;
        this.shape = params.shape;
    }

    add(container: PixiContainer) {
        if (this.shape) {
            container.addChild(this.shape);
        }
    }

    destroy() {
        if (this.shape) {
            // 从父容器中移除 shape
            if (this.shape.parent) {
                this.shape.parent.removeChild(this.shape);
            }
            // 从enemiesList中移除
            this.scene.enemiesList.splice(this.scene.enemiesList.indexOf(this), 1);
            // 销毁 shape
            this.shape.destroy({ children: true, texture: true });
            // 清空相关属性
            this.speed = 0;
            this.hp = 0;
            this.maxHp = 0;
            this.x = 0;
            this.y = 0;
            this.shape = null as any;
        }
    }

    underAttack(damage: number) {
        console.log('damage', damage, "this.hp", this.hp)
        this.hp -= damage
        if (this.hp <= 0) {

            this.destroy()
        }
    }
}