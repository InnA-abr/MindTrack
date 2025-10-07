import React from "react";
import { useNavigate } from "react-router-dom";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { FiLogOut } from "react-icons/fi";

import { BackgroundWrapper } from "../components/Account/AccountPageStyles";
import { GlobalStyle } from "../components/Account/AccountPageStyles";

const SignUp = () => {
  const { login: doLogin } = useAuth();
  const navigate = useNavigate();
  const initialValues = {
    firstName: "",
    lastName: "",
    login: "",
    email: "",
    confirmEmail: "",
    password: "",
  };

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("Ім’я обов'язкове"),
    lastName: Yup.string().required("Прізвище обов'язкове"),
    login: Yup.string().required("Логін обов'язковий"),
    email: Yup.string()
      .email("Невірна електронна адреса")
      .required("Електронна адреса обов'язкова"),
    confirmEmail: Yup.string()
      .oneOf([Yup.ref("email"), null], "Електронні адреси не збігаються")
      .required("Підтвердження електронної адреси обов'язкове"),
    password: Yup.string()
      .min(6, "Пароль має містити щонайменше 6 символів")
      .required("Пароль обов'язковий"),
  });

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    setStatus(null);
    try {
      const response = await api.post("/auth/register", values);
      const { token, user } = response.data;
      doLogin(token, user);
      navigate("/welcome");
    } catch (err) {
      setStatus(err.response?.data?.error || "Помилка реєстрації");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <GlobalStyle />
      <BackgroundWrapper>
        <Card>
          <Title>Реєстрація</Title>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, status }) => (
              <StyledForm>
                <StyledField
                  name="firstName"
                  type="text"
                  placeholder="Ім'я"
                  autoComplete="given-name"
                />
                <ErrorMsg name="firstName" component="div" />

                <StyledField
                  name="lastName"
                  type="text"
                  placeholder="Прізвище"
                  autoComplete="family-name"
                />
                <ErrorMsg name="lastName" component="div" />

                <StyledField
                  name="login"
                  type="text"
                  placeholder="Логін"
                  autoComplete="username"
                />
                <ErrorMsg name="login" component="div" />

                <StyledField
                  name="email"
                  type="email"
                  placeholder="Електронна пошта"
                  autoComplete="email"
                />
                <ErrorMsg name="email" component="div" />

                <StyledField
                  name="confirmEmail"
                  type="email"
                  placeholder="Підтвердіть електронну пошту"
                  autoComplete="off"
                />
                <ErrorMsg name="confirmEmail" component="div" />

                <StyledField
                  name="password"
                  type="password"
                  placeholder="Пароль"
                  autoComplete="new-password"
                />
                <ErrorMsg name="password" component="div" />

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Завантаження..." : "Зареєструватися"}
                </Button>
                <LogoutButton type="button" onClick={handleLogout}>
                  <FiLogOut style={{ marginRight: "8px" }} />
                  Вийти
                </LogoutButton>

                {status && <ErrorText>{status}</ErrorText>}
              </StyledForm>
            )}
          </Formik>
        </Card>
      </BackgroundWrapper>
    </>
  );
};

export default SignUp;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 40px 30px;
  border-radius: 16px;
  width: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
  text-align: center;

  @media (max-width: 450px) {
    width: 90%;
    padding: 30px 20px;
  }
`;

const Title = styled.h2`
  margin-bottom: 24px;
  font-weight: 600;
  color: #dbeafe;
`;

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
`;

const StyledField = styled(Field)`
  width: 100%;
  padding: 14px 18px;
  margin-bottom: 10px;
  border: 1.5px solid #a8bfc9;
  border-radius: 12px;
  font-size: 1.1rem;
  color: #1e293b;
  background-color: #f8fafc;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 8px #4a90e2aa;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    padding: 12px 15px;
  }
`;

const ErrorMsg = styled(ErrorMessage)`
  color: #ef4444;
  font-weight: 500;
  margin-bottom: 10px;
  font-size: 0.9rem;
  text-align: left;
`;

const Button = styled.button`
  width: 100%;
  padding: 14px;
  background: #4a90e2;
  color: white;
  font-size: 1.2rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s ease, box-shadow 0.3s ease;
  margin-top: 10px;

  &:hover:not(:disabled) {
    background: #357abd;
    box-shadow: 0 4px 12px rgba(53, 122, 189, 0.6);
  }

  &:disabled {
    background: #a8bfc9;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    font-size: 1.1rem;
    padding: 12px;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  background: transparent;
  border: none;
  color: #fff;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  padding: 8px 12px;
  margin-top: 15px;
  border-radius: 6px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const errorShake = keyframes`
  0%, 100% { transform: translateX(0) }
  20%, 60% { transform: translateX(-8px) }
  40%, 80% { transform: translateX(8px) }
`;

const ErrorText = styled.p`
  margin-top: 10px;
  color: #ef4444;
  font-weight: 600;
  font-size: 0.95rem;
  text-align: center;
  animation: ${errorShake} 0.3s ease;
`;
