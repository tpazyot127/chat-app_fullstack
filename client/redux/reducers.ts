import { combineReducers } from 'redux';
import {
  chatReducer, fetchChatReducer, saveChatReducer,
} from './Chat/chat.reducers'; 

import {
  userDetailsReducer,
  userEditReducer,
  userLoginReducer,
  userRegisterReducer,
  usersReducer,
  userUpdateReducer,
} from './User/user.reducers';

export const reducers = combineReducers({
  chat: chatReducer,
  chatMessages : fetchChatReducer,
  saveChat : saveChatReducer,
  user: userDetailsReducer,
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userUpdate: userUpdateReducer,
  userEdit: userEditReducer,
  users: usersReducer,
});

export type RootState = ReturnType<typeof reducers>;
