import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appBurgerMenu]'
})
export class BurgerMenuDirective {
  @HostListener('click') toggleDrawer() {
    // Aquí usarías el servicio para abrir o cerrar el menú
    console.log("Menú móvil toggle");
  }
}
