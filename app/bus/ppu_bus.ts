import { Ram } from '../ram'
import { Rom } from '../rom'
import { Sprite } from '../common/types'

export class PpuBus {

    vram: Ram
    chrRom: Rom
    sprites: Array<Sprite>

    constructor(chrRom: Rom, vram: Ram, sprites: Array<Sprite>) {
        this.vram = vram
        this.chrRom = chrRom
        this.sprites = sprites
    }

}