import {ATTR, CLASS} from "./constant";

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
        const buttons = document.querySelectorAll(`[${ATTR.to}]:not(.${CLASS.scrollToEnabled})`);

        const handleClick = event => {
            const target = event.target.getAttribute(ATTR.to);
            this.scrollTo(target);
        }

        buttons.forEach(btn => {
            btn.classList.add(CLASS.scrollToEnabled);

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