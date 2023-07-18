import { login, getCurrentUser } from '../../User/user.action-creators';
import { ActionTypes } from '../../User/user.action-types';
import { api } from '../../../lib';
import Router from 'next/router';

describe('login thunk', () => {
  jest.mock('next/router', () => ({
    push: jest.fn(),
  }));

  
  
  const dispatch = jest.fn();
  const email = 'test@example.com';
  const password = 'password';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('dispatches USER_LOGIN_START action', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ data: {} });

    await login(email, password)(dispatch);

    expect(dispatch).toHaveBeenCalledWith({
      type: ActionTypes.USER_LOGIN_START,
    });
  });

  describe('login thunk', () => {
    const dispatch = jest.fn();
    const email = 'test@example.com';
    const password = 'password';
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('calls api.post with correct arguments', async () => {
      (api.post as jest.MockedFunction<typeof api.post>).mockResolvedValueOnce({ data: {} });
  
      await login(email, password)(dispatch);
  
      expect(api.post).toHaveBeenCalledWith('/login', { email, password });
    });
  });

  it('dispatches USER_LOGIN_SUCCESS and GET_CURRENT_USER_SUCCESS actions on successful login', async () => {
    const mockData = { accessToken: 'mockAccessToken', user: { name: 'Test User' } };
    api.post = jest.fn().mockResolvedValueOnce({ data: mockData });

    await login(email, password)(dispatch);

    expect(dispatch).toHaveBeenCalledWith({
      type: ActionTypes.USER_LOGIN_SUCCESS,
      payload: mockData,
    });

    expect(dispatch).toHaveBeenCalledWith({
      type: ActionTypes.GET_CURRENT_USER_SUCCESS,
      payload: mockData,
    });

    expect(localStorage.setItem).toHaveBeenCalledWith('accessToken', JSON.stringify(mockData.accessToken));
    expect(localStorage.setItem).toHaveBeenCalledWith('userDatas', JSON.stringify(mockData));
    expect(Router.push).toHaveBeenCalledWith('/');
  });

  it('dispatches USER_LOGIN_ERROR action on failed login', async () => {
    const mockError = { response: { data: { message: 'Invalid credentials' } } } as any;
    api.post = jest.fn().mockRejectedValueOnce(mockError);

    await login(email, password)(dispatch);

    expect(dispatch).toHaveBeenCalledWith({
      type: ActionTypes.USER_LOGIN_ERROR,
      payload: mockError.response,
    });
  });
});