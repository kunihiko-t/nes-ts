import { Rom } from '../rom'
import { RomLoader } from '../rom/loader'

import { Ram } from '../ram'
import { Cpu } from '../cpu'
import { CpuBus } from '../bus/cpu_bus'

export class Nes {
    prgRom: Rom
    chrRom: Rom
    wram: Ram
    cpu: Cpu

    constructor(buffer: ArrayBuffer) {
        const loader =  new RomLoader(buffer)
        loader.drawSprite()
        this.prgRom = new Rom(loader.prgData)
        this.chrRom = new Rom(loader.chrData)
        this.wram = new Ram(2048)
        const cpuBus = new CpuBus(this.wram, this.prgRom, this.chrRom)
        this.cpu = new Cpu(cpuBus)
    }
}




