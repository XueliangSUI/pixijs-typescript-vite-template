import { Manager } from "@src/entities/manager";
import { PixiGraphics } from "@src/plugins/engine";
import { TestScene } from "../scenes/test.scene";
import gsap from "gsap";

// 血条
export class ExpBar {
    frameShape: PixiGraphics;
    expShape: PixiGraphics;
    scene: TestScene;
    constructor(scene: TestScene) {
        this.scene = scene

        // 外层一个灰色的框，内层一个绿色的矩形
        this.frameShape = new PixiGraphics();
        this.frameShape.setStrokeStyle(0x000000);

        this.frameShape.rect(0, 0, Manager.width, this.scene.unitLength(16));
        this.frameShape.fill(0xaaaaaa);
        // 屏幕最顶上
        // this.frameShape.position.x = Manager.width / 2
        // this.frameShape.position.y = Manager.height / 2 + 20 * baseLength
        this.frameShape.position.x = Manager.width / 2
        this.frameShape.position.y = this.scene.unitLength(10)
        // 相对自身居中
        this.frameShape.pivot.set(this.frameShape.width / 2, this.frameShape.height / 2)

        this.expShape = new PixiGraphics();
        this.expShape.rect(0, 0, Manager.width - this.scene.unitLength(4), this.scene.unitLength(8));
        this.expShape.fill(0x00FF00);
        this.expShape.scale.x = 0;
        this.expShape.position.x = this.scene.unitLength(2);
        this.expShape.position.y = this.scene.unitLength(4);
        this.frameShape.addChild(this.expShape);
        this.scene.addChild(this.frameShape);
    }

    update(exp: number, maxExp: number) {
        gsap.to(this.expShape.scale, {
            x: exp / maxExp,
            duration: 0.5
        })
    }


}