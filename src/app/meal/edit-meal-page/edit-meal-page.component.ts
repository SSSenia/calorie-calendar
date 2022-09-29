import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-edit-meal-page',
  templateUrl: './edit-meal-page.component.html',
  styleUrls: ['./edit-meal-page.component.scss']
})
export class EditMealPageComponent implements OnInit {

  selectedImage: null | string = null;

  classForDrop = '';

  dinnerParams: FormGroup = new FormGroup({
    title: new FormControl('Dinner shit'),
    kcal: new FormControl(1230),
    time: new FormControl('17:50'),
    fats: new FormControl(55),
    proteins: new FormControl(55),
    carbohydrates: new FormControl(55),
    image: new FormControl()
  });

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {

  }

  onSubmit() {
    console.log(this.dinnerParams);
  }

  isFileImage(file: File) {
    const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/svg'];
    return file && acceptedImageTypes.includes(file['type'])
  }

  onFileSelected(event: any) {
    let file = event.target.files[0];
    let reader = new FileReader();
    if (this.isFileImage(file)) {
      reader.onload = (e) => {
        if (e.target && typeof e.target!.result == 'string') {
          this.selectedImage = e.target.result;
        }
      }
      reader.readAsDataURL(file);
    }
  }
}
