import { renderHook } from '@testing-library/react-hooks';
import { useRouter } from 'next/router';
import { useTypedSelector } from '../';
import { useAuth } from '../useAuth';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../index');

describe('useAuth', () => {
  test('redirects to login page when user data is not available', () => {
    const routerPushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: routerPushMock });
    (useTypedSelector as jest.Mock).mockReturnValue({ data: null });

    renderHook(() => useAuth());

    expect(routerPushMock).toHaveBeenCalledWith('/login');
  });

  test('returns user data when available', () => {
    const userData = { name: 'John Doe', email: 'john.doe@example.com' };
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
    (useTypedSelector as jest.Mock).mockReturnValue({ data: userData });

    const { result } = renderHook(() => useAuth());

    expect(result.current).toBe(userData);
  });
});