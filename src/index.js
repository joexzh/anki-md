import { render, show } from './main.js'

let renderPromises = [];

let front = document.getElementById('front');
if (front) {
    renderPromises.push(render(front));
}

let back = document.getElementById('back');
if (back) {
    renderPromises.push(render(back));
}

Promise.all(renderPromises).then(() => { show(document.getElementById('anki-md')) });