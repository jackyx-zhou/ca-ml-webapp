import * as tfvis from '@tensorflow/tfjs-vis';

export default function createVisor() {
    const visor = tfvis.visor();
    visor.el.style.position = "absolute";
    visor.el.style.zIndex = 2000;
    visor.el.children[0].style.maxWidth="100%";
    visor.close();
}