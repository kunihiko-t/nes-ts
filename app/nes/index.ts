import { Rom } from '../rom'

export class Nes {
    rom: Rom

    constructor(buffer: ArrayBuffer) {
        this.rom = new Rom(buffer)
        // this.rom.drawChrData()
    }
}




