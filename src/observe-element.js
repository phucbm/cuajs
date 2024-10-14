import {ATTRS, CLASSES} from "@/configs";

export const initObserveElement = (context) => {
    if(!context.options.scrollObserver) return [];

    document.querySelectorAll(`[${ATTRS.horizontalScrollObserver}]`).forEach(targetElement => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if(entry.isIntersecting){
                    console.log("enter", entry.target, context.isVerticalMode());
                    entry.target.classList.add(CLASSES.isVisible);
                }else{
                    if(context.options.once) return;
                    console.log("leave", entry.target, context.isVerticalMode());
                    entry.target.classList.remove(CLASSES.isVisible);
                }
            });
        }, {
            root: context.isVerticalMode() ? null : context.wrapper,
            rootMargin: "0px",
            threshold: 0.1
        });

        observer.observe(targetElement);
    });
};