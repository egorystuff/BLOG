import * as React from "react";
import { useState } from "react";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";

import { AppContext } from "../App";
import { useContext } from "react";
import { useDispatch } from "react-redux";

import { logout } from "../redux/slices/auth";

export default function BasicMenu() {
  const { fullName } = useContext(AppContext);

  const dispatch = useDispatch();

  const onClickLogout = () => {
    if (window.confirm("Вы действительно хотите выйти?")) {
      dispatch(logout());
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("_id");
      window.localStorage.removeItem("avatarUrl");
      window.localStorage.removeItem("fullName");
    }
  };

  const [auth, setAuth] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {auth && (
        <div>
          <IconButton
            size='small'
            aria-label='account of current user'
            aria-controls='menu-appbar'
            aria-haspopup='true'
            onClick={handleMenu}
            color='inherit'>
            <AccountCircle />
          </IconButton>
          <Menu
            id='menu-appbar'
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            keepMounted
            transformOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}>
            <Toolbar variant='dense' component='div'>
              {fullName}
            </Toolbar>
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>My account</MenuItem>
          </Menu>

          <IconButton
            onClick={onClickLogout}
            size='small'
            aria-label='account of current user'
            aria-controls='menu-appbar'
            aria-haspopup='true'
            color='inherit'>
            <LogoutIcon />
          </IconButton>
        </div>
      )}
    </>
  );
}
