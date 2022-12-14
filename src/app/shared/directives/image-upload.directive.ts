import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[appImageUpload]'
})
export class ImageUploadDirective implements OnChanges {

  @Input('appImageUpload') public image: any;

  constructor(
    private elementRef: ElementRef
  ) { }

  public ngOnChanges(): void {
    const image = this.elementRef.nativeElement;
    if (this.image) {
      image.style.background = '#EBEAEA';
      image.style.display = 'block';
      image.src = this.image;
    }
  }

}
