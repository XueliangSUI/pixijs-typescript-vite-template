import { TestScene } from "@ui/scenes/test.scene";
import { Manager } from "@src/entities/manager";
import { PixiContainer, PixiGraphics, PixiSprite } from "@src/plugins/engine";
import { IWeaponItem } from "@ui/interfaces/IWeaponItem";
import gsap from "gsap";
import { AnimatedSprite, Texture } from "pixi.js";
import { Exp } from "./Exp";
import { Prop } from "./Prop"

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
            // 从enemiesList中移除
            this.scene.enemiesList.splice(this.scene.enemiesList.indexOf(this), 1);
            // 1秒的淡出效果
            gsap.to(this.shape, {
                alpha: 0,
                duration: 0.2,
                onComplete: () => {
                    try {
                        if (this.shape) {
                            if (this.shape instanceof AnimatedSprite) {
                                this.shape.stop()
                            }
                            console.log("enemy destroy", this.shape);
                            const position = { x: this.shape.position.x, y: this.shape.position.y }
                            this.shape.destroy({ children: true, texture: true });
                            this.enemySlain(position)

                        } else {
                            console.log("this.shape不存在");
                        }
                    } catch (e) {
                        console.log("enemy destroy error", e);
                    }
                }
            })
        }
    }

    underAttack(weapenItem: IWeaponItem, beKnockedBackByPlayer = false) {
        // console.log('damage', weapenItem.damage, "this.hp", this.hp)
        if (beKnockedBackByPlayer) {
            this.beKnockedBackByPlayer(weapenItem.knockback)
        } else {
            this.beKnockedBack(weapenItem)
        }
        this.hp -= weapenItem.damage
        if (this.hp <= 0) {
            this.destroy()
        }
    }

    beKnockedBack(weapenItem: IWeaponItem) {
        this.shape.position.x += Math.cos(weapenItem.angle!) * (weapenItem.knockback - this.knockbackResistance)
        this.shape.position.y += Math.sin(weapenItem.angle!) * (weapenItem.knockback - this.knockbackResistance)
    }

    beKnockedBackByPlayer(knockback: number = this.scene.player.shape.width) {
        // 计算enemy和player的角度
        const angle = Math.atan2(this.shape.position.y - this.scene.player.shape.position.y, this.shape.position.x - this.scene.player.shape.position.x)
        this.shape.position.x += Math.cos(angle) * knockback
        this.shape.position.y += Math.sin(angle) * knockback
    }

    enemySlain(position: { x: number, y: number }) {
        // 95%概率掉落经验，5%概率掉落心
        Math.random() > 0.05 ?
            this.dropExp(position) :
            this.dropHeart(position)
    }

    dropExp(position: { x: number, y: number }) {
        new Prop(this.scene, position, "exp1")
    }

    dropHeart(position: { x: number, y: number }) {
        new Prop(this.scene, position, "heart")
    }
}