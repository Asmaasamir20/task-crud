import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import DeskTop from './Compoment/DeskTop/DeskTop';
import MasterLayaut from './Compoment/MasterLayaut/MasterLayaut';
import Users from './Compoment/Users/Users';
import { ToastContainer } from 'react-toastify';
import UpdateUser from './Compoment/UpdateUser/UpdateUser';

function App() {
  let routes = createBrowserRouter([
    {
      path: '/contact',
      element: <MasterLayaut />
    },
    {
      index: true,
      element: <DeskTop />
    },
    {
      path: '/new',
      element: <Users />
    },
    {
      path: '/upbate/:id',
      element: <UpdateUser />
    }
  ]);
  return (
    <>
      <RouterProvider router={routes} />
      <ToastContainer theme={'colored'} autoClose={1000} />
    </>
  );
}

export default App;
