import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Post from "./Post";
import { useAuth } from "../../context/AuthContext";
import * as commentService from "../../api/commentService";

jest.mock("../../utils/api", () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

jest.mock("../../context/AuthContext");
jest.mock("../../api/commentService");

const mockPost = {
  _id: "post1",
  content: "Тестовий пост",
  likes: [],
  user: {
    _id: "user1",
    firstName: "Іван",
    avatarUrl: null,
  },
};

const mockUser = {
  id: "user2",
  firstName: "Петро",
};

describe("Post component", () => {
  beforeEach(() => {
    useAuth.mockReturnValue({ token: "mock-token" });

    commentService.fetchCommentsForPost.mockResolvedValue([]);
    commentService.createComment.mockResolvedValue({
      id: "comment1",
      content: "Новий коментар",
      user: { id: "user2", firstName: "Петро" },
    });
  });

  it("рендерить пост і автора", async () => {
    render(
      <Post
        post={mockPost}
        user={mockUser}
        onLike={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByText("Тестовий пост")).toBeInTheDocument();
    expect(screen.getByText("Іван")).toBeInTheDocument();

    await waitFor(() =>
      expect(commentService.fetchCommentsForPost).toHaveBeenCalledWith("post1")
    );
  });

  it("додає коментар", async () => {
    render(
      <Post
        post={mockPost}
        user={mockUser}
        onLike={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    const input = screen.getByPlaceholderText("Напишіть коментар...");
    const button = screen.getByText("Коментувати");

    fireEvent.change(input, { target: { value: "Новий коментар" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(commentService.createComment).toHaveBeenCalledWith(
        "post1",
        "Новий коментар",
        "mock-token"
      );
      expect(screen.getByText("Новий коментар")).toBeInTheDocument();
    });
  });

  it("відображає кнопку видалення для автора поста", () => {
    const ownerUser = { id: "user1" };
    render(
      <Post
        post={mockPost}
        user={ownerUser}
        onLike={jest.fn()}
        onDelete={jest.fn()}
      />
    );
    expect(screen.getByText("🗑️")).toBeInTheDocument();
  });
});
