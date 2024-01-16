import Container from "@mui/material/Container";
import { Routes, Route } from "react-router-dom";

import { Header } from "./components";
import { Home, FullPost, Registration, AddPost, Login } from "./pages";
import { useDispatch } from "react-redux";
import { createContext, useEffect, useState } from "react";
import { fetchAuthMe } from "./redux/slices/auth";

export const AppContext = createContext(null);

function App() {
  const dispatch = useDispatch();

  const [avatarUrl, setAvatarUrl] = useState();
  const [fullName, setFullName] = useState();

  useEffect(() => {
    dispatch(fetchAuthMe());
    setAvatarUrl(window.localStorage.getItem("avatarUrl"));
    setFullName(window.localStorage.getItem("fullName"));
  }, []);

  return (
    <>
      <AppContext.Provider value={{ avatarUrl, fullName, setAvatarUrl, setFullName }}>
        <Header />
        <Container maxWidth='lg'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/posts/:id' element={<FullPost />} />
            <Route path='/posts/:id/edit' element={<AddPost />} />
            <Route path='/add-post' element={<AddPost />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Registration />} />
          </Routes>
        </Container>
      </AppContext.Provider>
    </>
  );
}

export default App;
