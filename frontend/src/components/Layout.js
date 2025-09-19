import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useApp } from "../context/AppContext";
import "./layout.css";

/**
 * Sidebar layout container with persistent navigation on the left
 * and a scrollable main content area on the right.
 */
export const SidebarLayout = ({ children }) => {
  const { theme, toggleTheme } = useApp();
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <Link to="/" className="brand">
            Covasant Control Tower
          </Link>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "side-link active" : "side-link")}>
            <span className="icon">📊</span> Dashboard
          </NavLink>
          <NavLink to="/agents" className={({ isActive }) => (isActive ? "side-link active" : "side-link")}>
            <span className="icon">🤖</span> Agents
          </NavLink>
          <NavLink to="/agents/example/logs" className={({ isActive }) => (isActive ? "side-link active" : "side-link")}>
            <span className="icon">📜</span> Logs
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => (isActive ? "side-link active" : "side-link")}>
            <span className="icon">⚙️</span> Settings
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <button className="btn btn-secondary w-full" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "light" ? "🌙 Dark mode" : "☀️ Light mode"}
          </button>
        </div>
      </aside>
      <main className="main">{children}</main>
    </div>
  );
};

export const Container = ({ children }) => <div className="container">{children}</div>;

export const Card = ({ title, subtitle, footer, children, right }) => (
  <div className="card">
    <div className="card-header">
      <div>
        {title && <h3 className="card-title">{title}</h3>}
        {subtitle && <p className="card-subtitle">{subtitle}</p>}
      </div>
      {right && <div className="card-actions">{right}</div>}
    </div>
    <div className="card-body">{children}</div>
    {footer && <div className="card-footer">{footer}</div>}
  </div>
);

export const Button = ({ variant = "primary", className = "", ...props }) => {
  const cls = `btn ${variant === "secondary" ? "btn-secondary" : "btn-primary"} ${className}`;
  return <button className={cls} {...props} />;
};

export const Badge = ({ color = "default", children }) => {
  const cls = `badge badge-${color}`;
  return <span className={cls}>{children}</span>;
};

export const Loader = ({ text = "Loading..." }) => (
  <div className="loader">
    <div className="spinner" />
    <div className="loader-text">{text}</div>
  </div>
);

export const EmptyState = ({ title = "Nothing here", description = "No records found.", action }) => (
  <div className="empty">
    <h4>{title}</h4>
    <p>{description}</p>
    {action}
  </div>
);
