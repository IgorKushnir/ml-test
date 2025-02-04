
function enter(element, isMobile) {
    if (isMobile != null) {
        if (!isMobile.value ) return
    }

    element.style.height = 0;
    const height = element.children?.[0].getBoundingClientRect().height;
    requestAnimationFrame((e) => {
        element.style.height = height + 'px';
    });
}

function leave(element, isMobile) {
    if (isMobile != null) {
        if (!isMobile.value ) return
    }
    element.style.height = element.children?.[0].getBoundingClientRect().height + 'px';
    requestAnimationFrame(() => {
        element.style.height = '0px';
    });
}

export { enter, leave};
