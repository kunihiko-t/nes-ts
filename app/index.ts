import { Nes } from './nes'

const romPath: string = '../assets/sample1.nes'

fetch(romPath)
    .then(res => {
        console.log(res)
        return res.arrayBuffer()
    })
    .then(fileBuffer => {
        const nes = new Nes(fileBuffer)
        console.log(nes)
        // requestAnimationFrame(nes.run.bind(nes))
    })
    .catch(err => {
        throw new Error(err)
    })
