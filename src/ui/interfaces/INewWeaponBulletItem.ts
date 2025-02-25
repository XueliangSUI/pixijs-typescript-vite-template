import { TestScene } from "@ui/scenes/test.scene";
import { EnemyObject } from "@ui/classes/Enemy";
import { PixiTexture } from "@src/plugins/engine";

export interface INewWeaponBulletItem {
    scene: TestScene
    size: number
    targetEnemy?: EnemyObject
    speed: number
    texture: PixiTexture
    otherTextures?: PixiTexture[]
    range: number
    life: number
    damage: number
    knockback: number
    angle?: number
    refPosition?: { x: number, y: number }
}