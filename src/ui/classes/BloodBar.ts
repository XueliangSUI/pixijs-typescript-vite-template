import { Manager } from "src/entities/manager";
import { PixiGraphics } from "src/plugins/engine";

// 血条
export class BloodBar {
    frameShape: PixiGraphics;
    bloodShape: PixiGraphics;
    baseLength: number;
    constructor(baseLength: number) {
        this.baseLength = baseLength;

        // 外层一个灰色的框，内层一个绿色的矩形
        this.frameShape = new PixiGraphics();
        this.frameShape.setStrokeStyle(0x000000);

        this.frameShape.rect(0, 0, 60 * baseLength, 8 * baseLength);
        this.frameShape.fill(0xaaaaaa);
        // 屏幕居中偏下一点
        this.frameShape.position.x = Manager.width / 2
        this.frameShape.position.y = Manager.height / 2 + 10 * baseLength
        // 相对自身居中
        this.frameShape.pivot.set(this.frameShape.width / 2, this.frameShape.height / 2)

        this.bloodShape = new PixiGraphics();
        this.bloodShape.rect(0, 0, 56 * baseLength, 4 * baseLength);
        this.bloodShape.fill(0x00FF00);
        this.bloodShape.position.x = 2 * baseLength;
        this.bloodShape.position.y = 2 * baseLength;
        this.frameShape.addChild(this.bloodShape);
    }

    update(hp: number, maxHp: number) {
        this.bloodShape.scale.x = hp / maxHp;
    }
}