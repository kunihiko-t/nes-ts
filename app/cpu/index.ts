import { Uint16, Uint8 } from '../common/types'
import { CpuBus } from '../bus/cpu_bus'


// 7  bit  0
// ---- ----
// NVss DIZC
// |||| ||||
// |||| |||+- Carry
// |||| ||+-- Zero
// |||| |+--- Interrupt Disable
// |||| +---- Decimal
// ||++------ No CPU effect, see: the B flag
// |+-------- Overflow
// +--------- Negative
interface StatusRegister {
    N: boolean // Negative flag: Set if the result was negative.
    V: boolean// Overflow flag: Set if signed over flow occurred
    R1: boolean // No Cpu effect
    R2: boolean // No Cpu effect
    D: boolean // Decimal flag
    I: boolean // Interrupt flag : 1: forbid 0: allow
    Z: boolean // Zero flag: Set if the result was zero
    C: boolean // Carry flag: Set if unsigned over flow occurred
    // No CPU effect
    PHP: boolean // 11: None
    BRK: boolean // 11: I is set to 1
    IRQ: boolean // 10: I is set to 1
    NMI: boolean // 10: I is set to 1
}


interface Registers {
    PC: Uint16; // Program counter
    A: Uint8; // Accumulator
    X: Uint8; // index
    Y: Uint8; // index
    S: Uint8; // Stack pointer
    P: StatusRegister; // Status Register
}


const defaultStatusRegister = {
    N: false,
    V: false,
    R1: false,
    R2: false,
    D: false,
    I: false,
    Z: false,
    C: false,
    PHP: false,
    BRK: false,
    IRQ: false,
    NMI: false,
}

const defaultRegisters = {
    PC: 0x00,
    A: 0x0,
    X: 0x0,
    Y: 0x0,
    // if S = $FD, and the program pushes something, it'll be written to $01FD and then S becomes $FC to show that $01FC is available to store the next value.
    // It is common practice on a 6502 to initialize the stack pointer to $FF at reset time.
    // https://wiki.nesdev.com/w/index.php/Stack
    S: 0xff,
    P: defaultStatusRegister,
}

export class Cpu {

    registers: Registers
    cpuBus: CpuBus

    constructor(cpuBus: CpuBus) {
        this.registers = defaultRegisters
        this.cpuBus = cpuBus
    }

    reset() {
        console.log('Reset CPU')
        // https://wiki.nesdev.com/w/index.php/CPU_memory_map
        this.registers.PC = this.read(0xFFFC) || 0x8000

        // Reset Registers
        this.registers = defaultRegisters
    }

    // Read word
    read(offset: number): Uint16 {
        const upperByte = this.cpuBus.read(offset)
        const lowerByte = this.cpuBus.read(offset + 1)
        return (upperByte << 8) + lowerByte
    }

    write(offset: number, data: Uint8) {
        this.cpuBus.write(offset, data)
    }

    nmi() {
        // https://wiki.nesdev.com/w/index.php/NMI
        this.registers.P.BRK = false
        this.pushWord(this.registers.PC)
        this.registers.P.I = true
        this.pushStatus()
        this.registers.PC = this.read(0xFFFA)
    }

    irq() {
        this.registers.P.BRK = false
        this.pushWord(this.registers.PC)
        this.pushStatus()
        this.registers.P.I = true
        this.registers.PC = this.read(0xfffe)
    }

    brk() {
        this.registers.P.BRK = true
        this.registers.PC++
        this.pushWord(this.registers.PC)
        this.pushStatus()
        if (!this.registers.P.I) {
            this.registers.P.I = true
            this.registers.PC = this.read(0xfffe)
        }
        this.registers.PC--
    }

    run(): number {

    }


    push(data: Uint8) {
        // if S = $FD, and the program pushes something, it'll be written to $01FD and then S becomes $FC to show that $01FC is available to store the next value.
        this.write(0x100 | (this.registers.S & 0xFF), data)
        this.registers.S--
    }

    pushWord(data: Uint16) {
        this.push(data >> 8) // Push upper byte
        this.push(data & 0xff) // Push lower byte
    }

    pop(): Uint8 {
        this.registers.S++
        return this.read(0x100 | (this.registers.S & 0xFF))
    }


    pushStatus() {
        // https://wiki.nesdev.com/w/index.php/Status_flags
        const status: Uint8 = (+this.registers.P.N) << 7 |
            (+this.registers.P.V) << 6 |
            (+this.registers.P.R1) << 5 |
            (+this.registers.P.R2) << 4 |
            (+this.registers.P.D) << 3 |
            (+this.registers.P.I) << 2 |
            (+this.registers.P.Z) << 1 |
            (+this.registers.P.C)
        this.push(status)
    }

}