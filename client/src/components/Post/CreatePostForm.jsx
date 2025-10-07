import React, { useState, useRef } from "react";
import styled from "styled-components";
import { uploadImageToCloudinary } from "../../utils/uploadImageToCloudinary";

const CreatePostForm = ({ onCreate, onCancel, userId, authorName }) => {
  const [content, setContent] = useState("");
  const [imageUrls, setImageUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!content.trim()) newErrors.content = "Контент обов’язковий";
    return newErrors;
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setErrors((prev) => ({ ...prev, image: null }));

    try {
      const url = await uploadImageToCloudinary(file);
      setImageUrl(url);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        image: error.message || "Помилка завантаження",
      }));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newPost = {
      content,
      user: userId,
      imageUrls: imageUrls,
      createdAt: new Date().toISOString(),
    };

    onCreate(newPost);

    setContent("");
    setImageUrl(null);
    setErrors({});
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Label>
        Автор
        <AuthorName>{authorName || "Невідомий автор"}</AuthorName>
      </Label>

      <Label>
        <LabelButton htmlFor="image-upload" disabled={uploading}>
          Завантажити зображення
        </LabelButton>
        <FileInput
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          disabled={uploading}
          style={{ display: "none" }}
        />
        {errors.image && <ErrorText>{errors.image}</ErrorText>}

        {errors.image && <ErrorText>{errors.image}</ErrorText>}
      </Label>
      {uploading && <UploadingText>Завантаження зображення...</UploadingText>}

      {imageUrls && <ImagePreview src={imageUrls} alt="Preview" />}
      <Label>
        Контент
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Основний текст поста..."
          disabled={uploading}
        />
        {errors.content && <ErrorText>{errors.content}</ErrorText>}
      </Label>

      <ButtonsWrapper>
        <Button type="submit" disabled={uploading}>
          Створити пост
        </Button>
        <CancelButton type="button" onClick={onCancel} disabled={uploading}>
          Скасувати
        </CancelButton>
      </ButtonsWrapper>
    </Form>
  );
};

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: #f9f9f9;
  padding: 20px;
  border-radius: 12px;

  margin-bottom: 15px;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  font-weight: 500;
  color: #333;
`;

const AuthorName = styled.div`
  padding: 10px;
  background-color: #e0e0e0;
  border-radius: 8px;
  color: #333;
  font-weight: 600;
`;

const Textarea = styled.textarea`
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  resize: vertical;
  min-height: 100px;
  outline: none;
`;

const FileInput = styled.input`
  margin-top: 6px;
`;

const ImagePreview = styled.img`
  margin-top: 10px;
  max-width: 100%;
  max-height: 200px;
  border-radius: 12px;
  object-fit: contain;
`;

const UploadingText = styled.p`
  color: #666;
  font-style: italic;
  margin-top: 6px;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 10px;
`;

const Button = styled.button`
  padding: 12px;
  border-radius: 25px;
  border: none;
  background-color: #6598eaff;
  color: white;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background-color: #337ae3ff;
  }

  &:disabled {
    background-color: #9e9e9e;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  padding: 12px;
  border-radius: 25px;
  border: none;
  background-color: #d2716aff;
  color: white;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background-color: #d32f2f;
  }
`;

const ErrorText = styled.span`
  color: red;
  font-size: 0.9rem;
  margin-top: 4px;
`;

const LabelButton = styled.label`
  display: inline-block;
  padding: 10px 20px;
  background-color: #6598eaff;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  border-radius: 25px;
  cursor: pointer;
  user-select: none;
  text-align: center;
  width: fit-content;

  &:hover {
    background-color: #337ae3ff;
  }

  &:disabled {
    background-color: #9e9e9e;
    cursor: not-allowed;
  }
`;

export default CreatePostForm;
