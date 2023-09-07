import {ATTRS, CLASSES} from "./configs";

export class ScrollTo{
    constructor(context){
        this.context = context;
        this.context.isScrollTo = false;

        if(!context.isSmoothScroll){
            console.warn(`ScrollTo only works with Lenis for now.`);
            return;
        }

        this.init(this.context);
    }

    init(context){
        const buttons = document.querySelectorAll(`[${ATTRS.to}]:not(.${CLASSES.scrollToEnabled})`);

        const handleClick = event => {
            if(context.options.scrollToClickPreventDefault) event.preventDefault();

            const target = event.target.getAttribute(ATTRS.to);
            this.scrollTo(target, {
                lock: true,
                onComplete: () => {
                    this.context.isScrollTo = false;

                    this.context.events.fire('onScrollToComplete', {target, triggerEl: event.target});
                }
            });

            this.context.events.fire('onScrollToClick', {target, triggerEl: event.target});
        }

        buttons.forEach(btn => {
            btn.classList.add(CLASSES.scrollToEnabled);

            btn.addEventListener('click', handleClick);
        });
    }


    scrollTo(target, options = {}){
        const context = this.context;

        if(context.isSmoothScroll){
            this.context.isScrollTo = true;

            // has smooth scroll
            const lenis = context.lenis.instance;

            // https://github.com/studio-freight/lenis#instance-methods
            lenis.scrollTo(target, options);
        }

        // no smooth scroll
    }
}