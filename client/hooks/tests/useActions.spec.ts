import { renderHook } from '@testing-library/react-hooks';
import { useDispatch } from 'react-redux';
import { useUserActions, useChatActions } from '../useActions';
import { UserActionCreators, ChatActionCreators } from '../../redux';

jest.mock('react-redux');

const mockDispatch = jest.fn();

describe('useUserActions', () => {
  beforeEach(() => {
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns an object with bound action creators', () => {
    const { result } = renderHook(() => useUserActions());

    expect(result.current).toEqual(UserActionCreators);
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });
});

describe('useChatActions', () => {
  beforeEach(() => {
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns an object with bound action creators', () => {
    const { result } = renderHook(() => useChatActions());

    expect(result.current).toEqual(ChatActionCreators);
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });
});