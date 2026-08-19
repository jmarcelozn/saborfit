import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@/app/config/routes";
import "@/styles/pages/error.css";

export default function ErrorPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state || {};
  const status = state.status || 404;
  const message = state.message || (status === 404 ? "A página que você procura não foi encontrada." : "Ocorreu um erro no servidor.");
  const details = state.details || null;

  return (
    <>
      <div className="error-page">
        <div className="error-card">
          <div className="error-status">{status}</div>
          <h1 className="error-title">{status === 404 ? "Página não encontrada" : "Erro"}</h1>
          <p className="error-message">{message}</p>
          {details && <pre className="error-details">{JSON.stringify(details, null, 2)}</pre>}

          <div className="error-actions">

          </div>
        </div>
      </div>
    </>
  );
}
