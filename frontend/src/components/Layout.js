import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useApp } from "../context/AppContext";
import "./layout.css";

export const Navbar = () => {
  const { theme, toggleTheme } = useApp();
  return (
    <nav className="nav">
      <div className="nav-left">
        <Link to="/" className="brand">
          Covasant Control Tower
        </Link>
        <NavLink to="/agents" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          Agents
        </NavLink>
        <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          Dashboard
        </NavLink>
      </div>
      <div className="nav-right">
        <button className="btn" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>
    </nav>
  );
};

export const Container = ({ children }) => (
  <div className="container">{children}</div>
);

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
