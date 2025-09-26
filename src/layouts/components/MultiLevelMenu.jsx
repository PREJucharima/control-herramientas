import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router";

import { CircularProgress } from "@mui/material";

import useLayout from "@/layouts/context/useLayout";
import { useFetchNavigation } from "@/hooks/useNavigation";
import {
  BulletIcon,
  ExternalLink,
  ICON_STYLE,
  ItemText,
  ListLabel,
  NavItemButton,
} from "@/layouts/styles";
import { normalizeNavigation } from "@/utils/normalizeNavigation";
import SidebarAccordion from "./SidebarAccordion";
import { isItemActive } from "@/utils";

export default function MultiLevelMenu({ sidebarCompact }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { handleCloseMobileSidebar } = useLayout();

  const { menus, loading, error } = useFetchNavigation();
  const menuItems = normalizeNavigation(menus || []);

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

  const renderIcon = (item, active) => {
    if (item.icon) return <item.icon sx={ICON_STYLE(active)} />;
    if (item.iconText)
      return <span className="item-icon icon-text">{item.iconText}</span>;
    return <BulletIcon active={active} />;
  };

  const renderLevels = (data, level = 1) =>
    data.map((item, index) => {
      if (item.type === "label") {
        return (
          <ListLabel key={`label-${index}`} compact={sidebarCompact}>
            {item.label}
          </ListLabel>
        );
      }

      if (item.children) {
        const active = isItemActive(item, level, pathname);
        return (
          <SidebarAccordion
            key={`acc-${index}`}
            item={item}
            activeRoute={(p) => isItemActive({ path: p }, level, pathname)}
            sidebarCompact={sidebarCompact}
            active={active}
            renderIcon={(it) => renderIcon(it, active)}
          >
            {renderLevels(item.children, level + 1)}
          </SidebarAccordion>
        );
      }

      const active = isItemActive(item, level, pathname);

      if (item.type === "extLink") {
        return (
          <ExternalLink
            key={`ext-${index}`}
            href={item.path}
            rel="noopener noreferrer"
            target="_blank"
          >
            <NavItemButton name="child" active>
              {renderIcon(item, active)}
              <ItemText compact={sidebarCompact} active={active}>
                {item.name}
              </ItemText>
            </NavItemButton>
          </ExternalLink>
        );
      }

      return (
        <NavItemButton
          key={`itm-${index}`}
          disabled={item.disabled}
          active={active}
          onClick={() => handleNavigation(item.path)}
        >
          {renderIcon(item, active)}
          <ItemText compact={sidebarCompact} active={active}>
            {item.name}
          </ItemText>
        </NavItemButton>
      );
    });

  return <>{renderLevels(menuWithLabels)}</>;
}
