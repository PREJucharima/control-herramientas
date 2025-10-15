import { Controller } from "react-hook-form";
import { Autocomplete, TextField } from "@mui/material";

export default function AutocompleteController({
  name,
  control,
  label,
  options = [],
  isLoading = false,
  fetchError = null,
  disabled = false,
  required = true,
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Autocomplete
          disablePortal
          options={options ?? []}
          value={field.value}
          onChange={(_, val) => field.onChange(val)}
          onBlur={field.onBlur}
          disabled={!!disabled}
          loading={!!isLoading}
          loadingText="Cargando opciones…"
          noOptionsText={
            fetchError ? "Error al cargar opciones" : "Sin opciones"
          }
          isOptionEqualToValue={(o, v) => String(o?.id) === String(v?.id)}
          getOptionLabel={(o) =>
            o?.descripcion ? o.descripcion : o?.nombre ?? ""
          }
          // size="small"
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              required={required}
              inputRef={field.ref}
              error={!!fieldState.error || !!fetchError}
              helperText={
                fieldState.error?.message ??
                (fetchError ? "No se pudieron cargar los datos." : undefined)
              }
              fullWidth
              autoComplete="new-password"
            />
          )}
        />
      )}
    />
  );
}
