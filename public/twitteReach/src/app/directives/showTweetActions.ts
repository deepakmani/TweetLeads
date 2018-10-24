import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[showTweetActions]'
})
export class ShowTweetActionsDirective {
    @Input() tweet;

    constructor(private el: ElementRef) { }

    @HostListener('mouseenter') onMouseEnter() {
      this.tweet.show_tweet_actions = true;
    }

    @HostListener('mouseleave') onMouseLeave() {
      this.tweet.show_tweet_actions = false;
    }

}