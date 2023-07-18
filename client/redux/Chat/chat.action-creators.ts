import Router from "next/router";
import { Dispatch } from "redux";
import { api } from "../../lib";
import { ActionTypes } from "./chat.action-types";
import { ChatAction } from "./chat.actions";

export const fetchChat =
  (id: string) => async (dispatch: Dispatch<ChatAction>) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };
    try {
      dispatch({
        type: ActionTypes.FETCH_CHAT,
      });
      const { data } = await api.get(`/gpt/question/${id}`, config);

      dispatch({
        type: ActionTypes.FETCH_CHAT_SUCCESS,
        payload: data,
      });
    } catch (error: any) {
      dispatch({
        type: ActionTypes.FETCH_CHAT_ERROR,
        payload: error.response,
      });
    }
  };

export const createChat =
  (context: string) => async (dispatch: Dispatch<ChatAction>) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };
    console.log("context", context);

    try {
      dispatch({
        type: ActionTypes.CREATE_CHAT,
      });
      const { data } = await api.post(`/gpt/chat`, { context }, config);

      dispatch({
        type: ActionTypes.CREATE_CHAT_SUCCESS,
        payload: data,
      });
    } catch (error: any) {
      dispatch({
        type: ActionTypes.CREATE_CHAT_ERROR,
        payload: error,
      });
    }
  };

export const saveChat =
  (context: string, email: string, id: string) =>
  async (dispatch: Dispatch<ChatAction>) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };
    try {
      dispatch({
        type: ActionTypes.CREATE_CHAT,
      });
      const { data } = await api.put(
        `/gpt/chats/${id}`,
        { context: context, email: email },
        config
      );

      dispatch({
        type: ActionTypes.CREATE_CHAT_SUCCESS,
        payload: data,
      });
    } catch (error: any) {
      dispatch({
        type: ActionTypes.CREATE_CHAT_ERROR,
        payload: error,
      });
    }
  };
