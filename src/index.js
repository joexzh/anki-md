import { render } from './main.js'

let front = document.getElementById('front');
if (front) {
    render(front)
}

let back = document.getElementById('back');
if (back) {
    render(back)
}
