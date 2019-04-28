export class Rom {
    static HEADER_SIZE: number = 16
    static PRG_ROM_UNIT: number = 16 * (1 << 10)
    static CHR_ROM_UNIT: number = 8 * (1 << 10)
    data: DataView
    prgRomSize: number // Size of PRG ROM in 16 KB units
    chrRomSize: number // Size of CHR ROM in 8 KB units (Value 0 means the board uses CHR RAM)
    flag6: number
    flag7: number
    flag8: number
    flag9: number
    flag10: number

    constructor(buffer: ArrayBuffer) {
        this.data = new DataView(buffer)
        if (!this.validateHeader()) {
            console.error('Invalid iNES header')
            throw 'Invalid iNES header'
        }
        this.prgRomSize = this.getUint8From(4)
        console.log(`PRG ROM size is ${this.prgRomSize}`)
        this.chrRomSize = this.getUint8From(5)
        console.log(`CHR ROM size is ${this.chrRomSize}`)
        this.flag6 = this.getUint8From(6)
        this.flag7 = this.getUint8From(7)
        this.flag8 = this.getUint8From(8)
        this.flag9 = this.getUint8From(9)
        this.flag10 = this.getUint8From(10)
    }

    validateHeader(): boolean {
        console.log('Checking rom...')
        if (this.getHexStringFrom(0) !== '4e') return false
        if (this.getHexStringFrom(1) !== '45') return false
        if (this.getHexStringFrom(2) !== '53') return false
        if (this.getHexStringFrom(3) !== '1a') return false
        console.log('OK')
        return true
    }

    getHexStringFrom(byteOffset: number): string {
        return this.getUint8From(byteOffset).toString(16)
    }

    getUint8From(byteOffset: number): number {
        return this.data.getUint8(byteOffset)
    }

    getChrRomStart(): number {
        return Rom.HEADER_SIZE + this.prgRomSize * Rom.PRG_ROM_UNIT
    }

    getChrRomEnd(): number {
        return this.getChrRomStart() + this.chrRomSize * Rom.CHR_ROM_UNIT
    }

    drawChrData() {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const start: number = this.getChrRomStart()
        const end: number = this.getChrRomEnd()
        const spriteNum = (end - start) / 16
        canvas.width = 8 * spriteNum
        canvas.height = 8
        document.body.appendChild(canvas)
        for (let i = start; i < end; i += 16) {
            let a = new Array(8)
                .fill([])
                .map(() => new Array<number>())
            for (let j = 0; j < 8; j++) {
                // Use 16byte for 1 sprite
                const sprite1 = this.getUint8From(i + j)
                const sprite2 = this.getUint8From(i + j + 8)
                for (let k = 0; k < 8; k++) {
                    a[j].push((sprite1 >> k) & 0x01)
                    a[j][k] += (sprite2 >> k) & 0x01
                    const v = 255 - (a[j][k]) * (85 * 2)
                    let color = `rgb(${v}, ${v}, ${v})`
                    ctx!.beginPath()
                    ctx!.fillStyle = color
                    ctx!.rect((i - start) / 2 + (7-k), j, 1, 1)
                    ctx!.fill()
                }
            }
        }
    }

}




