import { Ram } from '../ram'
import { Rom } from '../rom'
import { Uint8 } from '../common/types'

export class CpuBus {

    wram: Ram
    prgRom: Rom
    chrRom: Rom

    constructor(wram: Ram, prgRom: Rom, chrRom: Rom) {
        this.wram = wram
        this.prgRom = prgRom
        this.chrRom = chrRom
    }

    read(offset: number): Uint8 {
        return this.wram.readAt(offset)
    }
}