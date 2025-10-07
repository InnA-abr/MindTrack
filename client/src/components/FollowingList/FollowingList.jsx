import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../context/AuthContext";

const ListWrapper = styled.div`
  background: #fff;
  padding: 15px;
  border-radius: 8px;
`;

const FollowerItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;

const UserLink = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #1c1e21;

  &:hover {
    color: #1877f2;
  }
`;

const Avatar = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  object-fit: cover;
`;

const Username = styled.span`
  margin-left: 12px;
  font-weight: 500;
`;

const FollowBtn = styled.button`
  background-color: ${({ $following }) => ($following ? "#e4e6eb" : "#1877f2")};
  color: ${({ $following }) => ($following ? "#050505" : "#fff")};
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: ${({ $following }) =>
      $following ? "#d8dadf" : "#166fe5"};
  }
`;

const FollowingList = ({ followings, onToggleFollow }) => {
  const { user } = useAuth();

  if (!followings || followings.length === 0)
    return <p>У вас поки немає підписок</p>;

  return (
    <ListWrapper>
      {followings.map((following) => {
        const isMe = user?.id === following.id;

        return (
          <FollowerItem key={following.id}>
            <UserLink to={`/user/${following.id}`}>
              <Avatar
                src={following.avatarUrl || "/default-avatar.png"}
                alt={`Аватар ${following.username}`}
              />
              <Username>
                {following.firstName} {following.lastName}
              </Username>
            </UserLink>

            {!isMe && (
              <FollowBtn
                $following={true}
                onClick={() => onToggleFollow(following.id, true)}
              >
                Відписатись
              </FollowBtn>
            )}
          </FollowerItem>
        );
      })}
    </ListWrapper>
  );
};

export default FollowingList;
