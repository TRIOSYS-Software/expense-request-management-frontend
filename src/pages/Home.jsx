import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid2,
  Typography,
} from "@mui/material";
import { fetchExpenseRequestsSummary } from "../libs";
import { useQuery } from "react-query";
import { Chart, DoughnutController, registerables } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import BarChart from "../components/dashboards/BarChart";
import { useApp } from "../ThemedApp";

Chart.register(...registerables);

export default function Home() {
  const { auth } = useApp();
  const { data, isLoading, isError, error } = useQuery(
    ["expense-request-summary", auth],
    async () => await fetchExpenseRequestsSummary({}, auth)
  );

    const { data: totalApproved, isLoading: totalApprovedLoading, isError: istotalApprovedError, error: totalApprovedError } = useQuery(
      ["expense-request-total-approved", auth],
      async () => await fetchExpenseRequestsSummary({status: "approved"}, auth)
    );

    const { data: totalRejected, isLoading: totalRejectedLoading, isError: istotalRejectedError, error: totalRejectedError } = useQuery(
      ["expense-request-total-rejected", auth],
      async () => await fetchExpenseRequestsSummary({status: "rejected"}, auth)
    );

  const chartData = {
    labels: ["Approved", "Rejected", "Pending"],
    datasets: [
      {
        label: "Expense Requests",
        data: [data?.approved, data?.rejected, data?.pending],
        backgroundColor: [
          "rgba(7, 152, 248, 0.66)",
          "rgba(255, 86, 86, 0.66)",
          "rgba(184, 192, 75, 0.66)",
        ],
        borderColor: [
          "rgb(54, 162, 235)",
          "rgb(255, 86, 86)",
          "rgb(192, 184, 75)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h5">Dashborad</Typography>
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 6, md: 3 }}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h4">{data?.total}</Typography>
            <Typography variant="body2">Total Expense Requests</Typography>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 6, md: 3 }}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h4">{data?.pending}</Typography>
            <Typography variant="body2">
              Total Pending Expense Requests
            </Typography>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 6, md: 3 }}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h4">{data?.approved}</Typography>
            <Typography variant="body2">
              Total Approved Expense Requests
            </Typography>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 6, md: 3 }}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h4">{data?.rejected}</Typography>
            <Typography variant="body2">
              Total Rejected Expense Requests
            </Typography>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 4 }}>
        <Card sx={{ p: 2 }}>
            <Typography variant="h4">{data?.total_amount.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 4,
              })}</Typography>
            <Typography variant="body2">
              Total Requested Amount
            </Typography>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 4 }}>
        <Card sx={{ p: 2 }}>
            <Typography variant="h4">{totalApproved?.total_amount.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 4,
              })}</Typography>
            <Typography variant="body2">
              Total Approved Amount
            </Typography>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 4 }}>
        <Card sx={{ p: 2 }}>
            <Typography variant="h4">{totalRejected?.total_amount.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 4,
              })}</Typography>
            <Typography variant="body2">
              Total Reject Amount
            </Typography>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Doughnut data={chartData} />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 8 }}>
          <BarChart />
        </Grid2>
      </Grid2>
    </Box>
  );
}
