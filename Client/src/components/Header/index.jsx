import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";

import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";

import styles from "./Header.module.scss";
import Container from "@mui/material/Container";
import { Link } from "react-router-dom";
import { logout, selectIsAuth } from "../../redux/slices/auth";
import { AppContext } from "../../App";
import BasicMenu from "../BasicMenu";

export const Header = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);

  const { avatarUrl } = useContext(AppContext);

  const onClickLogout = () => {
    if (window.confirm("Вы действительно хотите выйти?")) {
      dispatch(logout());
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("_id");
      window.localStorage.removeItem("avatarUrl");
      window.localStorage.removeItem("fullName");
    }
  };

  return (
    <div className={styles.root}>
      <Container maxWidth='lg'>
        <div className={styles.inner}>
          <Link className={styles.logo} to='/'>
            <div>Egorystuff's BLOG</div>
          </Link>
          <div className={styles.buttons}>
            {window.localStorage.getItem("token") || isAuth ? (
              <>
                <Stack direction='row' spacing={2}>
                  <Link to='/add-post'>
                    <Button variant='contained'>Написать статью</Button>
                  </Link>

                  <Avatar sx={{ width: 36, height: 36 }} alt='Remy Sharp' src={avatarUrl} />
                  <BasicMenu />
                </Stack>
              </>
            ) : (
              <>
                <Link to='/register'>
                  <Button variant='contained'>Создать аккаунт</Button>
                </Link>
                <Link to='/login'>
                  <Button variant='outlined'>Войти</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
