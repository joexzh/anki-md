import markdownit from 'markdown-it';
import { katex } from "@mdit/plugin-katex";
import { loadMhchem } from "@mdit/plugin-katex";
import hljs from 'highlight.js'
import mermaid from 'mermaid'
import { instance as viz_instance } from '@viz-js/viz'

async function render(e) {
    e.innerHTML = await renderMD(replaceHTMLElementsInString(e.innerHTML));
    return Promise.all([mermaid.run(), renderGraphviz()]);
}

function show(e) {
    e.style.visibility = "visible";
}

async function renderMD(text) {
    await loadMhchem();
    let md = markdownit({
        typographer: true,
        html: true,
        linkify: true,
        highlight: function (str, lang) {
            if (!lang) return '';

            if (hljs.getLanguage(lang)) {
                try {
                    return hljs.highlight(str, { language: lang }).value;
                } catch (__) { }
            }
            if (lang.toLowerCase() === 'mermaid') {
                return '<pre class="mermaid">' + str + '</pre>';
            }

            return ''; // use external default escaping
        }
    });
    md.use(katex);
    return md.render(text);
}

async function renderGraphviz() {
    let eList = document.querySelectorAll('#anki-md [class*="dot"],[class*="graphviz"]');
    if (eList.length) {
        let viz = await viz_instance();
        eList.forEach(e => {
            e.parentElement.style.overflow = 'auto';
            e.replaceWith(viz.renderSVGElement(e.textContent));
        });
    }
}

function replaceHTMLElementsInString(str) {
    //str = str.replace(/<[\/]?pre[^>]*>/gi, "");
    str = str.replace(/<br\s*[\/]?[^>]*>/gi, "\n");
    //str = str.replace(/<div[^>]*>/gi, "\n");
    // Thanks Graham A!
    //str = str.replace(/<[\/]?span[^>]*>/gi, "")
    //str = str.replace(/<\/div[^>]*>/g, "\n");
    str = str.replace(/&nbsp;/gi, " ");
    str = str.replace(/&tab;/gi, "	");
    str = str.replace(/&gt;/gi, ">");
    str = str.replace(/&lt;/gi, "<");
    return str.replace(/&amp;/gi, "&");
}

export { render, show };