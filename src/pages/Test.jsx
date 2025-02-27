import { Box, Card, Chip, Typography } from "@mui/material";

export default function Test() {
  return (
    <Box>
      <Card>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <Typography variant="h6">Amount</Typography>
            <Typography variant="body2">10000 MMK</Typography>
          </div>
          <div>
            <Chip label="pending" color="warning" />
          </div>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-even", gap: 2 }}>
          <div>
            <Typography variant="h6">Category</Typography>
            <Typography variant="body2">Travel Expense</Typography>
          </div>
          <div>
            <Typography variant="h6">Requester</Typography>
            <Typography variant="body2">Thaw Thu Han</Typography>
          </div>
        </Box>
        <div>
          <Typography variant="h6">description</Typography>
          <Typography variant="body2">
            This expense request is just for testing.
          </Typography>
        </div>
      </Card>
      <Grid2 container spacing={2}>
        {data?.map((expense) => {
          const date = new Date(expense.date_submitted);
          return (
            <Grid2 key={expense.id} size={12}>
              <Card sx={{ p: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                  }}
                >
                  <Box>
                    <Typography variant="h5">{expense.amount}</Typography>
                    <Typography variant="body2">{expense.user.name}</Typography>
                    <Typography>{date.toLocaleDateString()}</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      gap: 1,
                    }}
                  >
                    <Chip
                      label={expense.category.name}
                      sx={{ my: 1 }}
                      color="secondary"
                    />
                    <Chip label="Project1" sx={{ my: 1 }} color="secondary" />
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                  }}
                >
                  <Box>
                    <Typography variant="h6" component={"div"}>
                      Description
                    </Typography>
                    <Typography component={"p"} variant="body2">
                      {expense.description}
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6">Approvals</Typography>
                {expense.approvals?.map((approval) => {
                  return (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                      key={approval.id}
                    >
                      <Typography variant="body2">
                        {approval.users.name}
                      </Typography>
                      <Typography
                        color={
                          approval.status === "approved"
                            ? "success"
                            : approval.status === "rejected"
                            ? "error"
                            : "warning"
                        }
                      >
                        {approval.status}
                      </Typography>
                    </Box>
                  );
                })}
                {expense.approvals.map((approval) => {
                  if (
                    approval.status === "pending" &&
                    approval.users.id === auth.id &&
                    approval.level === expense.current_approver_level
                  ) {
                    return (
                      <Box
                        sx={{
                          mt: 2,
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: 1,
                        }}
                        key={approval.id}
                      >
                        <Button
                          variant="outlined"
                          color="success"
                          onClick={() => {
                            setAction("approve");
                            handleOpen(approval);
                          }}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => {
                            setAction("reject");
                            handleOpen(approval);
                          }}
                        >
                          Reject
                        </Button>
                      </Box>
                    );
                  }
                })}
              </Card>
            </Grid2>
          );
        })}
        <Modal open={open} onClose={handleClose}>
          <Box sx={style}>
            <Typography variant="h6">
              {action === "approve" ? "Approve" : "Reject"} Expense
            </Typography>
            <TextField
              id="outlined-basic"
              label="Comment"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
            <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                color={action === "approve" ? "success" : "error"}
                onClick={handleAction}
              >
                Confirm
              </Button>
            </Box>
          </Box>
        </Modal>
      </Grid2>
    </Box>
  );
}
