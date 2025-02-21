import { PixiGraphics, PixiSprite } from "src/plugins/engine";
import { EnemyObject } from "./Enemy";
import { TestScene } from "@ui/scenes/test.scene";
import { IWeaponItem } from "@ui/interfaces/IWeaponItem";

// export interface IWeaponItem {
//     life: number
//     destroy: Function
//     damage: number
// }

export class WeaponObject {

    frequency: number = 0; // 频率每秒发射次数
    speed: number = 0;
    range: number = 0;
    size: number = 0;
    damage: number = 100;
    shape!: PixiSprite | PixiGraphics;
    life: number = 1;// 可撞击次数
    hittedEnemies: EnemyObject[] = [];
    level = 0;
    knockback: number = 0;
    name: string = '' //武器名称
    preview: PixiSprite | null = null//预览图片
    description: string = '' //武器描述文字

    constructor(scene: TestScene) { }



    // 碰撞敌人
    static collideEnemy(weapenItem: IWeaponItem, enemy: EnemyObject) {
        // 子弹是否继续存在
        weapenItem.life--;
        if (weapenItem.life <= 0) {
            weapenItem.destroy()
        }
        // 敌人是否销毁
        enemy.underAttack(weapenItem)
    }

    upgrade(up = 1) {
        this.level += up
    }

    attack() { }

    destroy() { }
}