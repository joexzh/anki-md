import { promiseRender, show } from './main.js'

let renderPromises = [];

let front = document.getElementById('front');
if (front) {
    renderPromises.push(promiseRender(front));
}

let back = document.getElementById('back');
if (back) {
    renderPromises.push(promiseRender(back));
}

Promise.all(renderPromises).then(() => { show(document.getElementById('anki-md')) });