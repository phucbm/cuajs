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

/**
 * GitHub star count (keeps "Star" if the API fails or is rate-limited)
 */
fetch('https://api.github.com/repos/phucbm/cuajs')
    .then(res => res.ok ? res.json() : Promise.reject(res.status))
    .then(({stargazers_count}) => {
        document.querySelector('[data-github-stars]').textContent =
            new Intl.NumberFormat('en', {notation: 'compact'}).format(stargazers_count);
    })
    .catch(() => {});
