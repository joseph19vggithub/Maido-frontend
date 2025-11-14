import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ReservaMesaService } from '../../../services/reserva-mesa.service';
import { ReservaMesa } from '../../../models/reserva-mesa.model';

@Component({
  selector: 'app-reserva-mesa',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reserva-mesa.component.html',
  styleUrls: ['./reserva-mesa.component.scss']
})
export class ReservaMesaComponent implements OnInit {

  private fb = inject(FormBuilder);
  private srv = inject(ReservaMesaService);

  reservaMesas: ReservaMesa[] = [];
  isEditing = false;

  form: FormGroup = this.fb.group({
    id: [0],
    idReserva: [null, Validators.required],
    idMesa: [null, Validators.required]
  });

  ngOnInit(): void {
    this.cargarReservaMesa();
  }

  cargarReservaMesa(): void {
    this.srv.getAll().subscribe((data: ReservaMesa[]) => {
      this.reservaMesas = data;
      console.log('ReservaMesa:', data);
    });
  }

  seleccionar(r: ReservaMesa): void {
    this.form.patchValue({
      id: r.id,
      idReserva: r.reserva?.id ?? r.idReserva ?? null,
      idMesa: r.mesa?.id ?? r.idMesa ?? null
    });
    this.isEditing = true;
  }

  registrar(): void {
    if (this.form.invalid) return;

    const { idReserva, idMesa } = this.form.getRawValue() as ReservaMesa;
    const payload: ReservaMesa = {
      id: 0,
      idReserva: Number(idReserva),
      idMesa: Number(idMesa)
    };

    this.srv.create(payload).subscribe(() => {
      this.cargarReservaMesa();
      this.limpiar();
    });
  }

  actualizar(): void {
    if (this.form.invalid) return;

    const { id, idReserva, idMesa } = this.form.getRawValue() as ReservaMesa;
    const payload: ReservaMesa = {
      id: Number(id),
      idReserva: Number(idReserva),
      idMesa: Number(idMesa)
    };

    this.srv.update(payload.id, payload).subscribe(() => {
      this.cargarReservaMesa();
      this.limpiar();
    });
  }

  eliminar(): void {
    const id = Number(this.form.get('id')?.value);
    if (!id) return;

    this.srv.delete(id).subscribe(() => {
      this.cargarReservaMesa();
      this.limpiar();
    });
  }

  limpiar(): void {
    this.form.reset({
      id: 0,
      idReserva: null,
      idMesa: null
    });
    this.isEditing = false;
  }

}
