import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Card, Grid, Stack, Button, Divider, Typography } from "@mui/material";

import { FlexBox } from "@/components/flexbox";
import { FormProvider, TextField } from "@/components/form";
import { FormWrapper, Dot } from "./styles";

export default function Password() {
  const initialValues = {
    newPassword: "123456",
    currentPassword: "123456",
    confirmNewPassword: "123456",
  };

  const validationSchema = Yup.object({
    currentPassword: Yup.string()
      .min(3, "Debe tener más de 3 caracteres")
      .required("¡Se requiere la contraseña actual!"),
    newPassword: Yup.string()
      .min(8)
      .required("¡Se requiere una nueva contraseña!"),
    confirmNewPassword: Yup.string().test(
      "password-should-match",
      "Passwords must match",
      function (value) {
        return this.parent.newPassword === value;
      }
    ),
  });

  const methods = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleSubmitForm = handleSubmit((values) => {
    alert(JSON.stringify(values, null, 2));
  });
  return (
    <Card>
      <Typography variant="body1" fontWeight={500} className="p-3">
        Cambiar su contraseña
      </Typography>

      <Divider />

      <FormWrapper>
        <Grid container spacing={5}>
          <Grid
            size={{
              sm: 6,
              xs: 12,
            }}
          >
            <FormProvider methods={methods} onSubmit={handleSubmitForm}>
              <Stack spacing={4}>
                <TextField
                  fullWidth
                  type="password"
                  variant="outlined"
                  name="currentPassword"
                  label="Contraseña actual"
                />

                <TextField
                  fullWidth
                  type="password"
                  name="newPassword"
                  variant="outlined"
                  label="Nueva contraseña"
                />

                <TextField
                  fullWidth
                  type="password"
                  variant="outlined"
                  name="confirmNewPassword"
                  label="Confirmar nueva contraseña"
                />
              </Stack>

              <Stack direction="row" spacing={2} mt={4}>
                <Button
                  loading={isSubmitting}
                  type="submit"
                  variant="contained"
                >
                  Guardar cambios
                </Button>

                <Button variant="outlined">Cancelar</Button>
              </Stack>
            </FormProvider>
          </Grid>

          <Grid size={12}>
            <Typography variant="body2" fontWeight={500}>
              Requerimientos de la contraseña
            </Typography>

            <Typography variant="body2" color="grey.500">
              Asegúrese de que se cumplan los siguientes requisitos:
            </Typography>

            <Stack spacing={1} mt={2}>
              {REQUIREMENTS.map((item) => (
                <FlexBox alignItems="center" gap={1} key={item}>
                  <Dot />

                  <Typography variant="body2" fontSize={13}>
                    {item}
                  </Typography>
                </FlexBox>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </FormWrapper>
    </Card>
  );
}
const REQUIREMENTS = [
  "Un mínimo de 8 caracteres",
  "Al menos un carácter en minúscula",
  "Al menos un carácter en mayúscula",
  "Al menos un número, símbolo o espacio en blanco",
];
