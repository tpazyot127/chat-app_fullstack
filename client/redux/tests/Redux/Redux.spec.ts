import { renderHook } from '@testing-library/react-hooks';
import { useStore } from '../../store';

describe('useStore', () => {
  it('returns a store object', () => {
    const { result } = renderHook(() => useStore({}));

    expect(result.current).toBeDefined();
    expect(result.current.dispatch).toBeDefined();
    expect(result.current.getState).toBeDefined();
    expect(result.current.subscribe).toBeDefined();
  });
});