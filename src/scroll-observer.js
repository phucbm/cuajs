import {ATTRS} from "./configs";

export const initScrollObserver = (context) => {
    // assign scroll observe with default selector
    document.querySelectorAll(`[${ATTRS.scrollObserve}], [data-cua-animate]`).forEach(element => {
        context.assignScrollObserver({element});
    });
};