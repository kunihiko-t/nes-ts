import { PpuBus } from '../bus/ppu_bus'
import { Uint8 } from '../common/types'


// Controller ($2000) > write
// 7  bit  0
// ---- ----
// VPHB SINN
interface Controller {
    N: number // Base nametable address  (0 = $2000; 1 = $2400; 2 = $2800; 3 = $2C00) 2 bit
    I: boolean // VRAM address increment per CPU read/write of PPUDATA   (0: add 1, going across; 1: add 32, going down)
    S: boolean // Sprite pattern table address for 8x8 sprites (0: $0000; 1: $1000; ignored in 8x16 mode)
    B: boolean // Background pattern table address (0: $0000; 1: $1000)
    H: boolean // Sprite size (0: 8x8 pixels; 1: 8x16 pixels)
    P: boolean // PPU master/slave select  (0: read backdrop from EXT pins; 1: output color on EXT pins)
    V: boolean // Generate an NMI at the start of the vertical blanking interval (0: off; 1: on)
}

// Mask ($2001) > write
// 7  bit  0
// ---- ----
// BGRs bMmG
interface Mask {
    G: boolean // Greyscale (0: normal color, 1: produce a greyscale display)
    m: boolean // 1: Show background in leftmost 8 pixels of screen, 0: Hide
    M: boolean // 1: Show sprites in leftmost 8 pixels of screen, 0: Hide
    b: boolean // 1: Show background
    s: boolean // 1: Show sprites
    ER: boolean // Emphasize red
    EG: boolean // Emphasize green
    EB: boolean // Emphasize blue
}


// https://wiki.nesdev.com/w/index.php/PPU_registers
interface PpuRegisters {
    controller: Controller
    mask: Mask
    OamAddress: Uint8 // OAM address ($2003) > write
    OamData: Uint8 // OAM data ($2004) <> read/write
    scroll: Uint8 // Scroll ($2005) >> write x2
    address: Uint8 // Address ($2006) >> write x2
    data: Uint8 // Data ($2007) <> read/write
    OamDma: Uint8 // OAM DMA ($4014) > write
}

const defaultPpuRegisters = {
    controller: {
        N: 0,
        I: false,
        S: false,
        B: false,
        H: false,
        P: false,
        V: false,
    },
    mask: {
        G: false,
        m: false,
        M: false,
        b: false,
        s: false,
        ER: false,
        EG: false,
        EB: false,
    },
    OamAddress: 0,
    OamData: 0,
    scroll: 0,
    address: 0,
    data: 0,
    OamDma: 0,
}


export class Ppu {

    registers: PpuRegisters
    bus: PpuBus


    constructor(bus: PpuBus) {
        this.registers = defaultPpuRegisters
        this.bus = bus
    }

}