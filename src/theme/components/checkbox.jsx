import { checkboxClasses } from "@mui/material/Checkbox";

import BlankCheckBoxIcon from "@/icons/BlankCheckBoxIcon";
import CheckBoxIcon from "@/icons/CheckBoxIcon";
import CheckboxIndeterminateIcon from "@/icons/CheckboxIndeterminateIcon";

export const Checkbox = (theme) => ({
  defaultProps: {
    icon: <BlankCheckBoxIcon />,
    checkedIcon: <CheckBoxIcon />,
    indeterminateIcon: <CheckboxIndeterminateIcon />,
  },
  styleOverrides: {
    colorSecondary: {
      [`&.${checkboxClasses.checked}`]: {
        color: theme.palette.grey[700],
      },
    },
  },
});
