import { Component, input, output } from '@angular/core';
import { MaterialFormComponent } from '../form/material-form.component';
import { Material } from '../models/material.types';

@Component({
  selector: 'app-material-edit',
  imports: [MaterialFormComponent],
  templateUrl: './material-edit.component.html',
})
export class MaterialEditComponent {
  readonly material = input.required<Material>();
  readonly fechar = output<void>();
  readonly salvo = output<void>();
}
