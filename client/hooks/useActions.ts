import { bindActionCreators } from 'redux';
import { useDispatch } from 'react-redux';
import { useMemo } from 'react';
import {
  UserActionCreators,
  ChatActionCreators,
} from '../redux';

export const useUserActions = () => {
  const dispatch = useDispatch();

  return useMemo(() => {
    return bindActionCreators(UserActionCreators, dispatch);
  }, [dispatch]);
};

export const useChatActions = () => {
  const dispatch = useDispatch();

  return useMemo(() => {
    return bindActionCreators(ChatActionCreators, dispatch);
  }, [dispatch]);
};