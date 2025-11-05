import dayjs from "dayjs";
import { Controller, useFormContext } from "react-hook-form";
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker";

export default function DatePicker({ name, label, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const value =
          field.value == null || field.value === ""
            ? null
            : dayjs.isDayjs(field.value)
            ? field.value
            : dayjs(field.value);

        return (
          <MuiDatePicker
            label={label}
            value={value}
            onChange={(val) => field.onChange(val ?? null)}
            slotProps={{
              textField: {
                name,
                fullWidth: true,
                onBlur: field.onBlur,
                error: Boolean(error),
                helperText: error?.message,
              },
            }}
            {...other}
          />
        );
      }}
    />
  );
}
