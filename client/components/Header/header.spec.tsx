import { act, render, screen } from '@testing-library/react';
import { useRouter } from 'next/router';
import { useTypedSelector, useUserActions } from '../../hooks';
import Header from '../Header';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../../hooks', () => ({
  useTypedSelector: jest.fn(),
  useUserActions: jest.fn(),
}));

describe('Header', () => {
  const mockUseTypedSelector = useTypedSelector as jest.Mock;
  const mockUseUserActions = useUserActions as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the component', async () => {
    mockUseTypedSelector.mockReturnValue({ data: null });
    mockUseUserActions.mockReturnValue({ logout: jest.fn() });
    (useRouter as jest.Mock).mockReturnValue({});

    await act(async () => {
      render(<Header />);
    });

    expect(screen.getByText('GPT CHAT')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  test('renders the component with user data', async () => {
    mockUseTypedSelector.mockReturnValue({ data: { name: 'John Doe', isAdmin: false } });
    const mockLogout = jest.fn();
    mockUseUserActions.mockReturnValue({ logout: mockLogout });
    (useRouter as jest.Mock).mockReturnValue({});

    await act(async () => {
      render(<Header />);
    });

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });
});