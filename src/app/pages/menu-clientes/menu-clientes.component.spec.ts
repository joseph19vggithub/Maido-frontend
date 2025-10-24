import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuClientesComponent } from './menu-clientes.component';

describe('MenuClientesComponent', () => {
  let component: MenuClientesComponent;
  let fixture: ComponentFixture<MenuClientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuClientesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
