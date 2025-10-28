import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservaService } from '../../../services/reserva.service';

function toISO(d: Date){ return d.toISOString(); }

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservas.component.html'
})
export class ReservasComponent {
  data: any[] = [];
  cargando = false;

  constructor(private svc: ReservaService){ this.hoy(); }

  private fetch(from?: string, to?: string) {
    this.cargando = true;
    // Si tu service ya acepta rango, usa svc.list({from,to}); si no, getAll()
    const obs = (this.svc as any).list
      ? (this.svc as any).list({ from, to })
      : this.svc.getAll();

    obs.subscribe((r: any[]) => { this.data = r || []; this.cargando = false; });
  }

  hoy(){ const d=new Date(); this.fetch(toISO(new Date(d.setHours(0,0,0,0))), toISO(new Date(d.setHours(23,59,59,999)))); }
  ayer(){ const d=new Date(); d.setDate(d.getDate()-1); this.fetch(toISO(new Date(d.setHours(0,0,0,0))), toISO(new Date(d.setHours(23,59,59,999)))); }
  semana(){ const d=new Date(); const from=new Date(d); from.setDate(d.getDate()-d.getDay()); this.fetch(toISO(new Date(from.setHours(0,0,0,0))), toISO(new Date(d.setHours(23,59,59,999)))); }
}
