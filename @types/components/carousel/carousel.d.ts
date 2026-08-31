import { type EmblaCarouselType } from "embla-carousel";
export interface CarouselChangeDetail {
    api: EmblaCarouselType;
    count: number;
    index: number;
    item: HTMLElement | null;
    itemCount: number;
    itemIndex: number;
}
export declare function carouselDirective(): ng.Directive;
