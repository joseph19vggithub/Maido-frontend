import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mitsuharu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mitsuharu.component.html',
  styleUrls: ['./mitsuharu.component.scss']
})
export class MitsuharuComponent implements AfterViewInit {
  ngAfterViewInit() {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.2 }
    );

    document
      .querySelectorAll('.mitsuharu .cols > *, .mitsuharu .photo')
      .forEach(el => observer.observe(el));
  }
}
