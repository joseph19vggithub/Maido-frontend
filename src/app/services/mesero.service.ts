import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MeseroService {

  private mesaSeleccionada: { piso: number; numero: number } | null = null;

  constructor() {}

  setMesaSeleccionada(mesa: { piso: number; numero: number }): void {
    this.mesaSeleccionada = mesa;
  }

  getMesaSeleccionada(): { piso: number; numero: number } | null {
    return this.mesaSeleccionada;
  }
}
