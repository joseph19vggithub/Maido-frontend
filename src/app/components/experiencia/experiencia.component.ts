import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Experiencia } from '../../models/experiencia.model';

@Component({
  selector: 'app-experiencia',
  standalone: true,
  imports: [CommonModule, RouterModule], // ✅ agregado
  templateUrl: './experiencia.component.html',
  styleUrls: ['./experiencia.component.scss']
})
export class ExperienciaComponent {
  @Input() experiencia!: Experiencia;
}
