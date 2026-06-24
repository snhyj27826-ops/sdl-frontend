import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[appAtmosphericCard]',
  standalone: true,
  host: {
    '(mousemove)': 'onMouseMove($event)',
  },
})
export class AtmosphericCardDirective {
  // Inject ElementRef using Angular's modern inject() function
  private readonly el = inject(ElementRef<HTMLElement>);

  protected onMouseMove(event: MouseEvent): void {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Safely set CSS variables scoped strictly to this element
    this.el.nativeElement.style.setProperty('--mouse-x', `${x}px`);
    this.el.nativeElement.style.setProperty('--mouse-y', `${y}px`);
  }
}
