import { Component } from '@angular/core';
import { MyButton, MyInput } from '@my/components';

@Component({
  selector: 'root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [MyButton, MyInput],
})
export class AppComponent {}
