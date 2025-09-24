export const TableCell = (theme) => ({
  defaultProps: {
    padding: "none",
  },
  styleOverrides: {
    root: {
      border: "none",
      padding: "12px 16px",
      borderBottom: `1px solid ${theme.palette.divider}`,
      fontSize: "0.875rem",
      // whiteSpace: "nowrap",

      color: theme.palette.grey[500],
      ...theme.applyStyles("dark", {
        color: theme.palette.grey[200],
      }),
      head: {
        fontWeight: 600,
        color: theme.palette.text.primary,
        whiteSpace: "nowrap",
      },
    },
  },
});
