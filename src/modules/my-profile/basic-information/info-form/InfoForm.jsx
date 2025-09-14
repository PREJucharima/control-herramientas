import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Grid,
  TextField,
  Avatar,
  InputAdornment,
} from "@mui/material";
import PersonOutline from "@mui/icons-material/PersonOutline";
import EmailOutlined from "@mui/icons-material/EmailOutlined";
import PhoneOutlined from "@mui/icons-material/PhoneOutlined";
import { useAuth } from "@/auth/hooks/useAuth";

export default function InfoForm() {
  const { user } = useAuth();
  const first = user?.first_name ?? "";
  const last = user?.last_name ?? "";
  const email = user?.email ?? "";
  const username = user?.username ?? "";
  const phone = user?.phone ?? "";

  const initials = (first + " " + last)
    .trim()
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Card sx={{ mt: 3, minWidth: 300, mx: "auto" }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "primary.main" }}>{initials || "U"}</Avatar>
        }
        title="Información básica"
        subheader="Estos datos se muestran en tu perfil"
        sx={{ py: 2 }}
      />

      <Divider />

      <CardContent sx={{ pt: 3 }}>
        <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              name="firstName"
              label="Nombre"
              fullWidth
              size="small"
              defaultValue={first}
              disabled
              slotProps={{
                input: {
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutline fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              name="lastName"
              label="Apellido"
              fullWidth
              size="small"
              defaultValue={last}
              disabled
              slotProps={{
                input: {
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutline fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 12 }}>
            <TextField
              name="email"
              label="Email"
              type="email"
              fullWidth
              size="small"
              disabled
              defaultValue={email}
              slotProps={{
                input: {
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlined fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              name="username"
              label="Nombre de usuario"
              fullWidth
              size="small"
              defaultValue={username}
              disabled
              slotProps={{
                input: {
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutline fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              name="phone"
              label="Teléfono"
              type="tel"
              fullWidth
              size="small"
              disabled
              defaultValue={phone}
              slotProps={{
                input: {
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneOutlined fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
