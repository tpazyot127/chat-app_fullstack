import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Dashboard from '../Dashboard';
import { useChatActions, useTypedSelector } from '../../hooks';

jest.mock('../../hooks');

describe('Dashboard component', () => {
  test('renders the component', () => {
    const { getByText } = render(<Dashboard />);

    const headingElement = getByText(/GPT CHAT/i);
    expect(headingElement).toBeInTheDocument();
  });

  test('renders the loading state when loading is true', () => {
    (useTypedSelector as jest.Mock).mockReturnValue({ error: null, data: [], loading: true });

    const { getByText } = render(<Dashboard />);
    const loadingElement = getByText(/waiting for response/i);
    expect(loadingElement).toBeInTheDocument();
  });

  test('renders the error message when there is an error', () => {
    (useTypedSelector as jest.Mock).mockReturnValue({ error: { content: 'Error message' }, data: [], loading: false });

    const { getByText } = render(<Dashboard />);
    const errorElement = getByText(/oops! there seems to be an error/i);
    expect(errorElement).toBeInTheDocument();
  });

  test('renders the sign in message when accessToken is empty', () => {
    (useTypedSelector as jest.Mock).mockReturnValue({ error: null, data: [], loading: false });
    (useChatActions as jest.Mock).mockReturnValue({ createChat: jest.fn(), saveChat: jest.fn(), fetchChats: jest.fn() });

    const { getByText } = render(<Dashboard />);
    const signInElement = getByText(/you must signin first/i);
    expect(signInElement).toBeInTheDocument();
  });

  test('calls createChat when form is submitted', async () => {
    (useTypedSelector as jest.Mock).mockReturnValue({ error: null, data: [], loading: false });
    const mockCreateChat = jest.fn();
    (useChatActions as jest.Mock).mockReturnValue({ createChat: mockCreateChat, saveChat: jest.fn(), fetchChats: jest.fn() });

    const { getByPlaceholderText, getByRole } = render(<Dashboard />);
    const inputElement = getByPlaceholderText(/type your question/i);
    const submitButton = getByRole('button', { name: /send icon svg in input field/i });

    fireEvent.change(inputElement, { target: { value: 'Test question' } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockCreateChat).toHaveBeenCalledWith(expect.any(String), expect.any(String)));
  });
});