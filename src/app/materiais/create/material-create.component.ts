import { Component, output } from '@angular/core';
import { MaterialFormComponent } from '../form/material-form.component';

@Component({
  selector: 'app-material-create',
  imports: [MaterialFormComponent],
  templateUrl: './material-create.component.html',
})
export class MaterialCreateComponent {
  readonly fechar = output<void>();
  readonly salvo = output<void>();
}
