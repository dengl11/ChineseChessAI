import {ElementRef, Directive, EventEmitter, HostListener} from '@angular/core';


@Directive({
  selector: '[draggable]'
})
export class Draggable {
  mousedrag;
  mouseup   = new EventEmitter();
  mousedown = new EventEmitter();
  mousemove = new EventEmitter();

  @HostListener('mouseup', ['$event'])
  onMouseup(event) { this.mouseup.next(event); }

  @HostListener('mousedown', ['$event'])
  onMousedown(event) { this.mousedown.next(event); }

  @HostListener('mousemove', ['$event'])
  onMousemove(event) { this.mousemove.next(event); }

  constructor(public element: ElementRef) {
    this.element.nativeElement.style.position = 'relative';
    this.element.nativeElement.style.cursor = 'pointer';

    this.mousedrag = this.mousedown.subscribe(event => {
        event.preventDefault();
        return {
          left: event.clientX - this.element.nativeElement.getBoundingClientRect().left,
          top:  event.clientY - this.element.nativeElement.getBoundingClientRect().top
        };
      })
    //   .flatMap(imageOffset => this.mousemove.subscribe(pos => ({
    //     top:  pos.clientY - imageOffset.top,
    //     left: pos.clientX - imageOffset.left
    //   }))
    //   .takeUntil(this.mouseup.subscribe()));

  }


  onInit() {
    this.mousedrag.subscribe({
      next: pos => {
        // Update position
        this.element.nativeElement.style.top  = pos.top  + 'px';
        this.element.nativeElement.style.left = pos.left + 'px';
      }
    });
  }

}
