import { Uint8 } from '../common/types'

export class Rom {
    rom: DataView

    constructor(data: DataView) {
        this.rom = data
    }

    get size(): number {
        return this.rom.byteLength
    }

    public read(address: number): Uint8 {
        return this.rom.getUint8(address)
    }
}