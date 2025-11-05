import { useState, useCallback, useMemo } from "react";
import { LayoutContext } from "./layoutContext";

export function LayoutProvider({ children }) {
  const [sidebarCompact, setSidebarCompact] = useState(false);
  const [showMobileSideBar, setShowMobileSideBar] = useState(false);

  const handleSidebarCompactToggle = useCallback(() => {
    setSidebarCompact((state) => !state);
  }, []);

  const handleOpenMobileSidebar = useCallback(() => {
    setShowMobileSideBar(true);
  }, []);

  const handleCloseMobileSidebar = useCallback(() => {
    setShowMobileSideBar(false);
  }, []);

  const contextValue = useMemo(
    () => ({
      sidebarCompact,
      showMobileSideBar,
      handleOpenMobileSidebar,
      handleCloseMobileSidebar,
      handleSidebarCompactToggle,
    }),
    [
      sidebarCompact,
      showMobileSideBar,
      handleOpenMobileSidebar,
      handleCloseMobileSidebar,
      handleSidebarCompactToggle,
    ]
  );

  return (
    <LayoutContext.Provider value={contextValue}>
      {children}
    </LayoutContext.Provider>
  );
}
