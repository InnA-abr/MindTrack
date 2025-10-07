import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { GlobalStyle } from "../components/Account/AccountPageStyles";
import { useNavigate } from "react-router-dom";

const questions = [
  "Чи відчуваєте ви стрес сьогодні?",
  "Чи достатньо ви спали минулої ночі?",
  "Чи встигли ви сьогодні відпочити хоча б 10 хвилин?",
  "Чи робите ви фізичні вправи регулярно?",
  "Чи є у вас час на улюблене хобі сьогодні?",
];

const finalAdvice = {
  positive: "Ви виглядаєте чудово! Продовжуйте в тому ж дусі, бережіть себе.",
  negative:
    "Схоже, вам потрібен відпочинок. Спробуйте зробити коротку прогулянку або розслабитися.",
};

const StressCheck = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const navigate = useNavigate();

  const handleAnswer = (answer) => {
    setAnswers((prev) => [...prev, answer]);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setCurrentQuestion(questions.length);
    }
  };

  const calculateFinalAdvice = () => {
    const positiveAnswers = answers.filter((a) => a === "yes").length;
    return positiveAnswers >= 3 ? finalAdvice.positive : finalAdvice.negative;
  };

  return (
    <>
      <GlobalStyle />
      <Background>
        <Content>
          {currentQuestion < questions.length ? (
            <>
              <Question>{questions[currentQuestion]}</Question>
              <ButtonGroup>
                <OptionButton onClick={() => handleAnswer("yes")}>
                  Так
                </OptionButton>
                <OptionButton onClick={() => handleAnswer("no")}>
                  Ні
                </OptionButton>
              </ButtonGroup>
            </>
          ) : (
            <>
              <Question>Порада для вас:</Question>
              <Advice>{calculateFinalAdvice()}</Advice>
              <ButtonGroup>
                <ContinueButton onClick={() => setCurrentQuestion(0)}>
                  Спробувати знову
                </ContinueButton>
                <ContinueButton onClick={() => navigate("/account")}>
                  Назад
                </ContinueButton>
              </ButtonGroup>
            </>
          )}
        </Content>
      </Background>
    </>
  );
};

const Background = styled.div`
  height: 100%;
  width: 100%;
  background: linear-gradient(rgba(10, 25, 47, 0.85), rgba(10, 25, 47, 0.85)),
    url("https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80")
      no-repeat center center/cover;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const Content = styled.div`
  max-width: 700px;
  padding: 20px;
`;

const Question = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 25px;
  color: white;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 20px;
`;

const OptionButton = styled.button`
  padding: 12px 30px;
  font-size: 1.1rem;
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
  border: none;
  border-radius: 50px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2);

  &:hover {
    background: #1a3555;
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(74, 144, 226, 0.8);
  }
`;

const Advice = styled.p`
  margin-top: 30px;
  font-size: 1.25rem;
  color: #b2ebf2;
`;

const ContinueButton = styled(OptionButton)`
  margin-top: 40px;
  background-color: #2f6981ff;
  color: white;

  &:hover {
    background-color: #1a3555;
    box-shadow: 0 6px 20px rgba(112, 140, 221, 0.8);
  }
`;

export default StressCheck;
