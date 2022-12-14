import { Helmet } from 'react-helmet-async';
// @mui
import { Grid, Container, Typography } from '@mui/material';
// components
// sections
import {
  AppWidgetSummary,
} from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {

  return (
    <>
      <Helmet>
        <title> Dashboard</title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hey, Bem vindo de volta!
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Candidatos" total={100} icon={'ant-design:user-outlined'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Candidatos Pendentes" total={10} color="warning" icon={'ant-design:bulb-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Candidatos Aprovados" total={40} color="success" icon={'ant-design:check-circle-filled'}/>
          </Grid>


          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Candidatos Reprovados" total={50} color="error" icon={'ant-design:close-circle-filled'} />
          </Grid>

        </Grid>
      </Container>
    </>
  );
}
