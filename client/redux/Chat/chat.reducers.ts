import { ActionTypes } from "./chat.action-types";
import { ChatAction } from "./chat.actions";
import { ChatInitialState } from "./chat.initial-state";
import { ChatState } from "./chat.state";

export const chatReducer = (
  state: ChatState = ChatInitialState,
  action: ChatAction
): ChatState => {
  switch (action.type) {
    case ActionTypes.CREATE_CHAT:
      return { ...state, loading: true, error: null };

    case ActionTypes.CREATE_CHAT_SUCCESS:
      return { loading: false, data: action.payload, error: null };

    case ActionTypes.CREATE_CHAT_ERROR:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export const saveChatReducer = (
  state: ChatState = ChatInitialState,
  action: ChatAction
): ChatState => {
  switch (action.type) {
    case ActionTypes.SAVE_CHAT:
      return { ...state, loading: true, error: null };

    case ActionTypes.SAVE_CHAT_SUCCESS:
      return { loading: false, data: action.payload, error: null };

    case ActionTypes.SAVE_CHAT_ERROR:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export const fetchChatReducer = (
  state: ChatState = ChatInitialState,
  action: ChatAction
): ChatState => {
  switch (action.type) {
    case ActionTypes.FETCH_CHAT:
      return { ...state, loading: true, error: null };

    case ActionTypes.FETCH_CHAT_SUCCESS:
      return { loading: false, data: action.payload, error: null };

    case ActionTypes.FETCH_CHAT_ERROR:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
