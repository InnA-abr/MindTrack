import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  fetchCommentsForPost,
  createComment,
  deleteComment,
} from "../../api/commentService";

import { useAuth } from "../../context/AuthContext";

const Post = ({ post, onLike, onDelete, user }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [error, setError] = useState(null);

  const { token } = useAuth();

  const [commentToDelete, setCommentToDelete] = useState(null);

  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (user && post.likes) {
      setLiked(post.likes.includes(user.id));
    }
  }, [post.likes, user]);

  useEffect(() => {
    const loadComments = async () => {
      try {
        setLoadingComments(true);
        const data = await fetchCommentsForPost(post._id);
        setComments(data);
      } catch {
        setError("Не вдалося завантажити коментарі");
      } finally {
        setLoadingComments(false);
      }
    };

    loadComments();
  }, [post._id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setError(null);
    try {
      const newComment = await createComment(post._id, commentText, token);
      setComments((prev) => [...prev, newComment]);
      setCommentText("");
    } catch {
      setError("Помилка при додаванні коментаря");
    }
  };

  const confirmDeleteComment = (commentId) => {
    setCommentToDelete(commentId);
  };

  const handleConfirmDelete = async () => {
    setError(null);
    try {
      await deleteComment(commentToDelete, token);
      setComments((prev) =>
        prev.filter((c) => (c._id || c.id) !== commentToDelete)
      );
      setCommentToDelete(null);
    } catch {
      setError("Помилка при видаленні коментаря");
      setCommentToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setCommentToDelete(null);
  };

  const handleDeletePost = () => {
    onDelete(post._id);
  };

  const handleLikeClick = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    onLike(post._id, newLiked);
  };

  const userHasLikedInData = post.likes?.includes(user?.id);
  let displayedLikesCount = post.likes ? post.likes.length : 0;
  if (liked && !userHasLikedInData) displayedLikesCount += 1;
  if (!liked && userHasLikedInData) displayedLikesCount -= 1;

  return (
    <PostContainer>
      <PostContent>
        <AuthorRow>
          <AvatarImage
            src={post.user?.avatarUrl || "/default-avatar.png"}
            alt={`${post.user?.firstName}'s avatar`}
          />
          <Author href={`/user/${post.user._id}`}>
            {post.user?.firstName}
          </Author>
        </AuthorRow>
        {post.imageUrls ? (
          <ImageWrapper>
            <PostImage src={post.imageUrls} />
          </ImageWrapper>
        ) : null}

        <p>{post.content}</p>
      </PostContent>

      <CommentsSection>
        <PostActions>
          <LikeButton
            onClick={handleLikeClick}
            $liked={liked}
            aria-pressed={liked}
          >
            {liked ? "❤️" : "🤍"} <LikesCount>{displayedLikesCount}</LikesCount>
          </LikeButton>

          {user?.id === post.user._id && (
            <DeletePostButton onClick={handleDeletePost}>🗑️</DeletePostButton>
          )}
        </PostActions>
        <CommentsList>
          {comments.map((c) => (
            <CommentItem key={c._id || c.id}>
              <CommentUserInfo>
                <AvatarImage
                  src={c.user?.avatarUrl || "/default-avatar.png"}
                  alt={`${c.user?.firstName || "User"}'s avatar`}
                />
                <CommentDetails>
                  <CommentAuthor>{c.user?.firstName || "Анонім"}</CommentAuthor>
                  <CommentText>{c.content || c.text}</CommentText>
                </CommentDetails>
              </CommentUserInfo>

              {user?.id === (c.user?._id || c.user?.id) && (
                <DeleteButton
                  onClick={() => confirmDeleteComment(c._id || c.id)}
                >
                  🗑️
                </DeleteButton>
              )}
            </CommentItem>
          ))}
        </CommentsList>

        <CommentForm onSubmit={handleCommentSubmit}>
          <CommentInput
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Напишіть коментар..."
          />
          <CommentButton type="submit">Коментувати</CommentButton>
        </CommentForm>

        {error && <ErrorText>{error}</ErrorText>}
      </CommentsSection>

      {commentToDelete && (
        <ModalOverlay>
          <ModalContent>
            <ModalText>Ви впевнені, що хочете видалити цей коментар?</ModalText>
            <ModalButtons>
              <ModalButtonConfirm onClick={handleConfirmDelete}>
                Так
              </ModalButtonConfirm>
              <ModalButtonCancel onClick={handleCancelDelete}>
                Ні
              </ModalButtonCancel>
            </ModalButtons>
          </ModalContent>
        </ModalOverlay>
      )}
    </PostContainer>
  );
};

const PostContainer = styled.div`
  position: relative; /* Required for absolute positioning inside */
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
  width: 100%;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const PostContent = styled.div`
  margin-bottom: 12px;
  h3 {
    margin-bottom: 8px;
  }
`;

const Author = styled.a`
  font-style: italic;
  color: #0e0c0cff;
  text-decoration: none;
`;

const PostActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const LikeButton = styled.button`
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 20px;
  border: none;
  background-color: transparent;
  font-size: 1.3rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${(props) => (props.$liked ? "#ff0000" : "#ff5a5f")};
  transition: transform 0.1s;

  &:hover {
    transform: scale(1.2);
  }
`;

const DeletePostButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;

  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
`;

const LikesCount = styled.span`
  font-size: 1.1rem;
`;

const CommentsSection = styled.div`
  margin-top: 16px;
`;

const CommentsList = styled.ul`
  list-style: none;
  padding-left: 0;
  max-height: 150px;
  overflow-y: auto;
`;

const CommentItem = styled.li`
  background: #f0f0f0;
  padding: 6px 12px;
  margin-bottom: 6px;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CommentText = styled.span`
  font-size: 0.9rem;
  color: #333;
`;

const DeleteButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  color: #c00;
  font-size: 1rem;
`;

const CommentForm = styled.form`
  margin-top: 12px;
  display: flex;
  gap: 8px;
`;

const CommentInput = styled.input`
  flex: 1;
  padding: 6px 12px;
  font-size: 1rem;
  border-radius: 12px;
  border: 1px solid #ddd;
`;

const CommentButton = styled.button`
  padding: 6px 16px;
  border-radius: 12px;
  border: none;
  background-color: #4c8bf5;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #3a6ccf;
  }
`;

const CommentUserInfo = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  flex: 1;
`;

const CommentDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const CommentAuthor = styled.span`
  font-weight: bold;
  font-size: 0.9rem;
  color: #222;
`;

const ErrorText = styled.p`
  color: red;
  font-weight: bold;
  margin-top: 8px;
`;

const AuthorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`;

const AvatarImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #4c8bf5;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(10, 10, 10, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 24px 32px;
  border-radius: 12px;
  max-width: 400px;
  text-align: center;
`;

const ModalText = styled.p`
  font-size: 1.1rem;
  margin-bottom: 24px;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
`;

const ModalButtonConfirm = styled.button`
  background-color: #e53e3e;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #c53030;
  }
`;

const ModalButtonCancel = styled.button`
  background-color: #a0aec0;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #718096;
  }
`;

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 12px 0;
`;

const PostImage = styled.img`
  display: block;
  margin: 12px auto;
  max-width: 100%;
  max-height: 300px;
  border-radius: 12px;
  object-fit: contain;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
`;

export default Post;
