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
document.querySelector('[data-description]').innerHTML = packageInfo.description;


CuaJsData.on('onScroll', (data) => {
    console.log(data.activeIndex, data.progress)
});