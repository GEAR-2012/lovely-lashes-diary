import { Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React from "react";

const useStyles = makeStyles((theme) => ({
  grid: {
    display: "flex",
    flexDirection: "column",
  },
  notFoundImage: {
    margin: "auto",
    width: "50%",
    [theme.breakpoints.down("xl")]: {
      width: "60%",
    },
    [theme.breakpoints.down("lg")]: {
      width: "70%",
    },
    [theme.breakpoints.down("md")]: {
      width: "80%",
    },
    [theme.breakpoints.down("sm")]: {
      width: "90%",
    },
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
}));

const NotFoundPage = () => {
  const classes = useStyles();

  return (
    <Grid className={classes.grid} item xs={12}>
      <img className={classes.notFoundImage} src="images/404-error-page.jpeg" alt="404 not found" />
    </Grid>
  );
};

export default NotFoundPage;
