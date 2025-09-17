import useLayout from "@/layouts/context/useLayout";
import SidebarAccordion from "./SidebarAccordion";
import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  ItemText,
  ListLabel,
  BulletIcon,
  ICON_STYLE,
  ExternalLink,
  NavItemButton,
} from "@/layouts/styles";

import { normalizeNavigation } from "@/utils/normalizeNavigation";
import { useFetchNavigation } from "@/hooks/useNavigation";
import { CircularProgress } from "@mui/material";

export default function MultiLevelMenu({ sidebarCompact }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { handleCloseMobileSidebar } = useLayout();
  const { menus, loading, error } = useFetchNavigation();
  const menuItems = normalizeNavigation(menus || []);

  const activeRoute = useCallback(
    (path) => {
      if (!path) return false;
      if (path === "/") return pathname === path;
      return pathname.startsWith(path);
    },
    [pathname]
  );

  const handleNavigation = useCallback(
    (path) => {
      navigate(path);
      handleCloseMobileSidebar?.();
    },
    [navigate, handleCloseMobileSidebar]
  );

  const insertLabelBefore = (items, targetName, label) => {
    const index = items.findIndex((item) => item.name === targetName);
    if (index === -1) return items;

    return [
      ...items.slice(0, index),
      { type: "label", label },
      ...items.slice(index),
    ];
  };

  const menuWithLabels = [
    { type: "label", label: "GESTIÓN OPERATIVA" },
    ...insertLabelBefore(menuItems, "Seguridad", "ADMINISTRACIÓN DEL SISTEMA"),
  ];

  if (loading) return <CircularProgress />;

  if (error) {
    return (
      <Alert severity="error" sx={{ borderRadius: 2, mb: 2 }}>
        Error al cargar el menú: {error.code}
      </Alert>
    );
  }

  const renderIcon = (item) => {
    if (item.icon) {
      return <item.icon sx={ICON_STYLE(activeRoute(item.path))} />;
    } else if (item.iconText) {
      return <span className="item-icon icon-text">{item.iconText}</span>;
    }

    return <BulletIcon active={activeRoute(item.path)} />;
  };

  const renderLevels = (data) => {
    return data.map((item, index) => {
      if (item.type === "label") {
        return (
          <ListLabel key={index} compact={sidebarCompact}>
            {item.label}
          </ListLabel>
        );
      }

      if (item.children) {
        return (
          <SidebarAccordion
            key={index}
            item={item}
            activeRoute={activeRoute}
            sidebarCompact={sidebarCompact}
          >
            {renderLevels(item.children)}
          </SidebarAccordion>
        );
      }

      if (item.type === "extLink") {
        return (
          <ExternalLink
            key={index}
            href={item.path}
            rel="noopener noreferrer"
            target="_blank"
          >
            <NavItemButton key={item.name} name="child" active>
              {renderIcon(item)}
              <ItemText
                compact={sidebarCompact}
                active={activeRoute(item.path)}
              >
                {item.name}
              </ItemText>
            </NavItemButton>
          </ExternalLink>
        );
      }

      return (
        <NavItemButton
          key={index}
          disabled={item.disabled}
          active={activeRoute(item.path)}
          onClick={() => handleNavigation(item.path)}
        >
          {renderIcon(item)}
          <ItemText compact={sidebarCompact} active={activeRoute(item.path)}>
            {item.name}
          </ItemText>
        </NavItemButton>
      );
    });
  };

  return <>{renderLevels(menuWithLabels)}</>;
}
