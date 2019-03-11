import { Nes } from './nes';

const romPath: string = '../assets/sample1.nes';

// fetch('./static/hello.nes')
fetch(romPath)
    .then(res => res.arrayBuffer())
    .then(fileBuffer => {
        const nes = new Nes(fileBuffer);
        console.log(nes);
        // requestAnimationFrame(nes.run.bind(nes))
    })
    .catch(err => {
        throw new Error(err);
    });
