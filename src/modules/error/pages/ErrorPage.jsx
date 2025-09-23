import { Button, Container, Typography } from "@mui/material";

import { Link } from "@/components/link";
import { SectionTitle } from "@/components/section-title";
import { GradientBackground } from "@/components/gradient-background";
import { MainContent } from "../styles";

export default function ErrorPage() {
  return (
    <GradientBackground>
      <Container>
        <MainContent>
          <SectionTitle centered title="¡Página no encontrada!" />

          <Typography variant="body1" fontSize={18} color="text.secondary">
            ¡Ups! Parece que hemos desconectado esta página por accidente. 🔌🙈
            <br />
            <br /> <strong>#404NoEncontrada</strong>
          </Typography>

          <div className="img-wrapper">
            <img src="/static/error/error.svg" alt="Error 404" width="100%" />
          </div>

          <Button
            variant="contained"
            size="large"
            LinkComponent={Link}
            href="/"
          >
            Ir al inicio
          </Button>
        </MainContent>
      </Container>
    </GradientBackground>
  );
}
