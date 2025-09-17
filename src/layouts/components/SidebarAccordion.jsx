import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { Box, Collapse } from "@mui/material";
import {
  ItemText,
  ICON_STYLE,
  BulletIcon,
  AccordionButton,
  ChevronRightStyled,
  AccordionExpandPanel,
} from "@/layouts/styles";

export default function SidebarAccordion({
  item,
  children,
  sidebarCompact,
  activeRoute,
}) {
  const [isExpanded, setIsExpanded] = useState(() =>
    item.children.some((child) => activeRoute(child.path))
  );

  const hasActiveChild = useMemo(() => {
    const checkActive = (currentItem) => {
      if (activeRoute(currentItem.path)) return true;
      if (currentItem.children) return currentItem.children.some(checkActive);
      return false;
    };
    return checkActive(item);
  }, [item, activeRoute]);

  useEffect(() => {
    setIsExpanded(hasActiveChild);
  }, [hasActiveChild]);

  const handleClick = useCallback(() => setIsExpanded((state) => !state), []);

  return (
    <Fragment>
      <AccordionButton
        onClick={handleClick}
        active={sidebarCompact && hasActiveChild}
      >
        <Box pl="7px" display="flex" alignItems="center">
          {item.icon && <item.icon sx={ICON_STYLE(hasActiveChild)} />}
          {item.iconText && <BulletIcon active={hasActiveChild} />}
          <ItemText compact={sidebarCompact} active={hasActiveChild}>
            {item.name}
          </ItemText>
        </Box>
        <ChevronRightStyled
          active={hasActiveChild}
          collapsed={isExpanded}
          compact={sidebarCompact}
          className="accordionArrow"
        />
      </AccordionButton>

      {!sidebarCompact && (
        <Collapse in={isExpanded} unmountOnExit mountOnEnter>
          <AccordionExpandPanel className="expand">
            {children}
          </AccordionExpandPanel>
        </Collapse>
      )}
    </Fragment>
  );
}
