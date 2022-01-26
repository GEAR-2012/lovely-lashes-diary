import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { openLoginModal, logoutUser, alertOpen } from "../../redux";
import { Button, Divider, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { makeStyles } from "@mui/styles";
import CottageIcon from "@mui/icons-material/Cottage";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";

const useStyles = makeStyles((theme) => ({
  header: {
    width: "100%",
    padding: "1rem 0",
    display: "grid",
    gap: "1.2rem",
    alignItems: "center",
    justifyItems: "center",
    gridTemplateColumns: "auto auto 1fr auto",
    gridTemplateRows: "auto",
    gridTemplateAreas: "'home title welcome logout'",
    [theme.breakpoints.down("md")]: {
      gap: "1rem",
      gridTemplateColumns: "1fr auto 1fr",
      gridTemplateRows: "auto auto",
      gridTemplateAreas: "'title title title' 'home welcome logout'",
    },
    [theme.breakpoints.down("sm")]: {
      gap: "0.6rem",
      gridTemplateColumns: "auto auto",
      gridTemplateRows: "auto auto auto",
      gridTemplateAreas: "'title title' 'welcome welcome' 'home logout'",
    },
  },
  homeBtn: {
    gridArea: "home",
    [theme.breakpoints.down("sm")]: {
      justifySelf: "start",
    },
  },
  mainTitle: {
    gridArea: "title",
    textDecoration: "none",
    color: theme.palette.text.primary,
    lineHeight: 1,
    fontSize: "2.8rem",
    fontWeight: 100,
    [theme.breakpoints.down("md")]: {
      fontSize: "2.8rem",
    },
    [theme.breakpoints.down("sm")]: {
      lineHeight: 1.6,
      fontSize: "2rem",
    },
  },
  welcomeText: {
    gridArea: "welcome",
    lineHeight: 1,
    fontSize: "1.2rem",
    fontWeight: 100,
    fontStyle: "italic",
    justifySelf: "end",
    [theme.breakpoints.down("md")]: {
      justifySelf: "unset",
      fontSize: "1.6rem",
    },
    [theme.breakpoints.down("sm")]: {
      justifySelf: "unset",
      fontSize: "1rem",
    },
  },
  logoutBtn: {
    gridArea: "logout",
    [theme.breakpoints.down("sm")]: {
      justifySelf: "end",
    },
  },
  icon: {
    fontSize: "medium",
  },
}));

const Header = ({ userData, openLoginModal, logoutUser, alertOpen }) => {
  const classes = useStyles();
  const navigate = useNavigate();

  // display error if any while userData loading
  useEffect(() => {
    if (userData.error) {
      alertOpen({
        severity: "error",
        message: userData.error,
      });
    }
  }, [userData, alertOpen]);

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <Grid item xs={12}>
      <Box className={classes.header}>
        <Link to="/" className={classes.homeBtn}>
          <CottageIcon fontSize="large" color="primary" />
        </Link>
        <Typography className={classes.mainTitle} variant="h2">
          Lovely Lashes Diary
        </Typography>
        {userData.user && (
          <Typography className={classes.welcomeText} variant="subtitle1">
            {userData.user.emailVerified
              ? `Welcome back ${userData.user.displayName}`
              : `Welcome ${userData.user.displayName}! Your email is not verified yet.`}
          </Typography>
        )}
        {!userData.user && (
          <Button className={classes.logoutBtn} type="button" onClick={openLoginModal} variant="contained">
            <LoginIcon className={classes.icon} />
          </Button>
        )}
        {userData.user && (
          <Button
            className={classes.logoutBtn}
            disabled={userData.loading}
            type="button"
            onClick={handleLogout}
            variant="contained"
          >
            <LogoutIcon className={classes.icon} />
          </Button>
        )}
      </Box>
      <Divider />
    </Grid>
  );
};

const mapStateToProps = (state) => {
  return {
    userData: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    openLoginModal: () => dispatch(openLoginModal()),
    //
    logoutUser: () => dispatch(logoutUser()),
    //
    alertOpen: (inp) => dispatch(alertOpen(inp)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
