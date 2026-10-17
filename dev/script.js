// source script
import '@/_index';
import '@/_style.scss';

// dev style
import './style.css';

// code highlight (shiki + prettier) is heavy => load it in a separate chunk once the page is idle
const loadCodeHighlight = () => import('./code-highlight').then(({initShiki}) => initShiki());
window.addEventListener('load', () => {
    if('requestIdleCallback' in window) requestIdleCallback(loadCodeHighlight, {timeout: 2000});
    else setTimeout(loadCodeHighlight, 200);
});

// import package info
const packageInfo = require('../package.json');

/**
 * Update HTML
 */
// update title
const title = `${packageInfo.prettyName} v${packageInfo.version}`;
document.title = `${title} - ${packageInfo.description}`;
document.querySelector('[data-title]').innerHTML = title;