import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-dom/test-utils';
import { useLocalStorage } from '../useLocalStorage';

describe('useLocalStorage', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('returns the default value when the key is not in localStorage', () => {
    const key = 'test-key';
    const defaultValue = 'test-value';
    const { result } = renderHook(() => useLocalStorage(defaultValue, key));
    expect(result.current).toBe(defaultValue);
  });

  it('returns the value from localStorage when the key is present', () => {
    const key = 'test-key';
    const defaultValue = 'test-value';
    localStorage.setItem(key, 'stored-value');
    const { result } = renderHook(() => useLocalStorage(defaultValue, key));
    expect(result.current).toBe('stored-value');
  });

  it('updates the value in localStorage when the value changes', () => {
    const key = 'test-key';
    const defaultValue = 'test-value';
    const { result } = renderHook(() => useLocalStorage(defaultValue, key));
    act(() => {
      result.current[1]('new-value');
    });
    expect(localStorage.getItem(key)).toBe('new-value');
  });
});