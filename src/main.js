import markdownit from 'markdown-it';
import { katex } from "@mdit/plugin-katex";
import { loadMhchem } from "@mdit/plugin-katex";
import hljs from 'highlight.js'
import mermaid from 'mermaid'
import { instance as viz_instance } from "@viz-js/viz";

await loadMhchem();

function promiseRender(e) {
    return promiseRenderMD(replaceHTMLElementsInString(e.innerHTML))
        .then(text => {
            e.innerHTML = text;
            return Promise.all([mermaid.run(), promiseRenderGraphviz()]);
        });
}

function show(e) {
    e.style.visibility = "visible";
}

function promiseRenderMD(text) {
    return loadMhchem().then(() => {
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
    });
}

function promiseRenderGraphviz() {
    return new Promise(resolve => {
        let eList = document.querySelectorAll('#anki-md [class*="dot"],[class*="graphviz"]');
        if (!eList.length) {
            resolve();
            return;
        } else {
            viz_instance().then(viz => {
                eList.forEach(e => {
                    e.parentElement.style.overflow = 'auto';
                    e.replaceWith(viz.renderSVGElement(e.textContent));
                });
                resolve();
            });
        }
    });
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

export { promiseRender, show };
