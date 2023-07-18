import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import Login from "../Login";
import { useTypedSelector, useUserActions } from "../../hooks";

jest.mock("../../hooks", () => ({
  useTypedSelector: jest.fn(),
  useUserActions: jest.fn(),
}));

describe("Login", () => {
  const loginMock = jest.fn();
  const useTypedSelectorMock = useTypedSelector as jest.Mock;
  const useUserActionsMock = useUserActions as jest.Mock;

  beforeEach(() => {
    useTypedSelectorMock.mockReturnValue({
      loading: false,
      error: null,
    });
    useUserActionsMock.mockReturnValue({
      login: loginMock,
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("renders the login form", async () => {
      render(<Login />);

    expect(screen.getByText("Sign In")).toBeInTheDocument();
    expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
    expect(screen.getByText("New Customer?")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Register" })).toBeInTheDocument();
  });

  it("calls the login function with the email and password when the form is submitted", async () => {
      render(<Login />);

    const emailInput = screen.getByLabelText("Email Address");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: "Sign In" });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    expect(loginMock).toHaveBeenCalledWith("test@example.com", "password123");
  });

  it("does not call the login function when the form is submitted with an empty email and password", async () => {
      render(<Login />);

    const submitButton = screen.getByRole("button", { name: "Sign In" });

    fireEvent.click(submitButton);

    expect(loginMock).not.toHaveBeenCalled();
  });

  it("does not call the login function when there is an error", async () => {
    useTypedSelectorMock.mockReturnValue({
      loading: false,
      error: "Invalid email or password",
    });

      render(<Login />);

    const emailInput = screen.getByLabelText("Email Address");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: "Sign In" });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    expect(loginMock).not.toHaveBeenCalled();
  });

  it("shows a loader when loading is true", async () => {
    useTypedSelectorMock.mockReturnValue({
      loading: true,
      error: null,
    });

      render(<Login />);

    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("shows an error message when there is an error", async () => {
    useTypedSelectorMock.mockReturnValue({
      loading: false,
      error: "Invalid email or password",
    });

      render(<Login />);

    expect(screen.getByText("Invalid email or password")).toBeInTheDocument();
  });
});
