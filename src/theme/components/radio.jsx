import { svgIconClasses } from "@mui/material/SvgIcon";

import RadioButtonIcon from "@/icons/RadioButtonIcon";
import RadioButtonChecked from "@/icons/RadioButtonChecked";

export const Radio = () => ({
  defaultProps: {
    icon: <RadioButtonIcon />,
    checkedIcon: <RadioButtonChecked />,
  },
  styleOverrides: {
    root: {
      padding: 6,
    },
  },
  variants: [
    {
      props: {
        size: "large",
      },
      style: {
        [`.${svgIconClasses.root}`]: {
          fontSize: "1.75rem",
        },
      },
    },
  ],
});
