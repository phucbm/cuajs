import {getTheMostVisible} from "./utils";

export function initAutoScroll(context){
    if(!context.options.autoScroll) return;


    context.on('scroll', data => {
        const v = getTheMostVisible(context.sections, 0, true);

        if(context.activeSectionIndex === v.index) return;

        context.lenis.instance.scrollTo(v.el, {lock: true});
        console.log(v)

        context.activeSectionIndex = v.index;
    });
}

