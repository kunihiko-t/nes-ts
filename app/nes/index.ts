import { Rom } from '../rom'
import { RomLoader } from '../rom/loader'

import { Ram } from '../ram'
import { Cpu } from '../cpu'
import { CpuBus } from '../bus/cpu_bus'
import { Ppu } from '../ppu'
import { PpuBus } from '../bus/ppu_bus'

export class Nes {
    prgRom: Rom
    chrRom: Rom
    wram: Ram
    vram: Ram
    cpu: Cpu
    ppu: Ppu

    constructor(buffer: ArrayBuffer) {
        const loader =  new RomLoader(buffer)
        loader.drawSprite()
        this.prgRom = new Rom(loader.prgData)
        this.chrRom = new Rom(loader.chrData)
        this.wram = new Ram(2048)
        this.vram = new Ram(0x2000)
        const sprites = loader.getSprites()
        const ppuBus = new PpuBus(this.chrRom, this.vram, sprites)
        this.ppu = new Ppu(ppuBus)
        const cpuBus = new CpuBus(this.wram, this.prgRom, this.ppu)
        this.cpu = new Cpu(cpuBus)
    }
}




