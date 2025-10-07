import React from "react";
import FollowingList from "../FollowingList/FollowingList";

const FollowingsSection = ({ userId, followings, onToggleFollow }) => {
  return (
    <FollowingList
      userId={userId}
      followings={followings}
      onToggleFollow={onToggleFollow}
    />
  );
};

export default FollowingsSection;
