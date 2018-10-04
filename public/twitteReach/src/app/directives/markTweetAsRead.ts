import { Directive, ElementRef, Output, EventEmitter, Renderer, HostListener, Input, OnInit } from '@angular/core';

@Directive({
    selector: '[markTweetAsRead]'
})
export class MarkTweetAsReadDirective {
    @Output() markTweetAsRead: EventEmitter<string> = new EventEmitter<string>();

    @Input() status_id: string;
    constructor(private el: ElementRef,  private renderer: Renderer) {
    }

   @HostListener('mouseover') onMouseOver() {
		
   		// 1. Highlight tweet with active color on read
   		let tweet_body = this.el.nativeElement.parentNode.parentNode;
	    this.renderer.setElementStyle(tweet_body, 'background', '#A252');
	 	//this.renderer.setElementStyle()	
	 	// Send output
	 	this.markTweetAsRead.emit(this.status_id);
	}

	 @HostListener('mouseoout') onMouseOut() {
		
   		// 1. Highlight tweet with active color on read
   		let tweet_body = this.el.nativeElement.parentNode.parentNod;
	    this.renderer.setElementStyle(tweet_body, 'background', '#F2F2F2');
	 
	}

}