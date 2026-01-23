"use strict";

const screen = document.getElementById("screen");
const xmlns = "http://www.w3.org/2000/svg";
const xlinkns = "http://www.w3.org/1999/xlink";

let width, height, radm;
let rad = 0;
let frm = Math.random();

const resize = () => {
    width = window.innerWidth || 800; // Default to 800 if 0
    height = window.innerHeight || 600; // Default to 600 if 0
    radm = Math.min(width, height) / 2 - 20;
};

resize();
window.addEventListener("resize", resize);

// Set initial pointer to the middle of the screen
const pointer = { x: width / 2, y: height / 2 };

window.addEventListener("pointermove", (e) => {
    if (width <= 0 || height <= 0) resize();
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    rad = 0;
}, false);

const prepend = (use, i) => {
    const elem = document.createElementNS(xmlns, "use");
    elems[i].use = elem;
    elem.setAttributeNS(xlinkns, "xlink:href", "#" + use);
    screen.prepend(elem);
};

const N = 40;
const elems = [];

// FORCE ALL SEGMENTS TO THE CENTER ON START
for (let i = 0; i < N; i++) {
    elems[i] = { use: null, x: width / 2, y: height / 2 };
}

for (let i = 1; i < N; i++) {
    if (i === 1) prepend("Cabeza", i);
    else if (i === 8 || i === 14) prepend("Aletas", i);
    else prepend("Espina", i);
}

const run = () => {
    requestAnimationFrame(run);
    
    // Safety check: Don't run math if window isn't ready
    if (window.innerWidth === 0) {
        resize();
        return;
    }

    let e = elems[0];
    
    // If the dragon somehow becomes "NaN" (invisible), reset to center
    if (isNaN(e.x)) {
        e.x = width / 2;
        e.y = height / 2;
    }

    const sw = width || 1;
    const sh = height || 1;

    const ax = (Math.cos(3 * frm) * rad * sw) / sh;
    const ay = (Math.sin(4 * frm) * rad * sh) / sw;
    
    e.x += (ax + pointer.x - e.x) / 10;
    e.y += (ay + pointer.y - e.y) / 10;
    
    for (let i = 1; i < N; i++) {
        let e = elems[i];
        let ep = elems[i - 1];
        const a = Math.atan2(e.y - ep.y, e.x - ep.x);
        e.x += (ep.x - e.x + (Math.cos(a) * (100 - i)) / 5) / 4;
        e.y += (ep.y - e.y + (Math.sin(a) * (100 - i)) / 5) / 4;
        const s = (162 + 4 * (1 - i)) / 50;
        
        e.use.setAttributeNS(
            null,
            "transform",
            `translate(${(ep.x + e.x) / 2},${(ep.y + e.y) / 2}) rotate(${
                (180 / Math.PI) * a
            }) scale(${s},${s})`
        );
    }
    
    if (rad < radm) rad++;
    frm += 0.003;
    
    if (rad > 60) {
        pointer.x += (width / 2 - pointer.x) * 0.05;
        pointer.y += (height / 2 - pointer.y) * 0.05;
    }
};

run();
