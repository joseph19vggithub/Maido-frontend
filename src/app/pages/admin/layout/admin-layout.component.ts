// src/app/layouts/admin-layout.component.ts
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterModule],
  template: `
  <div class="layout admin">
    <aside class="sidebar">
      <div class="brand">
        <div class="avatar">J</div>
        <div>
          <div class="name">Joseph</div>
          <div class="role">Administrador</div>
        </div>
      </div>

      <nav class="nav">
        <a class="item" routerLink="dashboard" routerLinkActive="active">
          <span class="ico" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M3 3h8v8H3V3Zm10 0h8v12h-8V3ZM3 13h8v8H3v-8Z"/></svg>
          </span>
          <span>Dashboard</span>
        </a>

        <div class="section">GESTIÓN</div>

        <a class="item" routerLink="reservas" routerLinkActive="active">
          <span class="ico">
            <svg viewBox="0 0 24 24"><path d="M7 2v2H5a2 2 0 0 0-2 2v2h18V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2Zm14 8H3v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2Z"/></svg>
          </span>
          <span>Reservas</span>
        </a>

        <a class="item" routerLink="mesas" routerLinkActive="active">
          <span class="ico">
            <svg viewBox="0 0 24 24"><path d="M3 10h18v2H3v-2Zm2 4h2v6H5v-6Zm12 0h2v6h-2v-6ZM6 4h12l2 6H4l2-6Z"/></svg>
          </span>
          <span>Mesas</span>
        </a>

        <a class="item" routerLink="reserva-mesa" routerLinkActive="active">
          <span class="ico">
            <svg viewBox="0 0 24 24">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm0 17H5V8h14v12Zm-7-6 5-5-1.41-1.42L12 11.17l-2.59-2.6L8 10l4 4Z"/>
            </svg>
          </span>
          <span>reserva-mesa</span>
        </a>

        <a class="item" routerLink="historial-cliente" routerLinkActive="active">
          <span class="ico">
            <svg viewBox="0 0 24 24">
              <path d="M6 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V3H6Zm9 16H6V5h9v14ZM18 3h-1v18h1a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm-9 4h5v2H9V7Zm0 4h5v2H9v-2Zm0 4h3v2H9v-2Z"/>
            </svg>
          </span>
          <span>historial-cliente</span>
        </a>

        <a class="item" routerLink="experiencias" routerLinkActive="active">
          <span class="ico">
            <svg viewBox="0 0 24 24"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.6 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2Z"/></svg>
          </span>
          <span>Experiencias</span>
        </a>

        <a class="item"
           routerLink="categoria"
           routerLinkActive="active"
           [routerLinkActiveOptions]="{ exact: true }">
          <span class="ico">
            <svg viewBox="0 0 24 24">
              <path d="M3 5a2 2 0 0 1 2-2h6.59a2 2 0 0 1 1.41.59l6.41 6.41a2 2 0 0 1 0 2.83l-5.66 5.66a2 2 0 0 1-2.83 0L4.59 12.41A2 2 0 0 1 4 11V5Zm4 2a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"/>
            </svg>
          </span>
          <span>Categorías</span>
        </a>

        <a class="item" routerLink="pedidos" routerLinkActive="active">
          <span class="ico">
            <svg viewBox="0 0 24 24"><path d="M21 7H7l-1-2H3v2h2l3.6 7.59L7.25 17A2 2 0 0 0 9 20h10v-2H9.42a.25.25 0 0 1-.23-.36L10 16h8a2 2 0 0 0 1.8-1.1L22 9V7Z"/></svg>
          </span>
          <span>Pedidos</span>
        </a>

        <a class="item" routerLink="pedido-detalle" routerLinkActive="active">
          <span class="ico">
            <svg viewBox="0 0 24 24">
              <path d="M6 2 4 4v18l4-2 4 2 4-2 4 2V4l-2-2H6Zm12 18-2-.95-2 .95-2-.95-2 .95V4h8v16ZM8 8h8v2H8V8Zm0 4h8v2H8v-2Z"/>
            </svg>
          </span>
          <span>pedido-detalle</span>
        </a>

        <div class="section">SEGURIDAD</div>

        <a class="item" routerLink="usuarios" routerLinkActive="active">
          <span class="ico">
            <svg viewBox="0 0 24 24"><path d="M16 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-8 1a5 5 0 0 0-5 5v4h10v-4a5 5 0 0 0-5-5Zm8 1a6 6 0 0 1 6 6v3h-6v-3a6 6 0 0 0-2-4.58 6 6 0 0 1 2-1.42Z"/></svg>
          </span>
          <span>Usuarios</span>
        </a>

        <a class="item" routerLink="roles" routerLinkActive="active">
          <span class="ico">
            <svg viewBox="0 0 24 24"><path d="M12 1 9.5 8H2l6 4.5L5.5 20 12 15.5 18.5 20 16 12.5 22 8h-7.5L12 1Z"/></svg>
          </span>
          <span>Roles</span>
        </a>

        <a class="item" routerLink="usuario-rol" routerLinkActive="active">
          <span class="ico">
            <svg viewBox="0 0 24 24">
              <path d="M16 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-1 2h2a5 5 0 0 1 5 5v3h-2v-3a3 3 0 0 0-3-3h-2a3 3 0 0 0-3 3v3h-2v-3a5 5 0 0 1 5-5ZM8 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm1 2H7a5 5 0 0 0-5 5v3h2v-3a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3v3h2v-3a5 5 0 0 0-5-5Z"/>
            </svg>
          </span>
          <span>usuario-rol</span>
        </a>
      </nav>
    </aside>

    <main class="content">
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
  :host{
    /* 🎨 Maido */
    --primary:#C81D25; --primary-dark:#8B0F1A; --accent:#FFB703;
    --bg:#0b0f14; --ink:#0f131a; --panel:#0c1016;
    --line:rgba(255,255,255,.08); --text:#e5e7eb; --muted:#94a3b8;

    --gutter-left: 0px;

    /* compactación sidebar */
    --sec-top:6px; --sec-bottom:2px; --sec-to-first:4px;
    --between-sections:8px; --item-gap:2px;
  }

  /* ===== Layout ===== */
  .layout.admin{
    display:flex;
    min-height:100dvh;
    gap:16px;
    background:var(--bg);
    color:var(--text);
  }

  /* ===== Sidebar ===== */
  .sidebar{
    width:240px;
    background:var(--ink);
    color:#e5e7eb;
    border-right:1px solid var(--line);
    position:sticky;
    top:0;
    height:100dvh;
    overflow-y:auto;
    overscroll-behavior:contain;
    box-shadow: inset 0 10px 30px rgba(0,0,0,.35);
    display:flex;
    flex-direction:column;
    padding:14px 10px 14px;
  }
  .sidebar::-webkit-scrollbar{width:10px;}
  .sidebar::-webkit-scrollbar-thumb{background:rgba(255,255,255,.25);border-radius:10px;}
  .sidebar::-webkit-scrollbar-track{background:rgba(255,255,255,.06);}

  .brand{display:flex;gap:10px;align-items:center;margin-bottom:6px;}
  .avatar{width:38px;height:38px;border-radius:50%;background:#1f2937;display:grid;place-items:center;font-weight:800;}
  .name{font-weight:800;}
  .role{font-size:12px;color:#b6c2d1;}

  .section{
    font-size:12px;
    color:#9fb1c7;
    margin:var(--sec-top) 6px var(--sec-bottom);
    letter-spacing:.2px;
  }
  .section + .item{margin-top:var(--sec-to-first);}
  .item + .section{margin-top:var(--between-sections);}

  .nav{
    display:flex;
    flex-direction:column;
    gap:var(--item-gap);
    flex:1 1 auto;
  }

  .item{
    display:flex;
    align-items:center;
    gap:10px;
    padding:7px 10px;
    border-radius:12px;
    margin:0;
    color:#cbd5e1;
    text-decoration:none;
    transition:background .15s,color .15s,box-shadow .15s,transform .05s;
  }
  .item:hover{background:rgba(148,163,184,.12);color:#fff;}
  .item.active{
    background:linear-gradient(90deg,var(--primary),var(--primary-dark));
    color:#fff;
    box-shadow:0 10px 22px rgba(200,29,37,.35);
  }
  .ico{width:18px;height:18px;display:grid;place-items:center;}
  .ico svg{width:18px;height:18px;fill:currentColor;}

  /* ===== CONTENT CON FONDO MAIDO ===== */
  .content{
    flex:1;
    min-width:0;
    display:flex;
    flex-direction:column;
    padding-right:12px;
    background:url('/assets/img/maido2.jpg') center/cover no-repeat;
    position:relative;
  }

  .content::before{
    content:"";
    position:absolute;
    inset:0;
    background:linear-gradient(
      rgba(0,0,0,0.55),
      rgba(0,0,0,0.65)
    );
    z-index:0;
  }

  .top{
    height:56px;
    display:flex;
    align-items:center;
    padding:0 16px;
    background:transparent;
    border-bottom:1px solid rgba(15,23,42,.7);
    position:relative;
    z-index:2;
  }
  .top h2{
    margin:0;
    font-size:18px;
    font-weight:800;
    color:#fff;
    text-shadow:0 2px 8px rgba(0,0,0,.6);
  }

  .page{
    position:relative;
    z-index:2;
    padding:14px 12px 16px var(--gutter-left);
  }

  /* ===== TARJETAS MAIDO GLASS (GLOBAL) ===== */
  :host ::ng-deep .card{
    position:relative;
    background:rgba(15,18,25,0.78);
    border-radius:18px;
    padding:1.2rem 1.3rem;
    border:1px solid rgba(255,255,255,0.08);
    color:var(--text);
    backdrop-filter:blur(14px);
    -webkit-backdrop-filter:blur(14px);
    box-shadow:
      0 22px 50px rgba(0,0,0,0.55),
      0 6px 14px rgba(0,0,0,0.3);
    overflow:hidden;
    animation:fadeIn .35s ease-out;
  }
  :host ::ng-deep .card::before{
    content:"";
    position:absolute;
    inset:-1px -1px auto -1px;
    height:3px;
    background:linear-gradient(90deg,#C81D25,#E23E36 55%,transparent);
    opacity:0.9;
  }
  :host ::ng-deep .card h3{
    margin:0 0 10px;
    font-size:1.1rem;
    font-weight:700;
    color:#ffffff;
    letter-spacing:.3px;
  }

  /* textos suaves por defecto */
  :host ::ng-deep .card p,
  :host ::ng-deep .card div{
    color:#cbd5e1;
  }

  /* Botones dentro de cards */
  :host ::ng-deep .card .btn{
    display:inline-block;
    border-radius:999px;
    padding:.55rem 1rem;
    border:1px solid rgba(148,163,184,0.35);
    background:rgba(15,23,42,0.72);
    color:#e5e7eb;
    font-weight:600;
    cursor:pointer;
    transition:background .15s,transform .05s,box-shadow .15s;
  }
  :host ::ng-deep .card .btn:hover{
    background:rgba(30,64,175,0.85);
    transform:translateY(-1px);
    box-shadow:0 10px 22px rgba(37,99,235,0.4);
  }
  :host ::ng-deep .card .btn.primary{
    border-color:transparent;
    background:linear-gradient(90deg,#C81D25,#8B0F1A);
    color:#fff;
    box-shadow:0 10px 24px rgba(200,29,37,0.45);
  }
  :host ::ng-deep .card .btn.primary:hover{
    filter:brightness(1.08);
  }

  /* Tablas dentro de cards */
  :host ::ng-deep .card table{
    width:100%;
    border-collapse:collapse;
    margin-top:10px;
    font-size:.93rem;
  }
  :host ::ng-deep .card th{
    text-align:left;
    padding:8px;
    color:#cfd8e3;
    font-weight:700;
    border-bottom:1px dashed rgba(255,255,255,0.08);
    text-transform:none;
  }
  :host ::ng-deep .card td{
    padding:8px;
    color:#e5e7eb;
    border-bottom:1px solid rgba(255,255,255,0.06);
  }
  :host ::ng-deep .card tbody tr:hover td{
    background:rgba(255,255,255,0.06);
  }

  @keyframes fadeIn{
    from{opacity:0;transform:translateY(6px);}
    to{opacity:1;transform:translateY(0);}
  }

  /* Botones e inputs genéricos (fuera o dentro de card) */
  :host ::ng-deep .btn{
    display:inline-block;
    padding:.55rem .95rem;
    border-radius:999px;
    border:1px solid rgba(148,163,184,.35);
    background:rgba(15,23,42,.7);
    color:#e5e7eb;
    font-weight:600;
    cursor:pointer;
    transition:background .15s,transform .05s,box-shadow .15s;
  }
  :host ::ng-deep .btn.primary{
    border-color:transparent;
    background:linear-gradient(90deg,var(--primary),var(--primary-dark));
    box-shadow:0 10px 24px rgba(200,29,37,.45);
  }

  :host ::ng-deep input,
:host ::ng-deep textarea,
:host ::ng-deep select{
  background:rgba(15,23,42,.9);
  color:var(--text);
  border:1px solid rgba(148,163,184,.45);
  border-radius:12px;
  padding:.55rem .7rem;
  outline:none;
  transition:border-color .2s,box-shadow .2s;
}

  :host ::ng-deep input:focus,
  :host ::ng-deep select:focus{
    border-color:var(--primary);
    box-shadow:0 0 0 3px rgba(200,29,37,.3);
  }

  @media (max-width:1024px){
    .layout.admin{gap:12px;}
    .sidebar{width:220px;}
  }
  @media (max-width:820px){
    .sidebar{position:fixed;inset:0 auto 0 0;width:220px;}
    .content{margin-left:220px;}
  }
  @media (max-width:640px){
    .sidebar{width:200px;}
    .content{margin-left:200px;}
    .top{padding:0 12px;}
  }
  `]
})
export class AdminLayoutComponent {}