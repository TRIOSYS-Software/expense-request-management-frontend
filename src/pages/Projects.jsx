import { Sync } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { useMutation } from "react-query";
import { queryClient, useApp } from "../ThemedApp";
import { syncProjects } from "../libs/fetcher";
import { useState } from "react";
import ProjectsTable from "../components/ProjectsTable";

export default function Projects() {
  const [loading, setLoading] = useState(false);
  const { setGlobalMsg } = useApp();
  const sync = useMutation(syncProjects, {
    onSuccess: () => {
      setLoading(false);
      queryClient.invalidateQueries("projects");
      setGlobalMsg("Projects synced successfully!");
    },
    onError: () => {
      setGlobalMsg("Projects sync failed!");
    },
    onMutate: () => {
      setLoading(true);
    },
  });

  const onClick = () => sync.mutate();

  return (
    <Box sx={{ px: 4 }}>
      <Box sx={{ py: 2, display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h5">Projects</Typography>
        <Button
          loading={loading}
          onClick={onClick}
          variant="contained"
          startIcon={<Sync />}
        >
          Sync
        </Button>
      </Box>
      <Box>
        <ProjectsTable />
      </Box>
    </Box>
  );
}
