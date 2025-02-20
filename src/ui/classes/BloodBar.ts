import { Manager } from "@src/entities/manager";
import { PixiGraphics } from "@src/plugins/engine";
import { TestScene } from "../scenes/test.scene";

// 血条
export class BloodBar {
    frameShape: PixiGraphics;
    bloodShape: PixiGraphics;
    scene: TestScene;
    constructor(scene:TestScene) {
        this.scene = scene

        // 外层一个灰色的框，内层一个绿色的矩形
        this.frameShape = new PixiGraphics();
        this.frameShape.setStrokeStyle(0x000000);

        this.frameShape.rect(0, 0, this.scene.unitLength(60), this.scene.unitLength(8));
        this.frameShape.fill(0xaaaaaa);
        // 屏幕居中偏下一点
        this.frameShape.position.x = Manager.width / 2
        this.frameShape.position.y = Manager.height / 2 + this.scene.unitLength(20)
        // 相对自身居中
        this.frameShape.pivot.set(this.frameShape.width / 2, this.frameShape.height / 2)

        this.bloodShape = new PixiGraphics();
        this.bloodShape.rect(0, 0, this.scene.unitLength(56), this.scene.unitLength(4));
        this.bloodShape.fill(0x00FF00);
        this.bloodShape.position.x = this.scene.unitLength(2);
        this.bloodShape.position.y = this.scene.unitLength(2);
        this.frameShape.addChild(this.bloodShape);
        this.scene.addChild(this.frameShape);
    }

    update(hp: number, maxHp: number) {
        this.bloodShape.scale.x = hp / maxHp;
    }
}