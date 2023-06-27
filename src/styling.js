import {setCSS} from "./utils";

export class Styling{
    constructor(context){
        this.context = context;

        this.update(context);
    }

    update(context = this.context){
        if(context.isVerticalMode()){
            setVerticalModeCSS(context);
        }else{
            setHorizontalModeCSS(context);
        }
    }
}

function setHorizontalModeCSS(context){
    // body: avoid elastic scroll on Mac devices
    setCSS(document.body, {overflow: 'hidden'});

    // wrapper
    setCSS(context.wrapper, {
        display: 'flex', /* force into one lines */
        overflow: 'auto', /* allow scrolling */
    });

    // sections
    setCSS(context.sections, {
        height: `calc(100vh - var(--hsp-scrollbar-size))`, /* always full-height */
        maxHeight: ``,
        overflowX: '', /* avoid vertical overflow */
        overflowY: 'hidden', /* avoid vertical overflow */

        /* remove shrink, allow section to extend its width based on the content inside */
        flexShrink: '0',
    });
}


function setVerticalModeCSS(context){
    // body
    setCSS(document.body, {overflow: ''});

    // wrapper
    setCSS(context.wrapper, {
        display: '',
        overflow: '',
    });

    // sections
    setCSS(context.sections, {
        height: '',
        maxHeight: `100%`, /* to allow overflow */
        overflowX: 'hidden',
        overflowY: 'auto',
        flexShrink: '',
    });
}