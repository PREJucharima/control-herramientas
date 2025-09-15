import { TableRow, TableCell, Box } from "@mui/material";

export default function TableDataNotFound({ query = "" }) {
  return (
    <TableRow>
      <TableCell colSpan={12}>
        <Box
          sx={{
            py: 4,
            textAlign: "center",
            color: "text.secondary",
          }}
        >
          {query === ""
            ? "No hay datos disponibles."
            : `No hay resultados para "${query}"`}
        </Box>
      </TableCell>
    </TableRow>
  );
}
