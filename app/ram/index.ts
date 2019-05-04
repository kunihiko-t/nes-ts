import { Uint8 } from '../common/types'

export class Ram {
    ram: DataView

    constructor(size: number) {
        const buffer = new ArrayBuffer(size)
        this.ram = new DataView(buffer)
    }

    readAt(offset: Uint8) {
        return this.ram.getUint8(offset)
    }

    write(offset: number, data: Uint8) {
        this.ram.setUint8(offset, data)
    }
}