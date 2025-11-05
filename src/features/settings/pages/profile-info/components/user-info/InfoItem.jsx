import Typography from "@mui/material/Typography";
import FlexBox from "@/components/ui/flexbox/FlexBox";

export default function InfoItem({ title }) {
  return (
    <FlexBox alignItems="center" gap={1} color="grey.500">
      {/* <Icon
        sx={{
          fontSize: 18,
        }}
      /> */}
      <Typography variant="body2">{title}</Typography>
    </FlexBox>
  );
}
