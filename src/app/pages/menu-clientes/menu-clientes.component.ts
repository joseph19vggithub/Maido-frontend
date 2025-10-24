import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface MenuItem {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  imagen: string;
}

@Component({
  selector: 'app-menu-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './menu-clientes.component.html',
  styleUrls: ['./menu-clientes.component.scss']
})
export class MenuClientesComponent {
  // 🔹 Lista de categorías con opción "Todos"
  categorias = ['Todos', 'Nigiri', 'Tiraditos', 'Rolls', 'Calientes', 'Postres', 'Bebidas'];
  catSel = 'Todos';
  q = '';

  // 🔹 Menú digital
  menu: MenuItem[] = [
    {
      id: 1,
      nombre: 'Nigiri de Salmón',
      descripcion: 'Salmón fresco con arroz sazonado y toques de soya dulce.',
      precio: 32,
      categoria: 'Nigiri',
      imagen: 'assets/img/platos/nigiri-salmon.jpg'
    },
    {
      id: 2,
      nombre: 'Tiradito Nikkei',
      descripcion: 'Pescado blanco en salsa nikkei con ají amarillo.',
      precio: 38,
      categoria: 'Tiraditos',
      imagen: 'assets/img/platos/tiradito.jpg'
    },
    {
      id: 3,
      nombre: 'Roll Acevichado',
      descripcion: 'Langostino furai con topping acevichado.',
      precio: 42,
      categoria: 'Rolls',
      imagen: 'assets/img/platos/roll-acevichado.jpg'
    },
    {
      id: 4,
      nombre: 'Yakimeshi',
      descripcion: 'Arroz salteado al estilo japonés con verduras y pollo.',
      precio: 28,
      categoria: 'Calientes',
      imagen: 'assets/img/platos/yakimeshi.jpg'
    },
    {
      id: 5,
      nombre: 'Tempura de Helado',
      descripcion: 'Helado frito con cubierta crocante y miel.',
      precio: 22,
      categoria: 'Postres',
      imagen: 'assets/img/platos/tempura-helado.jpg'
    },
  ];

  // 🔍 Filtro dinámico con búsqueda y categoría
  menuFiltrado = computed(() =>
    this.menu.filter(it =>
      (this.catSel === 'Todos' || it.categoria === this.catSel) &&
      (this.q.trim() === '' || it.nombre.toLowerCase().includes(this.q.toLowerCase()))
    )
  );

  setCategoria(c: string) {
    this.catSel = c;
  }

  // 🔧 Si alguna imagen falla, muestra una por defecto
  imagenFallback(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/img/platos/placeholder.jpg';
  }
}
