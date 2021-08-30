import React from "react";
import { Link } from "react-router-dom";
import { ListItemText, ListItemIcon, ListItem } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const MenuListItem = ({ eventClick, to, menuSelectedTab, icon, title }) => {
  const MyListItem = withStyles({
    selected: {
      "&$selected, &$selected:hover": {
        borderLeft: "3px solid rgba(0,255,132,1)",
      },
    },
  })(ListItem);

  return (
    <MyListItem
      onClick={eventClick}
      button
      component={Link}
      to={to}
      selected={menuSelectedTab}
    >
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={title} />
    </MyListItem>
  );
};

export default MenuListItem;
