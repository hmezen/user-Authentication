import React from "react";
import CloseIcon from "@material-ui/icons/Close";
import { Dialog, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  dialogChildren: {
    margin: "auto",
    maxWidth: "100%",
    padding: "60px 40px 30px",
    [theme.breakpoints.up("sm")]: {
      maxWidth: "350px",
    },
  },
  greenDivider: {
    height: "0px",
    width: "100px",
    margin: "24px 0px",
    borderRadius: "8px",
    border: "4px solid rgb(0, 255, 132)",
  },
  dialogDisplay: {
    display: "block",
    [theme.breakpoints.up("sm")]: {
      display: "flex",
    },
  },
  leftPart: {
    display: "flex",
    width: "100%",
    backgroundColor: "rgb(0, 35, 51)",
    [theme.breakpoints.up("sm")]: {
      width: "284px",
    },
  },
  leftPartContent: {
    alignItems: "center",
    width: "100%",
    margin: "auto 0px",
    padding: "30px",
    color: "rgb(255, 255, 255)",
  },
  dialog: {
    marginTop: theme.spacing(6),
  },
}));

const DialogComponent = ({
  isOpen,
  handleClose,
  children,
  title,
  subTitle,
}) => {
  const classes = useStyles();

  return (
    <Dialog
      className={classes.dialog}
      fullWidth={true}
      maxWidth="sm"
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <div className={classes.dialogDisplay}>
        <div className={classes.leftPart}>
          <div className={classes.leftPartContent}>
            <span>
              <h2>{title}</h2>
              <div className={classes.greenDivider}></div>
              <h4>{subTitle}</h4>
            </span>
          </div>
        </div>
        <div className={classes.dialogChildren}>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
          {children}
        </div>
      </div>
    </Dialog>
  );
};

export default DialogComponent;
