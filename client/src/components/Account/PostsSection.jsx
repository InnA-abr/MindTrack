import React, { useState } from "react";
import styled from "styled-components";

import PostList from "../Post/PostList";
import CreatePostForm from "../Post/CreatePostForm";

const POSTS_PER_PAGE = 5;

const PostsSection = ({
  showCreateForm,
  setShowCreateForm,
  user,
  posts,
  onCreatePost,
  onLike,
  onDelete,
  userName,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastPost = currentPage * POSTS_PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <>
      {showCreateForm ? (
        <CreatePostForm
          onCreate={onCreatePost}
          onCancel={() => setShowCreateForm(false)}
          userId={user.id}
          authorName={userName}
        />
      ) : userName && userName.trim() !== "" ? (
        <CreatePostButton onClick={() => setShowCreateForm(true)}>
          Створити новий пост
        </CreatePostButton>
      ) : (
        <p style={{ color: "red", padding: "10px" }}>
          Будь ласка, увійдіть або додайте ім’я в профілі, щоб створити пост
        </p>
      )}

      <PostList
        posts={currentPosts}
        user={user}
        onLike={onLike}
        onDelete={onDelete}
      />

      {totalPages > 1 && (
        <PaginationWrapper>
          <PaginationButton
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            ← Назад
          </PaginationButton>
          <PageIndicator>
            Сторінка {currentPage} / {totalPages}
          </PageIndicator>
          <PaginationButton
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Вперед →
          </PaginationButton>
        </PaginationWrapper>
      )}
    </>
  );
};

const CreatePostButton = styled.button`
  margin-bottom: 20px;
  background-color: #415676ff;
  color: white;
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #595b5fff;
  }

  &:focus {
    outline: none;
    border: 2px solid #60a5fa;
  }
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 20px;
`;

const PaginationButton = styled.button`
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

const PageIndicator = styled.span`
  font-size: 0.95rem;
  color: #cbd5e1;
`;

export default PostsSection;
