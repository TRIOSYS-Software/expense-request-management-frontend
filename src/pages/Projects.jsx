import { Add, Sync } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { useMutation } from "react-query";
import { queryClient, useApp } from "../ThemedApp";
import { syncProjects } from "../libs/fetcher";
import { useState } from "react";
import ProjectsTable from "../components/ProjectsTable";
import { useNavigate } from "react-router-dom";

export default function Projects() {
  const [loading, setLoading] = useState(false);
  const { setGlobalMsg } = useApp();
  const navigate = useNavigate();
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
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            loading={loading}
            onClick={onClick}
            variant="contained"
            startIcon={<Sync />}
          >
            Sync
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              navigate("/projects/assign");
            }}
            startIcon={<Add />}
          >
            Assign
          </Button>
        </Box>
      </Box>
      <Box>
        <ProjectsTable />
      </Box>
    </Box>
  );
}
