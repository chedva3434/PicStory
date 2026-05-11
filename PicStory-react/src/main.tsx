import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux'; // יבוא של ה-Provider של Redux
import store from './component/store.tsx';
import Layout from './component/layout.tsx';
import HomePage from './component/home.tsx';
import Login from './component/login.tsx';
import Register from './component/register.tsx';
import AlbumList from './component/albumList .tsx';
import PhotosGallery from './component/photo.tsx';
import SharedAlbumsList from './component/SharedAlbumsList.tsx';
import SharedWithMeAlbums from './component/sharedAlbumsWithMe.tsx';
import AlbumView from './component/albumView.tsx';
import GifSlideshowPage from './component/gifSlideshowPage.tsx';


const router  = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, 
    children: [
      {
        path: "/",
        element: <HomePage /> 
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
        path: "album-list",
        element: <AlbumList />
      },
      {
        path: "/:albumId",
        element: <PhotosGallery  />
      },
      {
        path: "/album-list/:id",
        element: <PhotosGallery />
      },
      {
        path:"/share-album/:albumId",
        element: <SharedAlbumsList/>
      },
      {
        path:"/shared-with-me" ,
        element: <SharedWithMeAlbums/>
      },
      {
        path:"/album-view/:albumId" ,
        element: <AlbumView/>
      },
      {
        path: "/gif-slideshow",
        element: <GifSlideshowPage />
      }
    ]
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router } />
    </Provider>
  </StrictMode>
);
