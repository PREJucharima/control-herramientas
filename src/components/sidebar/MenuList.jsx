import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  List,
} from "@mui/material";
import { NavLink } from "react-router";
import { useState } from "react";
import { iconMap } from "@/core/utils/iconMap";

export const MenuList = ({ items }) => {
  const [openSubmenus, setOpenSubmenus] = useState({});

  console.log(items);

  const toggle = (id) =>
    setOpenSubmenus((prev) => ({ ...prev, [id]: !prev[id] }));

  return items.map((item) => {
    if (!item.es_visible) return null;
    const hasChildren = item.hijos?.length > 0;
    const Icon = iconMap[item.icono] || iconMap.default;

    return (
      <div key={item.menu_id || item.nombre}>
        <ListItem disablePadding>
          <ListItemButton
            component={!hasChildren && item.ruta_url ? NavLink : "button"}
            to={item.ruta_url}
            onClick={
              item.onClick ||
              (hasChildren ? () => toggle(item.menu_id) : undefined)
            }
          >
            <ListItemIcon>
              <Icon sx={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText primary={item.nombre} />
          </ListItemButton>
        </ListItem>

        {hasChildren && (
          <Collapse
            in={openSubmenus[item.menu_id]}
            timeout="auto"
            unmountOnExit
          >
            <List sx={{ pl: 4 }}>
              <MenuList items={item.hijos} />
            </List>
          </Collapse>
        )}
      </div>
    );
  });
};
