// src/app/models/mesero.models.ts
export interface MenuItem {
  id: string;
  name: string;
  price: number;
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

export interface OrderLine {
  id: string;      // id del ítem (plato)
  name: string;    // nombre del ítem
  price: number;   // precio unitario
  qty: number;     // cantidad
  notes?: string;  // nota rápida u observación
}

export type MesaState = 'libre' | 'enviado' | 'listo';

// Mapa para saber cuántas mesas tiene cada piso
export type MesasPorPiso = Record<number, number>;
