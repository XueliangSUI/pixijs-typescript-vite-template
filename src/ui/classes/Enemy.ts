import { TestScene } from "@ui/scenes/test.scene";
import { Manager } from "@src/entities/manager";
import { PixiContainer, PixiGraphics, PixiSprite } from "@src/plugins/engine";
import { IWeaponItem } from "./WeapenBulletItem";
import gsap from "gsap";
import { AnimatedSprite } from "pixi.js";

export class EnemyObject {
    baseLength = Math.min(Manager.width, Manager.height) / 1000
    id: number = 0
    speed!: number;
    hp!: number;
    maxHp!: number;
    atk: number = 0;
    x!: number;
    y!: number;
    shape: PixiSprite | PixiGraphics = new PixiGraphics();
    knockbackResistance: number = 0;
    scene: TestScene

    constructor(scene: TestScene) {
        this.scene = scene
        this.id = scene.newEnemyId();
    }

    init(params: { shape: PixiSprite | PixiGraphics | AnimatedSprite, speed: number, hp: number, maxHp: number }) {
        const { speed, hp, maxHp } = params;
        this.speed = speed * this.baseLength;
        this.hp = hp;
        this.maxHp = maxHp;
        this.shape = params.shape;
    }

    // add(container: PixiContainer) {
    //     if (this.shape) {
    //         console.log('add enemy', this.shape)
    //         container.addChild(this.shape);
    //     }
    // }

    destroy() {
        if (this.shape) {
            // 从父容器中移除 shape

            // 从enemiesList中移除
            this.scene.enemiesList.splice(this.scene.enemiesList.indexOf(this), 1);
            // 1秒的淡出效果
            gsap.to(this.shape, {
                alpha: 0,
                duration: 0.2,
                onComplete: () => {
                    if (this.shape) {
                        if (this.shape instanceof AnimatedSprite) {
                            this.shape.stop()
                        }
                        // 销毁 shape
                        this.shape.destroy({ children: true, texture: true });
                    }
                }
            })
            // 清空相关属性
            this.speed = 0;
            this.hp = 0;
            this.maxHp = 0;
            this.x = 0;
            this.y = 0;
            this.shape = null as any;
        }
    }

    underAttack(weapenItem: IWeaponItem) {
        console.log('damage', weapenItem.damage, "this.hp", this.hp)
        this.beKnockedBack(weapenItem)
        this.hp -= weapenItem.damage
        if (this.hp <= 0) {
            this.destroy()
        }
    }

    beKnockedBack(weapenItem: IWeaponItem) {
        this.shape.position.x += Math.cos(weapenItem.angle!) * (weapenItem.knockback - this.knockbackResistance)
        this.shape.position.y += Math.sin(weapenItem.angle!) * (weapenItem.knockback - this.knockbackResistance)
        // this.shape.position.x = this.x
        // this.shape.position.y = this.y
    }
}