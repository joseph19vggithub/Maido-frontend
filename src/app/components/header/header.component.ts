import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  menuAbierto = false;
  scrolled = false;

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  @HostListener('window:scroll')
  onScroll() {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    this.scrolled = scrollPosition > 50;

    const header = document.getElementById('mainHeader');
    if (header) {
      header.classList.toggle('scrolled', this.scrolled);
    }
  }

  ngOnInit() {
    this.onScroll();
  }
}
