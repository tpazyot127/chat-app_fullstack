import { ActionTypes } from './chat.action-types';

export type ChatAction =
  | FetchChatStart
  | FetchChatSuccess
  | FetchChatError
  | SaveChatStart
  | SaveChatSuccess
  | SaveChatError
  | CreateChatStart
  | CreateChatSuccess
  | CreateChatError

export interface FetchChatStart {
  type: ActionTypes.FETCH_CHAT;
}

export interface FetchChatSuccess {
  type: ActionTypes.FETCH_CHAT_SUCCESS;
  payload: [];
}

export interface FetchChatError {
  type: ActionTypes.FETCH_CHAT_ERROR;
  payload: string;
}

export interface SaveChatStart {
  type: ActionTypes.SAVE_CHAT;
}

export interface SaveChatSuccess {
  type: ActionTypes.SAVE_CHAT_SUCCESS;
  payload: [];
}

export interface SaveChatError {
  type: ActionTypes.SAVE_CHAT_ERROR;
  payload: string;
}

export interface CreateChatStart {
  type: ActionTypes.CREATE_CHAT;
}

export interface CreateChatSuccess {
  payload: [];
  type: ActionTypes.CREATE_CHAT_SUCCESS;
}

export interface CreateChatError {
  type: ActionTypes.CREATE_CHAT_ERROR;
  payload: string;
}

