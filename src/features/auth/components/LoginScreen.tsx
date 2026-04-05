import React, { useState } from "react";
import { User } from "@/shared/types";

import { useI18n } from "@/shared/context/i18n";
import { useAuthStore } from "../store/useAuthStore";
import Card from "@/shared/components/ui/Card";
import Button from "@/shared/components/ui/Button";
import Input from "@/shared/components/ui/Input";
import PasswordResetModal from "./PasswordResetModal";

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const { t } = useI18n();
  const { login, register } = useAuthStore();

  const [isRegistering, setIsRegistering] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isResetModalOpen, setResetModalOpen] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState<"Male" | "Female" | "Other">("Male");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");

  const clearForm = () => {
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setGender("Male");
    setEmail("");
    setDob("");
    setError("");
  };

  const handleToggleMode = () => {
    setIsRegistering(!isRegistering);
    clearForm();
    setSuccessMessage("");
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(username, password);
    } catch (err: any) {
      console.error("Failed to process login", err);
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/invalid-credential"
      ) {
        setError(t("login.errors.invalidCredentials"));
      } else {
        setError(t("login.errors.generic"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setError(t("login.errors.passwordMismatch"));
      return;
    }

    if (password.length < 6) {
      setError(
        t("login.errors.passwordTooShort") ||
          "Password must be at least 6 characters",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const newUser = {
        username,
        email,
        dob,
        gender,
      };

      await register({ ...newUser, password });
      setSuccessMessage(t("login.registerSuccess"));

      // Switch back to login mode after a short delay to see the message
      setTimeout(() => {
        setIsRegistering(false);
      }, 1500);
    } catch (err: any) {
      console.error("Failed to process registration", err);
      if (err.code === "auth/email-already-in-use") {
        setError(t("login.errors.emailTaken"));
      } else {
        setError(t("login.errors.generic"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] p-4 sm:p-6 select-none overflow-hidden relative">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--primary)] shadow-lg shadow-[var(--primary)]/20 z-50"></div>

      <div className="mb-8 animate-in fade-in slide-in-from-top-8 duration-700 text-center">
        <h1 className="text-5xl sm:text-7xl font-black text-[var(--primary)] tracking-tighter uppercase italic drop-shadow-2xl">
          BULL<span className="text-[var(--text)] opacity-90">BOX</span>
        </h1>
        <p className="text-[10px] sm:text-xs font-black text-[var(--muted-text)] uppercase tracking-[0.3em] mt-2 translate-x-1">
          Ultimate Training Tracker
        </p>
      </div>

      <Card
        className="w-full max-w-md shadow-2xl border border-[var(--border)] animate-in fade-in slide-in-from-bottom-8 duration-500"
        description={
          isRegistering ? t("login.registerTagline") : t("login.tagline")
        }
      >
        <div className="mt-4 sm:mt-8">
          {isRegistering ? (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {successMessage && (
                <p className="text-sm text-green-500 text-center">
                  {successMessage}
                </p>
              )}
              <Input
                label={t("login.username")}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <Input
                label={t("login.email")}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label={t("login.dob")}
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
              />
              <Input
                label={t("login.gender")}
                type="select"
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                options={[
                  { value: "Male", label: t("login.male") },
                  { value: "Female", label: t("login.female") },
                  { value: "Other", label: t("login.other") || "Other" },
                ]}
                required
              />
              <Input
                label={t("login.password")}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Input
                label={t("login.confirmPassword")}
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={isSubmitting}
              >
                {t("login.registerButton")}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              {successMessage && (
                <p className="text-sm text-green-500 text-center">
                  {successMessage}
                </p>
              )}
              <Input
                label={t("login.username")}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                data-testid="login-username"
              />
              <Input
                label={t("login.password")}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                data-testid="login-password"
              />

              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={isSubmitting}
                data-testid="login-submit"
              >
                {t("login.loginButton")}
              </Button>
              <div className="text-center">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => setResetModalOpen(true)}
                  className="text-sm underline"
                >
                  {t("login.forgotPassword")}
                </Button>
              </div>
            </form>
          )}

          <div className="text-center mt-6">
            <Button
              variant="ghost"
              onClick={handleToggleMode}
              className="text-sm text-[var(--muted-text)]"
            >
              {isRegistering
                ? t("login.switchToLogin")
                : t("login.switchToRegister")}
            </Button>
          </div>
        </div>
      </Card>

      <PasswordResetModal
        isOpen={isResetModalOpen}
        onClose={() => setResetModalOpen(false)}
      />
    </div>
  );
};

export default LoginScreen;
