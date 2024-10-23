import {codeToHtml} from 'shiki';
import prettier from 'prettier/standalone';
import parserBabel from 'prettier/plugins/babel';
import parserHtml from 'prettier/plugins/html';
import parserPostcss from 'prettier/plugins/postcss';

const formatCode = async(code, lang) => {
    // Configure parser based on language
    const parserConfig = {
        html: {
            parser: 'html',
            plugins: [parserHtml],
            htmlWhitespaceSensitivity: 'css',
            printWidth: 80,
            tabWidth: 2,
        },
        css: {
            parser: 'css',
            plugins: [parserPostcss],
            printWidth: 80,
            tabWidth: 2,
        },
        javascript: {
            parser: 'babel',
            plugins: [parserBabel],
            semi: true,
            singleQuote: true,
            printWidth: 80,
            tabWidth: 2,
        }
    };

    try{
        if(!parserConfig[lang]){
            return code; // Return original code if language not supported
        }

        return prettier.format(code, parserConfig[lang]);
    }catch(error){
        console.warn('Prettier formatting failed:', error);
        return code; // Return original code if formatting fails
    }
};

const initShiki = async() => {
    // Find all div elements with data-shiki attribute
    const codeContainers = document.querySelectorAll('codeblock');

    for(const container of codeContainers){
        try{
            // Get the language from data-shiki attribute
            const lang = container.getAttribute('lang');

            // Get the raw HTML code inside the div
            // trim() to remove extra whitespace
            const code = container.innerHTML.trim();

            // Format the code before highlighting
            const formattedCode = await formatCode(code, lang);

            // Generate highlighted HTML
            const highlightedHtml = await codeToHtml(formattedCode, {
                lang,
                theme: 'vitesse-dark'
            });

            // Create temporary container to parse HTML string into DOM
            const temp = document.createElement('div');
            temp.innerHTML = highlightedHtml;
            const highlightedBlock = temp.firstChild;

            // Add necessary classes
            highlightedBlock.classList.add('relative', 'group');

            // Create copy button
            const copyButton = document.createElement('button');
            copyButton.className = 'copy-button absolute right-2 top-2 opacity-0 group-hover:opacity-100 ' +
                'bg-gray-700 hover:bg-gray-600 text-white rounded px-2 py-1 text-sm';
            copyButton.textContent = 'Copy';

            // Add click handler
            copyButton.addEventListener('click', function(){
                const codeText = highlightedBlock.querySelector('code').textContent;

                navigator.clipboard.writeText(codeText).then(() => {
                    const originalText = this.textContent;
                    this.textContent = 'Copied!';

                    setTimeout(() => {
                        this.textContent = originalText;
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy:', err);
                    this.textContent = 'Error!';
                });
            });

            // Add button to highlighted block
            highlightedBlock.appendChild(copyButton);

            // Replace the original div with highlighted code
            container.replaceWith(highlightedBlock);

        }catch(error){
            console.error('Error highlighting code block:', error);
        }
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', initShiki);

export {initShiki};