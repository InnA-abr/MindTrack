import React from "react";
import styled from "styled-components";
import Post from "./Post";

const PostList = ({ posts, onLike, onDelete, user }) => {
  return (
    <PostsContainer>
      {posts.map((post, index) => (
        <Post
          key={post._id || post.id || index}
          post={post}
          onLike={onLike}
          onDelete={onDelete}
          user={user}
        />
      ))}
    </PostsContainer>
  );
};

const PostsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export default PostList;
