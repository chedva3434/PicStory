import './App.css'
import { UserProvider } from './useContext';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <>     
    <UserProvider>
      <>     
        <Outlet /> 
      </>
     </UserProvider>
    </>
  );
}

export default App
