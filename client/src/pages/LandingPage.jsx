import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import { Link } from "react-router-dom";

import { GlobalStyle } from "../components/Account/AccountPageStyles";

const LandingPage = () => {
  return (
    <>
      <GlobalStyle />
      <LandingWrapper>
        <Title>Ласкаво просимо до MindTrack</Title>
        <Subtitle>
          Відстежуйте свої досягнення, розвивайтесь і спілкуйтесь з іншими
          користувачами.
        </Subtitle>
        <Nav>
          <NavLink to="/login">Увійти</NavLink>
          <NavLink to="/signup">Зареєструватися</NavLink>
        </Nav>
      </LandingWrapper>
    </>
  );
};

const LandingWrapper = styled.div`
  height: 100vh;
  background: linear-gradient(rgba(10, 25, 47, 0.85), rgba(10, 25, 47, 0.85)),
    url("https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80")
      no-repeat center center/cover;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #f0f4f8;
  text-align: center;
  padding: 0 20px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
`;

const Title = styled.h1`
  font-size: 4rem;
  font-weight: 900;
  margin-bottom: 15px;
  text-shadow: 0 5px 15px rgba(0, 0, 0, 0.8);

  @media (max-width: 480px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.8rem;
  max-width: 600px;
  margin-bottom: 40px;
  font-weight: 500;
  text-shadow: 0 3px 10px rgba(0, 0, 0, 0.7);

  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 30px;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 15px;
    width: 100%;
    max-width: 300px;
  }
`;

const NavLink = styled(Link)`
  padding: 15px 40px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50px;
  color: #f0f4f8;
  font-weight: 700;
  font-size: 1.2rem;
  text-decoration: none;
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;

  &:hover {
    background: #4a90e2;
    box-shadow: 0 6px 20px rgba(74, 144, 226, 0.8);
    transform: translateY(-4px);
  }

  @media (max-width: 480px) {
    padding: 12px 0;
    font-size: 1rem;
    text-align: center;
  }
`;
export default LandingPage;
