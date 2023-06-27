// public styles
import '@viivue/atomic-css';
import 'honcau';

// core style
import '@/_style.scss';

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
document.title = `[DEV] ${title} - ${packageInfo.description}`;
document.querySelector('[data-title]').innerHTML = title;
document.querySelector('[data-description]').innerHTML = packageInfo.description;

/**
 * Lib usage
 */
document.querySelectorAll("[data-cn]").forEach(wrapper => {
    EHS.init({wrapper});
});