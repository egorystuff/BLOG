import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";

import styles from "./Header.module.scss";
import Container from "@mui/material/Container";
import { Link } from "react-router-dom";
import { logout, selectIsAuth } from "../../redux/slices/auth";

export const Header = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);

  let avatarUrl = window.localStorage.getItem("avatarUrl");
  let fullName = window.localStorage.getItem("fullName");

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
                  <Avatar sx={{ width: 36, height: 36 }} alt='Remy Sharp' src={avatarUrl} />
                  <div>{fullName}</div>
                  <Link to='/add-post'>
                    <Button variant='contained'>Написать статью</Button>
                  </Link>

                  <Button onClick={onClickLogout} variant='contained' color='error'>
                    Выйти
                  </Button>
                </Stack>
              </>
            ) : (
              <>
                <Link to='/login'>
                  <Button variant='outlined'>Войти</Button>
                </Link>
                <Link to='/register'>
                  <Button variant='contained'>Создать аккаунт</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
