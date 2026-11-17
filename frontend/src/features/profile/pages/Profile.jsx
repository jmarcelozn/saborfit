import { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, BadgeCheck, LockKeyhole, LogOut, Mail, ShieldCheck, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "@/app/config/routes";
import { useAuth } from "@/app/contexts/useAuth";
import { showNotification } from "@/app/services/notificationService";
import "./css/Profile.css";

function getInitials(name) {
  const parts = name?.trim().split(/\s+/).filter(Boolean) ?? [];
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logoutAll } = useAuth();
  const [isLoggingOutAll, setIsLoggingOutAll] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogoutAll = async () => {
    try {
      setIsLoggingOutAll(true);
      await logoutAll();
      showNotification("Você saiu da conta em todos os dispositivos.", "success");
      navigate(ROUTES.LOGIN, { replace: true });
    } catch (error) {
      showNotification(error.message || "Não foi possível encerrar todas as sessões.", "error");
    } finally {
      setIsLoggingOutAll(false);
    }
  };

  if (!isAuthenticated || !user) return null;

  const isAdmin = user.role === "admin";
  const isEmailVerified = Boolean(user.emailVerificado);

  return (
    <main className="profile-page" id="main-content">
      <div className="profile-page__inner">
        <Link className="profile-back-link" to={ROUTES.HOME}>
          <ArrowLeft size={16} aria-hidden="true" />
          Voltar à loja
        </Link>

        <header className="profile-page__heading">
          <span className="profile-page__eyebrow">Área do cliente</span>
          <h1>Meu perfil</h1>
          <p>Consulte os dados vinculados à sua conta SaborFit.</p>
        </header>

        <section className="profile-identity" aria-label="Resumo da conta">
          <div className="profile-identity__avatar" aria-hidden="true">
            {getInitials(user.nome)}
          </div>
          <div className="profile-identity__content">
            <span className="profile-identity__label">
              {isAdmin ? "Conta administrativa" : "Conta SaborFit"}
            </span>
            <h2>{user.nome || "Cliente"}</h2>
            <p>{user.email || "E-mail não informado"}</p>
            <span className={`profile-identity__badge${isEmailVerified ? "" : " profile-identity__badge--pending"}`}>
              {isEmailVerified
                ? <BadgeCheck size={15} aria-hidden="true" />
                : <ShieldCheck size={15} aria-hidden="true" />}
              {isEmailVerified ? "E-mail verificado" : "E-mail não verificado"}
            </span>
          </div>
          <Link
            className="profile-button profile-button--secondary profile-identity__logout"
            to={ROUTES.MENU}
          >
            Ver cardápio
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </section>

        <section className="profile-details" aria-labelledby="profile-details-title">
          <div className="profile-section-heading">
            <span className="profile-section-heading__icon">
              <UserRound size={19} aria-hidden="true" />
            </span>
            <div>
              <h2 id="profile-details-title">Dados da conta</h2>
              <p>Informações cadastradas no seu perfil.</p>
            </div>
          </div>

          <dl className="profile-details__list">
            <div className="profile-detail">
              <dt>
                <UserRound size={17} aria-hidden="true" />
                Nome completo
              </dt>
              <dd>{user.nome || "Não informado"}</dd>
            </div>
            <div className="profile-detail">
              <dt>
                <Mail size={17} aria-hidden="true" />
                E-mail
              </dt>
              <dd className="profile-detail__email">
                <span>{user.email || "Não informado"}</span>
                {isEmailVerified && (
                  <span className="profile-detail__verified">
                    <BadgeCheck size={14} aria-hidden="true" />
                    Verificado
                  </span>
                )}
              </dd>
            </div>
            <div className="profile-detail">
              <dt>
                <ShieldCheck size={17} aria-hidden="true" />
                Tipo de conta
              </dt>
              <dd>{isAdmin ? "Administrador" : "Cliente"}</dd>
            </div>
          </dl>
          <p className="profile-details__note">
            Para atualizar seus dados, entre em contato com nosso atendimento.
          </p>
        </section>

        <section className="profile-security" aria-labelledby="profile-security-title">
          <span className="profile-security__icon">
            <LockKeyhole size={20} aria-hidden="true" />
          </span>
          <div className="profile-security__content">
            <h2 id="profile-security-title">Segurança da conta</h2>
            <p>
              Revogue o acesso da sua conta em todos os dispositivos conectados.
            </p>
          </div>
          <button
            type="button"
            className="profile-button profile-button--danger"
            onClick={handleLogoutAll}
            disabled={isLoggingOutAll}
          >
            <LogOut size={16} aria-hidden="true" />
            {isLoggingOutAll ? "Encerrando sessões..." : "Sair de todos os dispositivos"}
          </button>
        </section>
      </div>
    </main>
  );
}
