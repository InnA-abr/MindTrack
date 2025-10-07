import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import styled from "styled-components";

import { useAuth } from "../../context/AuthContext";
import LandingPage from "../../pages/LandingPage";
import Login from "../../pages/Login";
import SignUp from "../../pages/SignUp";
import StressCheck from "../../pages/StressCheck";
import UserPage from "../../pages/UserPage";
import AwardsPage from "../../pages/AwardsPage";

import Sidebar from "../../components/Account/Sidebar";
import FollowingsSection from "../../components/Account/FollowingsSection";
import PostsSection from "../../components/Account/PostsSection";
import ProfileSection from "../../components/Account/ProfileSection";

import {
  getFollowing,
  unfollowUser,
  followUser,
} from "../../api/followerService";
import {
  fetchPosts,
  createPost,
  updatePost,
  deletePost,
} from "../../api/postService";
import { updateUser } from "../../api/userService";

import {
  BackgroundWrapper,
  GlobalStyle,
  GlassCard,
} from "../../components/Account/AccountPageStyles";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <p style={{ textAlign: "center" }}>Завантаження...</p>;
  return user ? children : <Navigate to="/" replace />;
};

const tabLabels = {
  posts: "Пости",
  awards: "Досягнення",
  followings: "Мої Підписки",
  "stress-check": "Стрес Чек",
};

const NavigationWrapper = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const [followings, setFollowings] = useState([]);
  const [posts, setPosts] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedFirstName, setEditedFirstName] = useState(user?.firstName || "");
  const [editedLastName, setEditedLastName] = useState(user?.lastName || "");
  const [editedAvatar, setEditedAvatar] = useState(user?.avatarUrl || "");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const userName =
    user?.name ||
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    user?.login ||
    "";

  //  PROFILE
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  const handleSave = async (updatedValues) => {
    setError(null);
    setMessage(null);
    try {
      const updatedUser = { ...user, ...updatedValues };
      await updateUser(updatedUser);
      setUser(updatedUser);
      setEditMode(false);
      setMessage("Профіль успішно збережено!");
    } catch (err) {
      setError("Не вдалося зберегти профіль.");
    }
  };

  // POSTS
  const handleCreatePost = async (newPost) => {
    try {
      const created = await createPost(newPost);
      setPosts([created, ...posts]);
      setShowCreateForm(false);
      setMessage("Пост успішно створено!");
    } catch {
      setError("Помилка створення поста");
    }
  };

  const handleLike = async (postId) => {
    const post = posts.find((p) => p._id === postId);
    if (!post) return;
    const updatedPost = {
      ...post,
      likes: post.likes.includes(user.id)
        ? post.likes.filter((id) => id !== user.id)
        : [...post.likes, user.id],
    };
    try {
      await updatePost(postId, updatedPost);
      setPosts(posts.map((p) => (p._id === postId ? updatedPost : p)));
    } catch {
      setError("Не вдалося поставити лайк");
    }
  };

  const requestDeletePost = (postId) => setPostToDelete(postId);

  const confirmDeletePost = async () => {
    try {
      await deletePost(postToDelete);
      setPosts(posts.filter((p) => p._id !== postToDelete));
      setMessage("Пост успішно видалено");
    } catch {
      setError("Не вдалося видалити пост");
    } finally {
      setPostToDelete(null);
    }
  };

  const cancelDeletePost = () => setPostToDelete(null);

  // FOLLOWING
  const handleToggleFollow = async (userId, isFollowing) => {
    try {
      if (isFollowing) {
        await unfollowUser(userId);
        setUser({
          ...user,
          followers: user.followers.filter((id) => id !== userId),
        });
        setMessage("Ви відписалися");
      } else {
        await followUser(userId);
        setUser({ ...user, followers: [...user.followers, userId] });
        setMessage("Ви підписалися");
      }
    } catch {
      setError("Не вдалося змінити статус підписки");
    }
  };

  // LOADERS
  const loadFollowers = async () => {
    try {
      const res = await getFollowing(user.id);
      setFollowings(res);
    } catch {
      setError("Не вдалося завантажити підписки");
    }
  };

  const loadPosts = async () => {
    try {
      const res = await fetchPosts();
      setPosts(res);
    } catch {
      setError("Не вдалося завантажити пости");
    }
  };

  useEffect(() => {
    if (user) {
      setEditedFirstName(user.firstName || "");
      setEditedLastName(user.lastName || "");
      setEditedAvatar(user.avatarUrl || "");
      loadPosts();
      loadFollowers();
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
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <>
      {message && <MessageBox type="success">{message}</MessageBox>}
      {error && <MessageBox type="error">{error}</MessageBox>}
      <GlobalStyle />
      <BackgroundWrapper>
        <GlassCard>
          <Sidebar onLogout={handleLogout} tabLabels={tabLabels} />
          <MainArea>
            <ProfileSection
              user={user}
              editMode={editMode}
              editedFirstName={editedFirstName}
              setEditedFirstName={setEditedFirstName}
              editedLastName={editedLastName}
              setEditedLastName={setEditedLastName}
              editedAvatar={editedAvatar}
              setEditedAvatar={setEditedAvatar}
              onSave={handleSave}
              onEditClick={() => setEditMode(true)}
            />
            <MainContent>
              <Routes>
                <Route
                  path="/user/:userId"
                  element={<UserPage onLike={handleLike} />}
                />
                <Route
                  path="/posts"
                  element={
                    <ScrollablePostsContainer>
                      <PostsSection
                        user={user}
                        posts={posts}
                        userName={userName}
                        showCreateForm={showCreateForm}
                        setShowCreateForm={setShowCreateForm}
                        onCreatePost={handleCreatePost}
                        onLike={handleLike}
                        onDelete={requestDeletePost}
                      />
                    </ScrollablePostsContainer>
                  }
                />
                <Route
                  path="/awards"
                  element={
                    <PrivateRoute>
                      <AwardsPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/followings"
                  element={
                    <PrivateRoute>
                      <FollowingsSection
                        userId={user.id}
                        followings={followings}
                        onToggleFollow={handleToggleFollow}
                      />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/stress-check"
                  element={
                    <PrivateRoute>
                      <StressCheck />
                    </PrivateRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/posts" replace />} />
              </Routes>
            </MainContent>
          </MainArea>
        </GlassCard>
      </BackgroundWrapper>

      {postToDelete && (
        <ConfirmOverlay>
          <ConfirmBox>
            <p>Ви впевнені, що хочете видалити цей пост?</p>
            <ConfirmButtons>
              <ConfirmButton onClick={confirmDeletePost}>
                Видалити
              </ConfirmButton>
              <CancelButton onClick={cancelDeletePost}>Відміна</CancelButton>
            </ConfirmButtons>
          </ConfirmBox>
        </ConfirmOverlay>
      )}
    </>
  );
};

const MessageBox = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  min-width: 400px;
  max-width: 600px;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
  text-align: center;
  color: ${({ type }) => (type === "error" ? "#f8d7da" : "#155724")};
  background-color: ${({ type }) => (type === "error" ? "#721c24" : "#d4edda")};
  border: 1px solid ${({ type }) => (type === "error" ? "#f5c6cb" : "#c3e6cb")};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
`;

const ScrollablePostsContainer = styled.div`
  max-height: 600px;
  overflow-y: auto;
  padding-right: 10px;
  scrollbar-width: thin;
  scrollbar-color: #60a5fa transparent;

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #60a5fa;
    border-radius: 4px;
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

const MainArea = styled.div`
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

export default NavigationWrapper;
