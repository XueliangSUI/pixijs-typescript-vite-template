import { TestScene } from "@ui/scenes/test.scene";
import { EnemyObject } from "@ui/classes/Enemy";
import { PixiTexture } from "@src/plugins/engine";

export interface INewWeaponBulletItem {
    scene: TestScene
    size: number
    targetEnemy?: EnemyObject
    speed: number // 子弹移动速度
    texture: PixiTexture
    otherTextures?: PixiTexture[]
    range: number
    life: number //有效攻击次数
    damage: number
    knockback: number //击退
    angle?: number // 角度
    refPosition?: { x: number, y: number } //参考位置
    duration?: number //持续时间
    radius?: number //半径
}