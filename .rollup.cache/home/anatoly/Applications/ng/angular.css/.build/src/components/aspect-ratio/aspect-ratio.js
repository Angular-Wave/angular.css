export function aspectRatioDirective() {
    return {
        link(_scope, element) {
            const authoredRatio = element.getAttribute("ratio") ??
                element.getAttribute("data-ratio") ??
                element.style.getPropertyValue("--ratio");
            const ratio = authoredRatio === "" ? "16 / 9" : authoredRatio;
            element.style.setProperty("--ratio", ratio);
            element.setAttribute("data-ratio", ratio);
        },
    };
}
