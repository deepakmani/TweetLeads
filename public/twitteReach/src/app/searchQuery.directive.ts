import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[highlightSearchQuery]'
})
export class SearchQueryDirective {
     constructor(private el: ElementRef) { }

    @HostListener('mouseenter') onMouseEnter() {
      this.highlight('#FAFDAD', "#555");
    }

    @HostListener('mouseleave') onMouseLeave() {
      this.highlight("#A252", "#FFF");
    }

    @HostListener('click') onClick() {
      this.highlight('#FAFDAD', "#555");
    }

    private highlight(bgcolor: string, color: string) {
      this.el.nativeElement.style.backgroundColor = bgcolor;
      //this.el.nativeElement.style.color = color;
    }
}