import { useQuery } from "react-query";
import { fetchExpenseRequestsSummary } from "../../libs/fetcher";
import { Bar, Line } from "react-chartjs-2";
import { Box } from "@mui/material";
import { format, eachDayOfInterval } from "date-fns";
import { useApp } from "../../ThemedApp";

export default function BarChart() {
  const { auth } = useApp();
  const currentDate = new Date();
  const previousDate = new Date(
    currentDate.getTime() - 14 * 24 * 60 * 60 * 1000
  );

  const startDate = previousDate.toISOString().split("T")[0];
  const endDate = currentDate.toISOString().split("T")[0];

  const { data, isLoading, isError, error } = useQuery(
    ["expense-request-summary-weekly", auth],
    async () =>
      await fetchExpenseRequestsSummary(
        {
          start_date: startDate,
          end_date: endDate,
          status: "approved",
        },
        auth
      )
  );

  const allDates = eachDayOfInterval({
    start: previousDate,
    end: currentDate,
  }).map((date) => format(date, "yyyy-MM-dd"));

  // Ensure data and daily_totals exist before accessing them
  const dailyTotals = data?.daily_totals || {};

  const chartData = {
    labels: allDates,
    datasets: [
      {
        label: "Weekly Approved Expenses",
        data: allDates.map((date) => dailyTotals[date] || 0), // Fill missing dates with 0
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgb(75, 192, 192)",
        borderWidth: 1,
      },
    ],
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Box>
      <Line data={chartData} />
    </Box>
  );
}
