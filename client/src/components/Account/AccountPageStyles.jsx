import styled, { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  html, body, #root {
    height: 100%;
    margin: 0;
    padding: 0;
    font-family: "Roboto", sans-serif;
    background: #0a1930;
    color: #0c0b0bff;
  }
  * {
    box-sizing: border-box;
  }
`;

export const BackgroundWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(
      135deg,
      rgba(74, 144, 226, 0.85),
      rgba(10, 25, 47, 0.85)
    ),
    url("https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80")
      no-repeat center/cover;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 30px 20px;
`;

export const GlassCard = styled.div`
  width: 100%;
  max-width: 1200px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: row;
  overflow: hidden;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

export const Sidebar = styled.div`
  width: 220px;
  background-color: rgba(30, 41, 59, 0.85);
  padding: 30px 20px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 480px) {
    flex-direction: row;
    width: 100%;
    overflow-x: auto;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

export const SidebarItem = styled.button`
  background: none;
  border: none;
  color: ${({ $active }) => ($active ? "#60a5fa" : "#fff")};
  font-size: 1rem;
  cursor: pointer;
  font-weight: ${({ $active }) => ($active ? "bold" : "normal")};
  transition: color 0.2s;
  text-align: left;

  &:hover {
    color: #88b1edff;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    padding: 8px 12px;
    text-align: center;
    display: block;
    width: 100%;
  }
`;

export const MainArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.div`
  padding: 30px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  margin-top: 20px;
`;

const Notification = styled.div`
  margin: 10px 30px;
  padding: 12px 20px;
  border-radius: 8px;
  background-color: ${({ type }) => (type === "error" ? "#fee2e2" : "#d1fae5")};
  color: ${({ type }) => (type === "error" ? "#991b1b" : "#065f46")};
  border: 1px solid ${({ type }) => (type === "error" ? "#fecaca" : "#6ee7b7")};
  font-weight: 500;
  animation: fadeIn 0.3s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ConfirmOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const ConfirmBox = styled.div`
  background: #fff;
  padding: 30px 40px;
  border-radius: 12px;
  max-width: 400px;
  text-align: center;
  color: #333;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
`;

const ConfirmButtons = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 20px;
`;

const ConfirmButton = styled.button`
  padding: 10px 24px;
  border: none;
  background-color: #e53e3e;
  color: white;
  font-weight: bold;
  border-radius: 25px;
  cursor: pointer;

  &:hover {
    background-color: #c53030;
  }
`;

const CancelButton = styled.button`
  padding: 10px 24px;
  border: none;
  background-color: #94a3b8;
  color: white;
  font-weight: bold;
  border-radius: 25px;
  cursor: pointer;

  &:hover {
    background-color: #64748b;
  }
`;
