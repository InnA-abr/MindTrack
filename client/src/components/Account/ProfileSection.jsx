import React, { useState } from "react";
import styled from "styled-components";
import { useFormik } from "formik";
import { uploadImageToCloudinary } from "../../utils/uploadImageToCloudinary";

const ProfileSection = ({ user: propUser, editMode, onSave, onEditClick }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const placeholderAvatar =
    "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";
  const user = propUser || {};
  const formik = useFormik({
    initialValues: {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      avatarUrl: user.avatarUrl || "",
    },
    onSubmit: async (values) => {
      await onSave(values);
    },
  });

  const handleAvatarFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setPreviewUrl(URL.createObjectURL(file));

    try {
      const uploadedUrl = await uploadImageToCloudinary(file);
      formik.setFieldValue("avatarUrl", uploadedUrl);
    } catch (error) {
      alert("Помилка завантаження аватарки");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };
  const avatarSrc = editMode
    ? previewUrl || formik.values.avatarUrl || placeholderAvatar
    : user.avatarUrl || placeholderAvatar;

  return (
    <ProfileHeader>
      <Avatar src={avatarSrc} alt="Аватар" />

      <UserInfo>
        {editMode ? (
          <form onSubmit={formik.handleSubmit}>
            <input
              name="firstName"
              type="text"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              placeholder="Ім'я"
            />
            <input
              name="lastName"
              type="text"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              placeholder="Прізвище"
            />
            <UploadButton
              type="button"
              disabled={isUploading}
              onClick={() => document.getElementById("avatar-upload").click()}
            >
              Завантажити аватар
            </UploadButton>

            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarFileChange}
              disabled={isUploading}
              style={{ display: "none" }}
            />

            <Button
              type="submit"
              disabled={
                isUploading ||
                !formik.values.avatarUrl ||
                formik.values.avatarUrl.startsWith("blob:")
              }
            >
              Зберегти
            </Button>
          </form>
        ) : (
          <>
            <UserName>
              {user.firstName} {user.lastName}
            </UserName>
            <UserEmail>{user.email}</UserEmail>

            <UserStats>
              <span>{user.followedBy?.length || 0} підписників</span>
              <span>{user.posts?.length || 0} постів</span>
              <span>{user.awards?.length || 0} досягнень</span>
            </UserStats>

            <Button onClick={onEditClick}>Редагувати профіль</Button>
          </>
        )}
      </UserInfo>
    </ProfileHeader>
  );
};

export default ProfileSection;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 30px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background-color: rgba(255, 255, 255, 0.02);
  gap: 25px;

  @media (max-width: 480px) {
    flex-direction: column;
    text-align: center;
  }
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
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;

  input {
    padding: 10px;
    width: 100%;
    margin-bottom: 15px;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 1rem;
  }
`;

const UploadButton = styled.button`
  padding: 10px;
  width: 100%;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  text-align: left;

  &:hover {
    background: #f0f0f0;
  }

  &:disabled {
    background: #eee;
    cursor: not-allowed;
  }
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

const UserStats = styled.div`
  display: flex;
  gap: 20px;
  font-size: 0.95rem;
  color: #e2e8f0;
  font-weight: 500;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Button = styled.button`
  background-color: #415676ff;
  color: white;
  padding: 10px 18px;
  margin-top: 15px;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #595b5fff;
  }

  &:disabled {
    background-color: gray;
    cursor: not-allowed;
  }

  &:focus {
    outline: none;
    border: 2px solid #60a5fa;
  }
`;

const UploadingText = styled.div`
  color: #fbbf24;
  font-size: 0.9rem;
  margin-bottom: 10px;
`;
