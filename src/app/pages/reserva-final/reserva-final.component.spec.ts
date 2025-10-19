import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservaFinalComponent } from './reserva-final.component';

describe('ReservaFinalComponent', () => {
  let component: ReservaFinalComponent;
  let fixture: ComponentFixture<ReservaFinalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservaFinalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservaFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
