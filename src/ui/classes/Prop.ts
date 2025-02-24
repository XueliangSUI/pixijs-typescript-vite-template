import { PixiSprite } from "@src/plugins/engine"
import { Texture } from "pixi.js"
import { TestScene } from "../scenes/test.scene"
import { gsap } from 'gsap'

export type ExpType = "exp1" | "exp2" | "exp3" | "exp4"
export type PropType = ExpType | "heart"
const allExpTypes = ["exp1", "exp2", "exp3", "exp4"]

const expNumberFromExpType = (type: ExpType) => {
    return type === "exp1" ? 1 : type === "exp2" ? 10 : type === "exp3" ? 100 : 1000
}


export class Prop {
    scene: TestScene
    type: PropType = "exp1"
    shape: PixiSprite
    constructor(scene: TestScene, position: { x: number, y: number }, type: PropType) {
        this.scene = scene
        this.type = type

        this.shape = this.getShape(type)
        this.shape.anchor.set(0.5)
        this.shape.width = this.scene.unitLength(0)
        this.shape.height = this.scene.unitLength(0)
        gsap.to(this.shape, {
            width: this.scene.unitLength(30),
            height: this.scene.unitLength(30),
            duration: 0.2,
        })

        console.log("position", position);
        this.shape.position.set(position.x, position.y)
        this.scene.bg.addChild(this.shape)

        this.scene.propList.push(this)
    }

    // 被吸引
    absorbedByPlayer() {
        const animation = (time: any) => {
            if (!this.shape || !this.shape.position) {
                this.scene.app.ticker!.remove(animation)
                return
            }
            const speed = this.scene.unitLength(2)
            // 向player的位置移动
            const targetX = this.scene.player.shape.position.x
            const targetY = this.scene.player.shape.position.y
            const distance = Math.sqrt(Math.pow(targetX - this.shape.position.x, 2) + Math.pow(targetY - this.shape.position.y, 2))
            const speedX = speed * (targetX - this.shape.position.x) / distance
            const speedY = speed * (targetY - this.shape.position.y) / distance
            // 如果distance<player.radius 则被吸收
            if (distance < this.scene.player.shape.width / 2) {
                // 停止动画
                this.scene.app.ticker!.remove(animation)
                this.destroy()
                if (allExpTypes.includes(this.type)) {
                    this.scene.player.updateExp(expNumberFromExpType(this.type as ExpType))
                } else if (this.type === "heart") {
                    this.scene.player.recoverHp(30)
                }
                return
            } else {
                this.shape.position.x += speedX * time.deltaTime
                this.shape.position.y += speedY * time.deltaTime
            }
        }
        this.scene.app.ticker!.add(animation)
    }

    destroy() {
        this.scene.expList.splice(this.scene.propList.indexOf(this), 1)
        this.shape.destroy()
    }

    getShape = (type: PropType) => {
        const map = {
            "exp1": "exp",
            "exp2": "exp",
            "exp3": "exp",
            "exp4": "exp",
            "heart": "heart",
        }
        return new PixiSprite(this.scene.allAssets[map[type]] as Texture)
    }


}