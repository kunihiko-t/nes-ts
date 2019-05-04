import { Uint16, Uint8 } from '../common/types'
import { CpuBus } from '../bus/cpu_bus'


interface StatusRegisters {
    N: boolean; // Negative flag: Set if the result was negative.
    V: boolean; // Overflow flag: Set if signed over flow occurred
    D: boolean; // Decimal flag
    I: boolean; // Interrupt flag : 1: forbid 0: allow
    Z: boolean; // Zero flag: Set if the result was zero
    C: boolean; // Carry flag: Set if unsigned over flow occurred
}


interface Registers {
    PC: Uint16; // Program counter
    A: Uint8; // Accumulator
    X: Uint8; // index
    Y: Uint8; // index
    S: Uint8; // Stack pointer
    P: Uint8; // Status Register
}

const defaultRegisters = {
    PC: 0x00,
    A: 0x0,
    X: 0x0,
    Y: 0x0,
    S: 0x0,
    P: 0x0,
}

const defaultStatusRegisters = {
    N: false,
    V: false,
    D: false,
    I: false,
    Z: false,
    C: false,
}

export class Cpu {

    registers: Registers
    statusRegisters: StatusRegisters
    cpuBus: CpuBus

    constructor(cpuBus: CpuBus) {
        this.registers = defaultRegisters
        this.statusRegisters = defaultStatusRegisters
        this.cpuBus = cpuBus
    }

    reset() {
        console.log('Reset CPU')
        // https://wiki.nesdev.com/w/index.php/CPU_memory_map
        this.registers.PC = this.read(0xFFFC) || 0x8000
    }

    read(offset: number): Uint16 {
        const upperByte = this.cpuBus.read(offset)
        const lowerByte = this.cpuBus.read(offset + 1)
        return (upperByte << 8) + lowerByte
    }

    run(): number {

    }
}