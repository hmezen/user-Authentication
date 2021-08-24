import React from "react";
import { Link } from "react-router-dom";
import { ListItemText, ListItemIcon, ListItem } from "@material-ui/core";
import { useStyles } from "./header-styles";

const MenuListItem = ({ eventClick, to, menuSelectedTab, icon, title }) => {
  const classes = useStyles();
  return (
    <ListItem
      onClick={eventClick}
      button
      component={Link}
      to={to}
      selected={menuSelectedTab}
      classes={{ selected: classes.selectedItem }}
    >
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={title} />
    </ListItem>
  );
};

export default MenuListItem;
