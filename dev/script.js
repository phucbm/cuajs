// public styles
import '@viivue/atomic-css';
import 'honcau';

// dev style
import './style.scss';

// source script
import '@/_index';
import {ATTRS} from "@/configs";

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
    wrapper: document.querySelector('#my-horizontal-scroll'),
    onScrollableContent: (data) => {
        //console.log(data)
    },
    autoScroll: true,
});

document.querySelectorAll(`.btn-group button, .sample-grid > div`).forEach(element => {
    instance.assignScrollObserver({element});
});