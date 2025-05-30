import {
  AttachMoneyOutlined,
  Home,
  Logout,
  Settings,
  ExpandLess,
  ExpandMore,
  People,
  Category,
  Groups2,
  NaturePeople,
  PeopleAlt,
  Rule,
  Payments,
  ListAlt,
  PaymentRounded,
  WorkHistory,
  WorkOutline,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Collapse,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useApp } from "../ThemedApp";

export default function AppDrawer({ showDrawer, setShowDrawer }) {
  const [open, setOpen] = useState(false);
  const { auth, setAuth } = useApp();

  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    setAuth(null);
    setShowDrawer(false);
    navigate("/login");
  };

  return (
    <Drawer open={showDrawer} onClose={() => setShowDrawer(false)}>
      <Box sx={{ width: 250 }}>
        <Box
          sx={{ p: 2 }}
          justifyContent={"center"}
          alignItems={"center"}
          textAlign={"center"}
        >
          <Typography variant="h6">Expense Management</Typography>
        </Box>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                navigate("/");
                setShowDrawer(false);
              }}
            >
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              <ListItemText>Home</ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                navigate("/expenses");
                setShowDrawer(false);
              }}
            >
              <ListItemIcon>
                <AttachMoneyOutlined />
              </ListItemIcon>
              <ListItemText>Expense Request</ListItemText>
            </ListItemButton>
          </ListItem>
          {auth.role === 1 && (
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setOpen(!open);
                }}
              >
                <ListItemIcon>
                  <Settings />
                </ListItemIcon>
                <ListItemText>Setting</ListItemText>
                {open ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
          )}
          {auth.role === 1 && (
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Divider />
              <List component="div" disablePadding>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      navigate("/users");
                      setShowDrawer(false);
                    }}
                  >
                    <ListItemIcon>
                      <PeopleAlt />
                    </ListItemIcon>
                    <ListItemText>Users Management</ListItemText>
                  </ListItemButton>
                </ListItem>
                {/* <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      navigate("/categories");
                      setShowDrawer(false);
                    }}
                  >
                    <ListItemIcon>
                      <Category />
                    </ListItemIcon>
                    <ListItemText>Categories</ListItemText>
                  </ListItemButton>
                </ListItem> */}
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      navigate("/gl-accounts");
                      setShowDrawer(false);
                    }}
                  >
                    <ListItemIcon>
                      <ListAlt />
                    </ListItemIcon>
                    <ListItemText>GL Accounts</ListItemText>
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      navigate("/payment-methods");
                      setShowDrawer(false);
                    }}
                  >
                    <ListItemIcon>
                      <PaymentRounded />
                    </ListItemIcon>
                    <ListItemText>Payment Methods</ListItemText>
                  </ListItemButton>
                </ListItem>
                {/* <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      navigate("/users/payment-methods");
                      setShowDrawer(false);
                    }}
                  >
                    <ListItemIcon>
                      <Payments />
                    </ListItemIcon>
                    <ListItemText>Assign PM</ListItemText>
                  </ListItemButton>
                </ListItem> */}
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      navigate("/projects");
                      setShowDrawer(false);
                    }}
                  >
                    <ListItemIcon>
                      <WorkOutline />
                    </ListItemIcon>
                    <ListItemText>Projects</ListItemText>
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      navigate("/departments");
                      setShowDrawer(false);
                    }}
                  >
                    <ListItemIcon>
                      <Groups2 />
                    </ListItemIcon>
                    <ListItemText>Departments</ListItemText>
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      navigate("/policies");
                      setShowDrawer(false);
                    }}
                  >
                    <ListItemIcon>
                      <Rule />
                    </ListItemIcon>
                    <ListItemText>Policies</ListItemText>
                  </ListItemButton>
                </ListItem>
              </List>
              <Divider />
            </Collapse>
          )}
          <ListItem disablePadding>
            <ListItemButton onClick={logout}>
              <ListItemIcon>
                <Logout />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}
