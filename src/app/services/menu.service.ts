import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private drawerState = false;

  toggleDrawer() {
    this.drawerState = !this.drawerState;
    return this.drawerState;
  }
}
