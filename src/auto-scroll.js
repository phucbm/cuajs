import {viewport} from "./utils";

/**
 * Auto-scroll to the active section
 * @param context
 */
export function initAutoScroll(context){
    if(!context.options.autoScroll) return;

    context.on('onSectionChange', data => {
        // not when vertical mode on
        if(context.orientation === 'vertical') return;

        // not when is scrollTo (via data-cua-to)
        if(context.isScrollTo) return;

        const section = data.section;

        // not scroll on the section that is narrower than viewport
        if(section.offsetWidth < viewport().w) return;

        // stop to use scrollTo "force" as "lock" seems not to work mysteriously
        context.lenis.instance.stop();

        // auto scroll to the target section
        // forward => scroll to the beginning of the section
        // backward => scroll to the end
        const target = data.event.direction > 0 ? section : section.offsetLeft + section.offsetWidth - viewport().w;
        context.lenis.instance.scrollTo(target, {
            lock: true,
            force: true,
            onComplete: () => {
                // let users scroll again when the target section is reached
                context.lenis.instance.start();
            }
        });
    });
}

