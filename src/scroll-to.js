import {ATTRS, CLASSES} from "./configs";

export class ScrollTo{
    constructor(context){
        this.context = context;

        if(!context.isSmoothScroll){
            console.warn(`ScrollTo only works with Lenis for now.`);
            return;
        }

        this.init(this.context);
    }

    init(){
        const buttons = document.querySelectorAll(`[${ATTRS.to}]:not(.${CLASSES.scrollToEnabled})`);

        const handleClick = event => {
            const target = event.target.getAttribute(ATTRS.to);
            this.scrollTo(target);
        }

        buttons.forEach(btn => {
            btn.classList.add(CLASSES.scrollToEnabled);

            btn.addEventListener('click', handleClick);
        });
    }


    scrollTo(target, options = {}){
        const context = this.context;


        if(context.isSmoothScroll){
            // has smooth scroll
            const lenis = context.lenis.instance;

            // https://github.com/studio-freight/lenis#instance-methods
            lenis.scrollTo(target, options);
        }

        // no smooth scroll
    }
}