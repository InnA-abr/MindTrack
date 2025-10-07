import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import { followUser, unfollowUser } from "../api/followerService";
import { getUserById } from "../api/userService";
import { useAuth } from "../context/AuthContext";
import { fetchPostsByUser } from "../api/postService";
import PostList from "../components/Post/PostList";

import { BackgroundWrapper } from "../components/Account/AccountPageStyles";
// import { GlobalStyle } from "../components/Account/AccountPageStyles";
import { GlassCard } from "../components/Account/AccountPageStyles";

const UserPage = ({ onLike }) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [profileUser, setProfileUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userPosts, setUserPosts] = useState([]);

  const isMe = currentUser?.id === userId;

  const fetchUser = async () => {
    try {
      const data = await getUserById(userId);

      setProfileUser(data);
      setIsFollowing(!!data.followedBy?.find((u) => u._id === currentUser?.id));
    } catch (error) {
      console.error("Помилка при завантаженні профілю", error);
    }
  };

  const fetchPosts = async () => {
    try {
      const data = await fetchPostsByUser(userId);
      setUserPosts(data);
    } catch (error) {
      console.error("Error fetching posts by user", error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchPosts();
  }, [userId]);

  const handleToggleFollow = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(userId);
      } else {
        await followUser(userId);
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      alert("Не вдалося змінити статус підписки");
    }
  };

  if (!profileUser)
    return (
      <Wrapper>
        <p>Користувача не знайдено</p>
      </Wrapper>
    );

  return (
    <>
      <BackgroundWrapper>
        <GlassCard>
          <BackButtonTopRight onClick={() => navigate(-1)}>
            ← Назад
          </BackButtonTopRight>

          <ProfileHeader>
            <Avatar
              src={
                profileUser.avatarUrl ||
                "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
              }
              alt="Avatar"
            />

            <UserInfo>
              <UserName>
                {profileUser.firstName} {profileUser.lastName}
              </UserName>
              <UserEmail>{profileUser.email}</UserEmail>

              {!isMe && (
                <FollowButton
                  onClick={handleToggleFollow}
                  $following={isFollowing}
                >
                  {isFollowing ? "Відписатись" : "Підписатись"}
                </FollowButton>
              )}

              <ScrollablePostsContainer>
                <PostList
                  posts={userPosts}
                  user={currentUser}
                  onLike={onLike}
                />
              </ScrollablePostsContainer>
            </UserInfo>
          </ProfileHeader>
        </GlassCard>
      </BackgroundWrapper>
    </>
  );
};

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
`;

const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #60a5fa;
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.1);
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  align-items: center;
  text-align: center;
`;

const UserName = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 5px;
  color: #dbeafe;
`;

const UserEmail = styled.p`
  font-size: 0.9rem;
  color: #cbd5e1;
  margin-bottom: 10px;
`;

const FollowButton = styled.button`
  background-color: ${({ $following }) => ($following ? "#e4e6eb" : "#1877f2")};
  color: ${({ $following }) => ($following ? "#050505" : "#fff")};
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 0.9rem;
  font-weight: 100;
  cursor: pointer;

  &:hover {
    background-color: ${({ $following }) =>
      $following ? "#d8dadf" : "#166fe5"};
  }
`;

const BackButtonTopRight = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: transparent;
  border: none;
  color: #a9c5e8ff;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    color: white;
  }
`;

const Wrapper = styled.div`
  text-align: center;
  color: white;
  padding: 30px;
`;

const ScrollablePostsContainer = styled.div`
  max-height: 400px;
  overflow-y: auto;
  padding-right: 8px;

  scrollbar-width: thin;
  scrollbar-color: #60a5fa transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #60a5fa;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

export default UserPage;
