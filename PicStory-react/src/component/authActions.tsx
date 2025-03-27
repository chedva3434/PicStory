import { ThunkAction } from 'redux-thunk';
import { AnyAction } from 'redux';

// טיפוסי נתונים עבור Action
interface LoginRequestAction {
  type: 'LOGIN_REQUEST';
}

interface LoginSuccessAction {
  type: 'LOGIN_SUCCESS';
  payload: any; // אתה יכול להחליף ב-User Interface אם יש לך טיפוס למידע על המשתמש
}

interface LoginFailureAction {
  type: 'LOGIN_FAILURE';
  payload: string; // שגיאה אם יש
}

// כל ה-Actions יהיו מאוגדים
export type AuthActionTypes =
  | LoginRequestAction
  | LoginSuccessAction
  | LoginFailureAction;

// פעולה אסינכרונית עם Thunk
export const login = (
  username: string,
  password: string
): ThunkAction<void, any, unknown, AnyAction> => async (dispatch) => {
  try {
    dispatch({ type: 'LOGIN_REQUEST' });
    
    // שליחה ל-API (כמובן שהשורה הזאת היא דמוי-קוד)
    const response = await fetch('your-api-url', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    
    if (response.ok) {
      const user = await response.json();
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } else {
      throw new Error('Invalid credentials');
    }
  } catch (error: any) {
    dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
  }
};
