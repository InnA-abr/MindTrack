import React, { useState, useEffect } from "react";
import styled from "styled-components";

import {
  fetchAwardById,
  createAward,
  deleteAward,
  fetchAwardsByUserId,
} from "../api/awardService";
import { updateUser } from "../api/userService";
import { useAuth } from "../context/AuthContext";

const ITEMS_PER_PAGE = 5;

const AwardsPage = () => {
  const { user, setUser } = useAuth();

  const [awards, setAwards] = useState([]);
  const [newAwardTitle, setNewAwardTitle] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const loadUserAwards = async () => {
    if (user?.awards?.length > 0) {
      try {
        const fetchedAwards = await fetchAwardsByUserId(user.id);
        setAwards(fetchedAwards);
      } catch (err) {
        console.error("Помилка при завантаженні нагород:", err);
        setError("Не вдалося завантажити досягнення. Спробуйте пізніше.");
      }
    } else {
      setAwards([]);
    }
  };

  useEffect(() => {
    if (user) {
      loadUserAwards();
      setCurrentPage(1);
    }
  }, [user]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleCreateAward = async () => {
    if (!newAwardTitle.trim()) return;

    try {
      const created = await createAward({
        title: newAwardTitle,
      });
      const awardsIds = user.awards || [];
      const updatedUser = await updateUser({
        ...user,
        awards: [created._id, ...awardsIds],
      });
      setUser(updatedUser);

      setAwards([created, ...awards]);
      setNewAwardTitle("");
      setCurrentPage(1);

      setMessage("Досягнення додано!");
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Будь ласка, увійдіть у систему.");
      } else {
        console.error("Помилка при створенні:", err);
        setError("Не вдалося створити. Спробуйте ще раз.");
      }
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Ви впевнені, що хочете видалити ?");
    if (!confirmed) return;

    try {
      await deleteAward(id);
      const updatedAwardsIds = (user.awards || []).filter((aId) => aId !== id);
      const updatedUser = await updateUser({
        ...user,
        awards: updatedAwardsIds,
      });
      setUser(updatedUser);
      setAwards((prevAwards) => prevAwards.filter((a) => a._id !== id));

      const lastPage = Math.ceil((awards.length - 1) / ITEMS_PER_PAGE);
      if (currentPage > lastPage) {
        setCurrentPage(lastPage);
      }

      setMessage("Досягнення видалено!");
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Будь ласка, увійдіть у систему.");
      } else {
        console.error("Помилка при видаленні:", err);
        setError("Не вдалося видалити. Спробуйте пізніше.");
      }
    }
  };

  const totalPages = Math.ceil(awards.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentAwards = [...awards]
    .reverse()
    .slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <>
      <SectionTitle>Мої досягнення</SectionTitle>

      <NewAwardBlock>
        <Input
          key={"new-award-title"}
          placeholder="Назва досягнення"
          value={newAwardTitle}
          onChange={(e) => setNewAwardTitle(e.target.value)}
        />

        <Button onClick={handleCreateAward}>Додати</Button>
      </NewAwardBlock>

      {currentAwards.length > 0 ? (
        currentAwards.map((award) => (
          <AwardCard key={award._id}>
            <AwardTitle>{award.title}</AwardTitle>
            <AwardDesc>{award.description}</AwardDesc>
            <Button onClick={() => handleDelete(award._id)}>🗑️ Видалити</Button>
          </AwardCard>
        ))
      ) : (
        <EmptyText>У вас ще немає досягнень. Створіть перше!</EmptyText>
      )}

      {totalPages > 1 && (
        <Pagination>
          <PageButton
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            &lt; Попередня
          </PageButton>

          <PageInfo>
            Сторінка {currentPage} з {totalPages}
          </PageInfo>

          <PageButton
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Наступна &gt;
          </PageButton>
        </Pagination>
      )}

      {message && <MessageBox type="success">{message}</MessageBox>}
      {error && <MessageBox type="error">{error}</MessageBox>}
    </>
  );
};

const SectionTitle = styled.h2`
  color: #0d47a1;
  margin-bottom: 30px;
  text-align: center;
`;

const NewAwardBlock = styled.div`
  background: #e3f2fd;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 40px;
  box-shadow: inset 0 0 5px rgba(13, 71, 161, 0.1);
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 12px;
  border: 1px solid #90caf9;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #1976d2;
  }
`;

const Button = styled.button`
  background-color: #95c3f2ff;
  color: white;
  padding: 10px 18px;
  margin-top: 10px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background-color: #0d47a1;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const AwardCard = styled.div`
  background: #ffffff;
  border: 1px solid #e0e0e0;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.05);
`;

const AwardTitle = styled.h3`
  margin: 0 0 8px 0;
  color: #1565c0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const AwardDesc = styled.p`
  margin: 6px 0 16px;
  color: #424242;
`;

const EmptyText = styled.p`
  text-align: center;
  color: #757575;
  font-style: italic;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 20px;
`;

const PageButton = styled.button`
  background-color: #334155;
  color: white;
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: #475569;
  }
`;

const PageInfo = styled.span`
  font-size: 0.95rem;
  color: #cbd5e1;
`;

const MessageBox = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  min-width: 220px;
  max-width: 320px;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  text-align: center;
  color: ${({ type }) => (type === "error" ? "#f8d7da" : "#155724")};
  background-color: ${({ type }) => (type === "error" ? "#721c24" : "#d4edda")};
  border: 1px solid ${({ type }) => (type === "error" ? "#f5c6cb" : "#c3e6cb")};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
`;

export default AwardsPage;
