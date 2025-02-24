import { PixiSprite } from "@src/plugins/engine"
import { Texture } from "pixi.js"
import { TestScene } from "../scenes/test.scene"
import { gsap } from 'gsap'

export class Exp {
    scene: TestScene
    type: number = 1
    shape: PixiSprite
    constructor(scene: TestScene, position: { x: number, y: number }, type: number = 1) {
        this.scene = scene
        this.type = type

        this.shape = new PixiSprite(this.scene.allAssets["exp"] as Texture)
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

        this.scene.expList.push(this)
    }

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
            // 如果distance<player.radius
            if (distance < this.scene.player.shape.width / 2) {
                // 停止动画
                this.scene.app.ticker!.remove(animation)
                this.destroy()
                this.scene.player.updateExp(this.type)
                return
            } else {
                this.shape.position.x += speedX * time.deltaTime
                this.shape.position.y += speedY * time.deltaTime
            }
        }
        this.scene.app.ticker!.add(animation)
    }

    destroy() {
        this.scene.expList.splice(this.scene.expList.indexOf(this), 1)
        this.shape.destroy()
    }


}