import { AlbumPostModel } from "../models/AlbumPostModel "
import axios from "axios";

// אקשנים ל-RDX
export const CREATE_ALBUM = "CREATE_ALBUM";
export const GET_ALBUMS = "GET_ALBUMS";
export const UPDATE_ALBUM = "UPDATE_ALBUM";
export const DELETE_ALBUM = "DELETE_ALBUM";
export const SET_LOADING = "SET_LOADING";
export const SET_ERROR = "SET_ERROR";

// אקשן להוספת אלבום
export const createAlbum = (album: AlbumPostModel) => async (dispatch: any) => {
  try {
    dispatch({ type: SET_LOADING, payload: true });
    const response = await axios.post("/api/albums", album);
    dispatch({
      type: CREATE_ALBUM,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: SET_ERROR,
      payload: "הייתה שגיאה בהוספת האלבום",
    });
  } finally {
    dispatch({ type: SET_LOADING, payload: false });
  }
};

// אקשן לקבלת כל האלבומים
export const getAlbums = () => async (dispatch: any) => {
  try {
    dispatch({ type: SET_LOADING, payload: true });
    const response = await axios.get("/api/albums");
    dispatch({
      type: GET_ALBUMS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: SET_ERROR,
      payload: "הייתה שגיאה בקבלת האלבומים",
    });
  } finally {
    dispatch({ type: SET_LOADING, payload: false });
  }
};

// אקשן לעדכון אלבום
export const updateAlbum = (userId: number, album: AlbumPostModel) => async (dispatch: any) => {
  try {
    dispatch({ type: SET_LOADING, payload: true });
    const response = await axios.put(`/api/albums/${userId}`, album);
    dispatch({
      type: UPDATE_ALBUM,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: SET_ERROR,
      payload: "הייתה שגיאה בעדכון האלבום",
    });
  } finally {
    dispatch({ type: SET_LOADING, payload: false });
  }
};

// אקשן למחיקת אלבום
export const deleteAlbum = (albumId: number) => async (dispatch: any) => {
  try {
    dispatch({ type: SET_LOADING, payload: true });
    await axios.delete(`/api/albums/${albumId}`);
    dispatch({
      type: DELETE_ALBUM,
      payload: albumId,
    });
  } catch (error) {
    dispatch({
      type: SET_ERROR,
      payload: "הייתה שגיאה במחיקת האלבום",
    });
  } finally {
    dispatch({ type: SET_LOADING, payload: false });
  }
};
