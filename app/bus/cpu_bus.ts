import { Ram } from '../ram'
import { Rom } from '../rom'
import { Ppu } from '../ppu'
import { Uint8 } from '../common/types'

export class CpuBus {

    wram: Ram
    prgRom: Rom
    ppu: Ppu

    constructor(wram: Ram, prgRom: Rom, ppu: Ppu) {
        this.wram = wram
        this.prgRom = prgRom
        this.ppu = ppu
    }

    read(offset: number): Uint8 {
        if (offset < 0x2000) {
            // WRAM, WRAM mirror
            return this.wram.readAt(offset)
        } else if (offset < 0x4000) {
            //PPU Register, PPU Register mirror
            return 0
        } else if (offset < 0x4020) {
            // 	NES APU and I/O registers
            // 4018-$401F: APU and I/O functionality that is normally disabled
            return 0
        } else {
            // $4020-$FFFF Cartridge space: PRG ROM, PRG RAM, and mapper registers
            //  $6000-$7FFF = Battery Backed Save or Work RAM
            //  $8000-$FFFF = Usual ROM, commonly with Mapper Registers (see MMC1 and UxROM for example)
            return 0
        }
    }

    write(offset: number, data: Uint8) {
        if (offset < 0x0800) {
            // RAM
            this.wram.write(offset, data)
        } else if (offset < 0x2000) {
            // mirror
            this.wram.write(offset - 0x0800, data)
        }
    }
}