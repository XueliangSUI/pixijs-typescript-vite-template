import { Manager } from "../../entities/manager";
import { PixiGraphics, PixiSprite } from "../../plugins/engine";
import gsap from "gsap";
import { TestScene } from "@ui/scenes/test.scene";
import { WeapenObject } from "./Weapen";
import { WeapenBullet } from "./WeapenBullet";

export class PlayerObject {
    speed: number;
    maxHp: number;
    hp: number;
    shape: PixiSprite | PixiGraphics;
    weapens: WeapenObject[] = [];
    scene: TestScene
    constructor(scene: TestScene, baseLength: number) {
        this.scene = scene
        this.speed = 5 * baseLength;
        this.maxHp = 100;
        this.hp = 100;
        // shape是一个黄色的圆形
        const graphics = new PixiGraphics();
        const radius = 10 * baseLength;
        graphics.circle(0, 0, radius);
        graphics.fill(0xFFFF00);
        graphics.pivot.set(0.5,0.5);
        this.shape = graphics
        // 将player居中
        this.shape.position.x = Manager.width / 2;
        this.shape.position.y = Manager.height / 2;

        const weapenBullet = new WeapenBullet(this.scene)
        this.addWeapen(weapenBullet)

        // this.shape.width = 50;
        // this.shape.height = 50;

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

    addWeapen(weapen: WeapenObject) {
        this.weapens.push(weapen)
        weapen.attack()

    }
}