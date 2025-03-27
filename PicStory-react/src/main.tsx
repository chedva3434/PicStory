import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux'; // יבוא של ה-Provider של Redux
import Header from './component/header.tsx';
import store from './component/store.tsx';
import Register from './component/register.tsx';
import Test from './component/test.tsx';
import Layout from './component/layout.tsx';
import Login from './component/login.tsx';
import AlbumManagement from './component/albumManagement .tsx';
import AlbumList from './component/albumList .tsx';
import HomePage from './component/home.tsx';

const Routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // השתמש ב-Layout
    children: [
      {
        path: "/",
        element: <HomePage /> // דף הבית ייטען כאן
      },
      {
        path: "register",
        element: <Register />
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "test",
        element: <Test />
      },
      {
        path: "album-management",
        element: <AlbumManagement />
      },
      {
        path: "album-list",
        element: <AlbumList />
      }
    ]
  }
]);


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={Routes} />
    </Provider>
  </StrictMode>
);
