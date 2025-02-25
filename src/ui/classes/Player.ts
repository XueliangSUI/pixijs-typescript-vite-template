import { Manager } from "../../entities/manager";
import { PixiGraphics, PixiSprite } from "../../plugins/engine";
import gsap from "gsap";
import { TestScene } from "@ui/scenes/test.scene";
import { WeaponObject } from "./Weapen";
import { WeapenBullet } from "./WeapenBullet";
import { Container, Sprite, Texture } from "pixi.js";
import { WeaponMagicNormalAttack } from "./WeaponMagicNormalAttack";
import { WeaponMagicChainLightning } from "./WeapenMagicChainLightning";
import { WeaponMagicGeneralDefense } from "./WeaponMagicGeneralDefense"

export class PlayerObject {
    speed: number;
    maxHp: number;
    hp: number;
    shape: PixiSprite | PixiGraphics;
    weapons: WeaponObject[] = [];
    scene: TestScene
    directionArrow!: Sprite | Container
    expAbsorbRange: number = 0
    exp: number = 0
    lv: number = 1
    constructor(scene: TestScene, baseLength: number) {
        this.scene = scene
        this.speed = this.scene.unitLength(5);
        this.maxHp = 100;
        this.hp = 100;
        this.expAbsorbRange = this.scene.unitLength(100)
        // shape是一个黄色的圆形
        const graphics = new PixiGraphics();
        const radius = this.scene.unitLength(15);
        graphics.circle(0, 0, radius);
        graphics.fill(0xFFFF00);
        graphics.pivot.set(0.5, 0.5);
        this.shape = graphics
        // 将player居中
        this.shape.position.x = Manager.width / 2;
        this.shape.position.y = Manager.height / 2;

        // 添加方向箭头
        this.addDirectionArrow(scene, radius)


        // const weapenBullet = new WeapenBullet(this.scene)
        // this.addWeapon(weapenBullet)
        // const weaponMagicNormalAttack = new WeaponMagicNormalAttack(this.scene)
        // this.addWeapon(weaponMagicNormalAttack)
        // const weaponMagicChainLightning = new WeaponMagicChainLightning(this.scene)
        // this.addWeapon(weaponMagicChainLightning)
        const weaponMagicGeneralDefense = new WeaponMagicGeneralDefense(this.scene)
        this.addWeapon(weaponMagicGeneralDefense)


    }

    init() {

    }

    setHp(hp: number) {
        this.hp = hp
        this.scene.bloodBar.update(this.hp, this.maxHp)
    }

    minusHp(hp: number) {
        this.setHp(this.hp - hp)
        this.blink()
    }

    blink() {
        // 创建一个闪烁动画
        gsap.to(this.shape, {
            alpha: 0.3, // 透明度变为 0
            duration: 0.1, // 动画持续时间 0.1 秒
            repeat: 3, // 重复一次
            yoyo: true, // 动画往返
            onComplete: () => {
                this.shape.alpha = 1; // 确保动画结束后透明度恢复为 1
            }
        });
    }

    addDirectionArrow(scene: TestScene, radius: number) {
        const arrowContainer = new Container()
        const arrow = new Sprite(scene.allAssets["direction-arrow"] as Texture)
        arrow.anchor.set(0.5, 0.5)
        arrow.width = 20
        arrow.height = 20

        arrow.position.set(this.shape.position.x, this.shape.position.y)
        arrowContainer.addChild(arrow)
        // arrow初始位于player的正上方2个半径的位置
        arrow.position.set(0, -radius * 2)
        // arrowContainer底边中心设为中点  
        arrowContainer.pivot.set(0.5, 1)
        // arrowContainer位置设为player的位置
        arrowContainer.position.set(this.shape.position.x, this.shape.position.y)
        // arrowContainer旋转角度设为0  
        arrowContainer.angle = 0
        this.directionArrow = arrowContainer
        this.scene.addChild(arrowContainer)
    }

    addWeapon(weapon: WeaponObject) {
        this.weapons.push(weapon)
        weapon.attack()

    }

    updateDirectionArrow(angle: number) {
        this.directionArrow.angle = angle

    }

    updateExp(exp: number) {
        this.exp += exp
        this.scene.expBar.update(this.exp, this.lv * 100)
        if (this.exp >= this.lv * 100) {
            this.lv += 1
            this.exp = 0
            this.scene.expBar.update(this.exp, this.lv * 100)
        }
    }

    recoverHp(hp: number) {
        this.setHp(Math.max(this.hp + hp, this.maxHp))
    }
}