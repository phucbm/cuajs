// public styles
import '@viivue/atomic-css';
import 'honcau';

// dev style
import './style.scss';

// source script
import '@/_index';

// import package info
const packageInfo = require('../package.json');

/**
 * Update HTML
 */
// update title
const title = `${packageInfo.prettyName} v${packageInfo.version}`;
document.title = `${title} - ${packageInfo.description}`;
document.querySelector('[data-title]').innerHTML = title;


const instance = CuaJs.init({
    wrapper: document.querySelector('[data-cua-custom]'),
    onScrollableContent: (data) => {
        //console.log(data)
    },
    autoScroll: true
});

document.querySelectorAll(`[data-horizontal-target]`).forEach(targetElement => {
    instance.observeElement({
        element: targetElement,
        options: {
            root: document.querySelector('[data-cua-custom]'),
            rootMargin: "0px",
            threshold: 0.8
        },
        enter: (target) => {
            target.classList.add('visible-animation');
        },
        leave: (target) => {
            target.classList.remove('visible-animation');
        }
    });
})

