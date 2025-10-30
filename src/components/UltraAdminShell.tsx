"use client";
import { useState } from "react";
import Protected from "@/lib/Protected";

/**
 * Contenedor con la estructura del tema Ultra Admin (topbar + sidebar + main-content).
 * Replica las clases esperadas por style.css para que el diseño coincida con la referencia.
 */
export default function UltraAdminShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Protected>
      <div className={"page-container row-fluid"}>
        {/* TOPBAR */}
        <div className={"page-topbar" + (collapsed ? " sidebar_shift" : "")}>
          <div className="logo-area">
            {/* Puedes reemplazar por tu logo */}
          </div>
          <div className="quick-area">
            <div className="pull-left">
              <ul className="info-menu left-links list-inline list-unstyled">
                <li className="sidebar-toggle-wrap">
                  <a href="#" className="sidebar_toggle" onClick={(e) => { e.preventDefault(); setCollapsed(!collapsed); }}>
                    <i className="fa fa-bars" />
                  </a>
                </li>
              </ul>
            </div>
            <div className="pull-right">
              <ul className="info-menu right-links list-inline list-unstyled">
                <li className="profile">
                  <a href="#" className="toggle">
                    <img src="/assets/images/user.png" alt="user" className="img-circle img-inline" />
                    <span>Admin <i className="fa fa-angle-down" /></span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className={"page-sidebar" + (collapsed ? " collapseit" : " expandit")}>
          <div className="page-sidebar-wrapper" id="main-menu-wrapper">
            <div className="profile-info row">
              <div className="profile-image col-md-4 col-sm-4 col-xs-4">
                <img src="/assets/images/user-small.png" className="img-responsive img-circle" alt="perfil" />
              </div>
              <div className="profile-details col-md-8 col-sm-8 col-xs-8">
                <h3>
                  <a href="#">Industrias SP</a>
                  <span className="profile-status online" />
                </h3>
                <p className="profile-title">Administrador</p>
              </div>
            </div>

            <ul className="wraplist">
              <li>
                <a href="/">
                  <i className="fa fa-dashboard" />
                  <span className="title">Dashboard</span>
                </a>
              </li>
              <li>
                <a href="/productos">
                  <i className="fa fa-cubes" />
                  <span className="title">Productos</span>
                </a>
              </li>
              <li>
                <a href="/usuarios">
                  <i className="fa fa-users" />
                  <span className="title">Usuarios</span>
                </a>
              </li>
              <li>
                <a href="/cotizaciones">
                  <i className="fa fa-file-text" />
                  <span className="title">Cotizaciones</span>
                </a>
              </li>
              <li>
                <a href="/pedidos">
                  <i className="fa fa-shopping-cart" />
                  <span className="title">Pedidos</span>
                </a>
              </li>
            </ul>
          </div>

          {/* barra inferior fija con info (opcional) */}
          <div className="project-info">
            <div className="block1">
              <div className="data">
                <span className="title">New Orders</span>
                <span className="total">2,345</span>
              </div>
              <div className="graph"><span className="sidebar_orders">...</span></div>
            </div>
            <div className="block2">
              <div className="data">
                <span className="title">Visitors</span>
                <span className="total">345</span>
              </div>
              <div className="graph"><span className="sidebar_visitors">...</span></div>
            </div>
          </div>
        </div>

        {/* CONTENIDO */}
        <section id="main-content" className={collapsed ? "sidebar_shift" : ""}>
          <section className="wrapper main-wrapper">
            {children}
          </section>
        </section>
      </div>
    </Protected>
  );
}

