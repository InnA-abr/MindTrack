import React, { useState } from "react";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { BackgroundWrapper } from "../components/Account/AccountPageStyles";
import { GlobalStyle } from "../components/Account/AccountPageStyles";

const Login = () => {
  const [showPass, setShowPass] = useState(false);
  const [serverError, setServerError] = useState(null);
  const { login, logout, user } = useAuth();
  const navigate = useNavigate();

  const initialValues = {
    loginOrEmail: "",
    password: "",
  };

  const validationSchema = Yup.object({
    loginOrEmail: Yup.string().required("Введіть логін або email"),
    password: Yup.string().required("Введіть пароль"),
  });

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setServerError(null);
    try {
      const response = await api.post("/auth/login", values);
      const { token, user } = response.data;

      login(token, user);
      navigate("/account");
    } catch (err) {
      console.error("Login error:", err);

      const serverMessage = err?.response?.data?.error;
      const statusCode = err?.response?.status;

      if (err?.message === "Network Error") {
        setServerError("Помилка з'єднання. Перевірте ваше інтернет-з'єднання.");
      } else if (serverMessage) {
        setServerError(serverMessage);
      } else if (statusCode === 400) {
        setServerError("Невірні дані для входу");
      } else {
        setServerError("Сталася помилка. Спробуйте пізніше.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <GlobalStyle />
      <BackgroundWrapper>
        <LoginCard>
          <Title>Увійти</Title>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <StyledForm noValidate>
                <Label htmlFor="loginOrEmail">Email або логін</Label>
                <StyledField
                  type="text"
                  id="loginOrEmail"
                  name="loginOrEmail"
                  placeholder="Введіть email або логін"
                  autoComplete="username"
                />
                <StyledError name="loginOrEmail" component="div" />

                <Label htmlFor="password">Пароль</Label>
                <InputWrapper>
                  <StyledField
                    type={showPass ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Введіть пароль"
                    autoComplete="current-password"
                  />
                  <TogglePasswordButton
                    type="button"
                    onClick={() => setShowPass((prev) => !prev)}
                    aria-label={showPass ? "Сховати пароль" : "Показати пароль"}
                  >
                    {showPass ? "👁️" : "👁️‍🗨️"}
                  </TogglePasswordButton>
                </InputWrapper>
                <StyledError name="password" component="div" />

                {serverError && <ErrorText>{serverError}</ErrorText>}

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <LoadingSpinner /> : "Увійти"}
                </Button>
                <LogoutButton
                  type="button"
                  onClick={handleLogout}
                  aria-label="Вийти"
                >
                  <FiLogOut style={{ marginRight: "8px" }} />
                  Вийти
                </LogoutButton>
              </StyledForm>
            )}
          </Formik>
        </LoginCard>
      </BackgroundWrapper>
    </>
  );
};

export default Login;

const LoginCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 40px 30px;
  border-radius: 16px;
  width: 360px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);

  @media (max-width: 400px) {
    width: 90%;
    padding: 30px 20px;
  }
`;

const Title = styled.h2`
  margin-bottom: 24px;
  text-align: center;
  font-weight: 600;
  color: #dbeafe;
`;

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 6px;
  font-weight: 500;
  font-size: 0.9rem;
  color: #cbd5e1;
`;

const StyledField = styled(Field)`
  width: 100%;
  padding: 14px 40px 14px 16px;
  margin-bottom: 10px;
  border-radius: 12px;
  border: 1.5px solid #a8bfc9;
  font-size: 1rem;
  color: #1e293b;
  background-color: #f8fafc;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 8px #4a90e2aa;
  }
`;

const StyledError = styled(ErrorMessage)`
  margin-top: -6px;
  margin-bottom: 12px;
  color: #ef4444;
  font-size: 0.85rem;
  text-align: left;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const TogglePasswordButton = styled.button`
  position: absolute;
  top: 50%;
  right: 14px;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  font-size: 1rem;
  user-select: none;

  &:hover {
    color: #4a90e2;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  margin-top: 20px;
  align-items: center;
  background: transparent;
  border: none;
  color: #fff;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background-color 0.3s ease;
`;

const Button = styled.button`
  background-color: #4a90e2;
  color: white;
  padding: 14px 0;

  border: none;
  border-radius: 12px;
  font-size: 1.15rem;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s ease;
  margin-top: 12px;

  &:hover:not(:disabled) {
    background-color: #357abd;
    box-shadow: 0 5px 15px rgba(53, 122, 189, 0.6);
  }

  &:disabled {
    background-color: #94a3b8;
    cursor: not-allowed;
  }
`;

const errorShake = keyframes`
  0%, 100% { transform: translateX(0) }
  20%, 60% { transform: translateX(-8px) }
  40%, 80% { transform: translateX(8px) }
`;

const ErrorText = styled.p`
  color: #ef4444;
  font-weight: 600;
  font-size: 0.9rem;
  text-align: center;
  animation: ${errorShake} 0.3s ease;
  margin-bottom: 10px;
`;

const LoadingSpinner = styled.div`
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid #fff;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  margin: 0 auto;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
