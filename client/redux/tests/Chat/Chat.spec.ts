import { api } from '../../../lib';
import { ActionTypes } from '../../Chat/chat.action-types';
import { createChat, fetchChats, saveChat } from '../../Chat/chat.action-creators';

jest.mock('../../lib/api');

const mockedApi = jest.mocked(api);

describe('fetchChats', () => {
  const accessToken = 'testAccessToken';
  const dispatch = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
    dispatch.mockClear();
  });

  it('dispatches FETCH_CHAT and FETCH_CHAT_SUCCESS on successful fetch', async () => {
    const mockResponse = {
      data: [{ id: 'testId', message: 'testMessage' }],
    };

    mockedApi.get.mockResolvedValue(mockResponse);

    await fetchChats(accessToken)(dispatch);

    expect(dispatch).toHaveBeenCalledWith({
      type: ActionTypes.FETCH_CHAT,
    });

    expect(mockedApi.get).toHaveBeenCalledWith('/gpt/question', {
      headers: { Authorization: `Bearer ${accessToken}` },
      withCredentials: true,
    });

    expect(dispatch).toHaveBeenCalledWith({
      type: ActionTypes.FETCH_CHAT_SUCCESS,
      payload: mockResponse.data,
    });
  });

  it('dispatches FETCH_CHAT and FETCH_CHAT_ERROR on failed fetch', async () => {
    const mockError = {
      response: {
        data: {
          message: 'Failed to fetch chats',
        },
      },
    };

    mockedApi.get.mockRejectedValue(mockError);

    await fetchChats(accessToken)(dispatch);

    expect(dispatch).toHaveBeenCalledWith({
      type: ActionTypes.FETCH_CHAT,
    });

    expect(mockedApi.get).toHaveBeenCalledWith('/gpt/question', {
      headers: { Authorization: `Bearer ${accessToken}` },
      withCredentials: true,
    });

    expect(dispatch).toHaveBeenCalledWith({
      type: ActionTypes.FETCH_CHAT_ERROR,
      payload: mockError.response,
    });
  });
});

describe('createChat', () => {
  const accessToken = 'testAccessToken';
  const context = 'testContext';
  const dispatch = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
    dispatch.mockClear();
  });

  it('dispatches CREATE_CHAT and CREATE_CHAT_SUCCESS on successful create', async () => {
    const mockResponse = {
      data: { id: 'testId', message: 'testMessage' },
    };

    mockedApi.post.mockResolvedValue(mockResponse);

    await createChat(context, accessToken)(dispatch);

    expect(dispatch).toHaveBeenCalledWith({
      type: ActionTypes.CREATE_CHAT,
    });

    expect(mockedApi.post).toHaveBeenCalledWith(
      '/gpt/chat',
      { context },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      }
    );

    expect(dispatch).toHaveBeenCalledWith({
      type: ActionTypes.CREATE_CHAT_SUCCESS,
      payload: mockResponse.data,
    });
  });

  it('dispatches CREATE_CHAT and CREATE_CHAT_ERROR on failed create', async () => {
    const mockError = {
      response: {
        data: {
          message: 'Failed to create chat',
        },
      },
    };

    mockedApi.post.mockRejectedValue(mockError);

    await createChat(context, accessToken)(dispatch);

    expect(dispatch).toHaveBeenCalledWith({
      type: ActionTypes.CREATE_CHAT,
    });

    expect(mockedApi.post).toHaveBeenCalledWith(
      '/gpt/chat',
      { context },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      }
    );

    expect(dispatch).toHaveBeenCalledWith({
      type: ActionTypes.CREATE_CHAT_ERROR,
      payload: mockError,
    });
  });
});

describe('saveChat', () => {
  const accessToken = 'testAccessToken';
  const context = 'testContext';
  const dispatch = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
    dispatch.mockClear();
  });

  it('dispatches CREATE_CHAT and CREATE_CHAT_SUCCESS on successful save', async () => {
    const mockResponse = {
      data: { id: 'testId', message: 'testMessage' },
    };

    mockedApi.put.mockResolvedValue(mockResponse);

    await saveChat(context, accessToken)(dispatch);

    expect(dispatch).toHaveBeenCalledWith({
      type: ActionTypes.CREATE_CHAT,
    });

    expect(mockedApi.put).toHaveBeenCalledWith(
      '/gpt/chats',
      { context },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      }
    );

    expect(dispatch).toHaveBeenCalledWith({
      type: ActionTypes.CREATE_CHAT_SUCCESS,
      payload: mockResponse.data,
    });
  });

  it('dispatches CREATE_CHAT and CREATE_CHAT_ERROR on failed save', async () => {
    const mockError = {
      response: {
        data: {
          message: 'Failed to save chat',
        },
      },
    };

    mockedApi.put.mockRejectedValue(mockError);

    await saveChat(context, accessToken)(dispatch);

    expect(dispatch).toHaveBeenCalledWith({
      type: ActionTypes.CREATE_CHAT,
    });

    expect(mockedApi.put).toHaveBeenCalledWith(
      '/gpt/chats',
      { context },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      }
    );

    expect(dispatch).toHaveBeenCalledWith({
      type: ActionTypes.CREATE_CHAT_ERROR,
      payload: mockError,
    });
  });
});