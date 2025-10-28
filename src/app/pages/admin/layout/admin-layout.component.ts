import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterModule],
  template: `
  <div class="wrap">
    <aside class="side">
      <div class="brand">
        <div class="avatar">J</div>
        <div>
          <div class="name">Joseph</div>
          <div class="role">Administrador</div>
        </div>
      </div>

      <a class="item" routerLink="dashboard" routerLinkActive="active">
        <span class="ico" aria-hidden="true">
          <!-- squares (dashboard) -->
          <svg viewBox="0 0 24 24"><path d="M3 3h8v8H3V3Zm10 0h8v12h-8V3ZM3 13h8v8H3v-8Zm10 14"/></svg>
        </span>
        <span>Dashboard</span>
      </a>

      <div class="section">GESTIÓN</div>

      <a class="item" routerLink="clientes" routerLinkActive="active">
        <span class="ico"><svg viewBox="0 0 24 24"><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-5 0-9 2.5-9 5.5V22h18v-2.5C21 16.5 17 14 12 14Z"/></svg></span>
        <span>Clientes</span>
      </a>
      <a class="item" routerLink="reservas" routerLinkActive="active">
        <span class="ico"><svg viewBox="0 0 24 24"><path d="M7 2v2H5a2 2 0 0 0-2 2v2h18V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2Zm14 8H3v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2Z"/></svg></span>
        <span>Reservas</span>
      </a>
      <a class="item" routerLink="mesas" routerLinkActive="active">
        <span class="ico"><svg viewBox="0 0 24 24"><path d="M3 10h18v2H3v-2Zm2 4h2v6H5v-6Zm12 0h2v6h-2v-6ZM6 4h12l2 6H4l2-6Z"/></svg></span>
        <span>Mesas</span>
      </a>
      <a class="item" routerLink="experiencias" routerLinkActive="active">
        <span class="ico"><svg viewBox="0 0 24 24"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.6 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2Z"/></svg></span>
        <span>Experiencias</span>
      </a>
      <a class="item" routerLink="pedidos" routerLinkActive="active">
        <span class="ico"><svg viewBox="0 0 24 24"><path d="M21 7H7l-1-2H3v2h2l3.6 7.59L7.25 17A2 2 0 0 0 9 20h10v-2H9.42a.25.25 0 0 1-.23-.36L10 16h8a2 2 0 0 0 1.8-1.1L22 9V7Z"/></svg></span>
        <span>Pedidos</span>
      </a>

      <div class="section">SEGURIDAD</div>

      <a class="item" routerLink="usuarios" routerLinkActive="active">
        <span class="ico"><svg viewBox="0 0 24 24"><path d="M16 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-8 1a5 5 0 0 0-5 5v4h10v-4a5 5 0 0 0-5-5Zm8 1a6 6 0 0 1 6 6v3h-6v-3a6 6 0 0 0-2-4.58 6 6 0 0 1 2-1.42Z"/></svg></span>
        <span>Usuarios</span>
      </a>
      <a class="item" routerLink="roles" routerLinkActive="active">
        <span class="ico"><svg viewBox="0 0 24 24"><path d="M12 1 9.5 8H2l6 4.5L5.5 20 12 15.5 18.5 20 16 12.5 22 8h-7.5L12 1Z"/></svg></span>
        <span>Roles</span>
      </a>
    </aside>

    <main class="main">
      <header class="top">
        <h2>Panel</h2>
      </header>
      <section class="page">
        <router-outlet></router-outlet>
      </section>
    </main>
  </div>
  `,
  styles: [`
  :host {
    --bg:#f3f5f7;
    --card:#0f1115;
    --stroke:#e7e9ee;
    --side:#0f172a;
    --muted:#94a3b8;
    --primary:#2563eb;

    /* 🔹 Ajustes finos de espaciado */
    --pad-side-top:0px;       /* padding superior del sidebar */
    --gap-brand:0px;          /* espacio entre usuario y Dashboard */
    --sec-top:0px;            /* Dashboard ↔ GESTIÓN */
    --sec-to-first:0px;       /* GESTIÓN ↔ primer ítem */
    --last-to-nextsec:0px;    /* Pedidos ↔ SEGURIDAD */
    --item-gap:0px;           /* separación entre ítems */
    --gutter-left:0px;
  }

  /* ===== LAYOUT ===== */
  .wrap {
    display: flex;
    min-height: 100vh;
    background: var(--bg);
    font-family: system-ui, Segoe UI, Roboto, Arial;
    gap: 0;
  }

  .side {
    width: 210px;
    background: var(--side);
    color: #e5e7eb;
    padding: var(--pad-side-top) 6px 12px 8px;
    position: sticky;
    top: 0;
    height: 100vh;
    border-right: 1px solid #0b1220;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  .main {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .top {
    height: 56px;
    background: #fff;
    border-bottom: 1px solid var(--stroke);
    display: flex;
    align-items: center;
    padding: 0 12px 0 var(--gutter-left);
  }

  .top h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 800;
    color: #0b1220;
  }

  .page {
    padding: 12px 12px 16px var(--gutter-left);
  }

  /* ===== SIDEBAR (diseño compacto y limpio) ===== */
  .brand {
    display: flex;
    gap: 8px;
    align-items: center;
    margin: 2px 2px var(--gap-brand);
  }

  .avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #1f2937;
    display: grid;
    place-items: center;
    font-weight: 800;
  }

  .name { font-weight: 800; }
  .role { font-size: 12px; color: #b6c2d1; }

  .section {
    font-size: 12px;
    color: #9fb1c7;
    margin: var(--sec-top) 6px 4px;
    line-height: 1;
    letter-spacing: .2px;
  }

  /* 🔹 GESTIÓN → primer ítem */
  .section + .item {
    margin-top: var(--sec-to-first);
  }

  /* 🔹 Último ítem (Pedidos) → siguiente sección (SEGURIDAD) */
  .item + .section {
    margin-top: var(--last-to-nextsec);
  }

  /* 🔹 Estilo de cada ítem */
  .item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 10px;
    margin: var(--item-gap) 2px;
    border-radius: 10px;
    color: #e5e7eb;
    text-decoration: none;
    transition: background 0.2s;
  }

  .item:hover {
    background: #111827;
  }

  .item.active {
    background: var(--primary);
    color: #fff;
  }

  .ico {
    width: 16px;
    height: 16px;
    display: grid;
    place-items: center;
  }

  .ico svg {
    width: 16px;
    height: 16px;
    fill: currentColor;
  }

  /* ===== TARJETAS / CONTENIDO ===== */
  .card {
    background: #121418;
    border: 1px solid #1a1d23;
    border-radius: 16px;
    padding: 16px;
    box-shadow: 0 10px 24px rgba(0, 0, 0, .18), 0 2px 6px rgba(0, 0, 0, .12);
    color: #e5e7eb;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
    color: #e5e7eb;
  }

  th, td {
    padding: 10px;
    border-bottom: 1px solid #1a1d23;
    text-align: left;
  }

  th {
    font-weight: 700;
    color: #fff;
  }

  .actions {
    display: flex;
    gap: 6px;
  }

  .btn {
    border: 1px solid #1a1d23;
    background: #0f1115;
    padding: 6px 10px;
    border-radius: 999px;
    cursor: pointer;
    color: #e5e7eb;
  }

  .btn:hover {
    background: #171a20;
  }

  .btn.primary {
    background: var(--primary);
    border-color: var(--primary);
    color: #fff;
  }

  input[type="text"], input[type="date"] {
    border: 1px solid #1a1d23;
    background: #0f1115;
    color: #e5e7eb;
    border-radius: 10px;
    padding: 7px 10px;
    outline: none;
  }

  /* ===== RESETEO GLOBAL ===== */
  :host, :host ::ng-deep html, :host ::ng-deep body {
    margin: 0 !important;
  }
`]


})
export class AdminLayoutComponent {}
