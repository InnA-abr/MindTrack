import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CreatePostForm from "./CreatePostForm";

jest.mock("../../utils/uploadImageToCloudinary", () => ({
  uploadImageToCloudinary: jest.fn(() =>
    Promise.resolve("https://mocked.url/image.jpg")
  ),
}));

describe("🧪 CreatePostForm Integration", () => {
  const mockOnCreate = jest.fn();
  const mockOnCancel = jest.fn();

  const setup = () => {
    render(
      <CreatePostForm
        onCreate={mockOnCreate}
        onCancel={mockOnCancel}
        userId="123"
        authorName="Test User"
      />
    );
  };

  beforeEach(() => {
    mockOnCreate.mockReset();
    mockOnCancel.mockReset();
  });

  test("renders form elements", () => {
    setup();

    expect(screen.getByText("Автор")).toBeInTheDocument();
    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("Контент")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Основний текст поста/i)
    ).toBeInTheDocument();
    expect(screen.getByText("Створити пост")).toBeInTheDocument();
    expect(screen.getByText("Скасувати")).toBeInTheDocument();
  });

  test("shows error when content is empty", () => {
    setup();

    fireEvent.click(screen.getByText("Створити пост"));

    expect(screen.getByText("Контент обов’язковий")).toBeInTheDocument();
    expect(mockOnCreate).not.toHaveBeenCalled();
  });

  test("submits with valid content", async () => {
    setup();

    fireEvent.change(screen.getByPlaceholderText(/Основний текст поста/i), {
      target: { value: "Це тестовий пост" },
    });

    fireEvent.click(screen.getByText("Створити пост"));

    expect(mockOnCreate).toHaveBeenCalledTimes(1);
    expect(mockOnCreate.mock.calls[0][0]).toMatchObject({
      content: "Це тестовий пост",
      user: "123",
    });

    expect(screen.getByPlaceholderText(/Основний текст поста/i).value).toBe("");
  });

  test("cancel button works", () => {
    setup();

    fireEvent.click(screen.getByText("Скасувати"));

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });
});
