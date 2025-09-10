import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

// import { FormProvider, TextField } from "@/components/form";
import { Box, Grid, TextField } from "@mui/material";

export default function InfoForm() {
  return (
    <Card>
      <Typography
        variant="body1"
        sx={{
          padding: "1rem 1.5rem",
          fontWeight: 500,
        }}
      >
        Basic Information
      </Typography>

      <Divider />

      <Box>
        <div className="p-3">
          {/* <Grid container spacing={3}>
            <Grid>
              <TextField
                fullWidth
                name="firstName"
                label="First Name"
                variant="outlined"
              />
            </Grid>

            <Grid>
              <TextField
                fullWidth
                name="lastName"
                label="Last Name"
                variant="outlined"
              />
            </Grid>

            <Grid>
              <TextField
                fullWidth
                name="email"
                label="Email"
                variant="outlined"
              />
            </Grid>

            <Grid>
              <TextField
                fullWidth
                name="phone"
                label="Phone"
                variant="outlined"
              />
            </Grid>
          </Grid> */}
        </div>
      </Box>
    </Card>
  );
}
