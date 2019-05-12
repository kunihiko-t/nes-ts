import { Uint16, Uint8 } from '../common/types'

export const getUpperByte = (word: Uint16): Uint8 => (word >> 8) & 0xff

export const getLowerByte = (word: Uint16): Uint8 => word & 0xff
