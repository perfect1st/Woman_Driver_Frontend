import React, { useState, useEffect } from "react";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  useTheme,
  Typography,
  ListItemIcon,
  Divider,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { Link, useLocation, matchPath } from "react-router-dom";
import routesData from "../data/routes";

const Sidebar = ({ userType = "admin", mobileOpen, onClose }) => {
  const theme = useTheme();
  const { i18n } = useTranslation();
  const location = useLocation();

  const menuItems = routesData[userType] || [];
  const [openKeys, setOpenKeys] = useState({});

  useEffect(() => {
    const newOpenKeys = {};
    menuItems.forEach((item) => {
      if (item.children) {
        const isChildActive = item.children.some((child) =>
          matchPath(child.path, location.pathname)
        );
        if (isChildActive) {
          newOpenKeys[item.key] = true;
        }
      }
    });
    setOpenKeys((prev) => ({ ...prev, ...newOpenKeys }));
  }, [location.pathname, menuItems]);


  const toggleOpen = (key) =>
    setOpenKeys((prev) => ({ ...prev, [key]: !prev[key] }));

  const isSubRouteOf = (childPath, targetPath) => {
    const match = matchPath(childPath, location.pathname);
    return match && location.pathname.startsWith(targetPath);
  };


  const drawerContent = (
    <Box
      sx={{
        width: 250,
        height: "100%",
        background: theme.palette.primary.main,
        color: "#ffffff",
        pt: 2,
      }}
    >
      <List component="nav">
      {menuItems.map((item, index) => {
          const hasChildren = !!item.children;
          const isDirectlyActive =
          (!hasChildren && matchPath(item.path, location.pathname)) ||
          (item.key === "Passengers" && matchPath("/riderDetails/:id", location.pathname)) ||
          (item.key === "Trips" && matchPath("/tripDetails/:id", location.pathname)) ||
          (item.key === "Drivers" && matchPath("/DriverDetails/:id", location.pathname))||
          (item.key === "Cars" && matchPath("/Cars/AddCar", location.pathname));
        

          const isActiveParent =
            hasChildren &&
            item.children.some((child) =>
              matchPath(child.path, location.pathname)
            );

          const IconComponent = item.icon;

          return (
            <React.Fragment key={item.key}>
              <Box sx={{ px: 2, mb: 0.5 }}>
                <ListItemButton
                  component={item.path ? Link : "div"}
                  to={item.path || undefined}
                  onClick={() => hasChildren && toggleOpen(item.key)}
                  selected={isDirectlyActive || isActiveParent}
                  sx={{
                    pl: 3,
                    mb: 0.5,
                    "&.Mui-selected": {
                      backgroundColor: isDirectlyActive 
                        ? theme.palette.background.default 
                        : 'transparent',
                      color: isDirectlyActive 
                        ? theme.palette.primary.main
                        : "inherit",
                    },
                    "&.Mui-selected:hover": {
                      backgroundColor: isDirectlyActive 
                        ? theme.palette.background.default  
                        : 'rgba(255, 255, 255, 0.1)',
                    },
                    borderRadius: "8px",
                  }}
                >
                  {IconComponent ? (
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      <IconComponent
                        sx={{
                          color: isDirectlyActive 
                            ? theme.palette.primary.main 
                            : "inherit",
                        }}
                      />
                    </ListItemIcon>
                  ) : (
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      <Box
                        sx={{
                          width: 6,
                          height: 24,
                          borderRadius: "3px",
                          backgroundColor: isDirectlyActive 
                            ? theme.palette.primary.main 
                            : theme.palette.primary.main,
                        }}
                      />
                    </ListItemIcon>
                  )}

                  <ListItemText
                    primary={
                      <Typography
                        sx={{ display: "flex", alignItems: "start" }}
                        variant="body1"
                        fontWeight="bold"
                        color={isDirectlyActive ? "primary.main" : "inherit"}
                      >
                        {item.label[i18n.language]}
                      </Typography>
                    }
                  />
                  {hasChildren &&
                    (openKeys[item.key] ? <ExpandLess /> : <ExpandMore />)}
                </ListItemButton>

                {hasChildren && (
                  <Collapse
                    in={openKeys[item.key]}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding>
                      {item.children.map((child) => {
const isChildActive = !!matchPath(child.path, location.pathname);
return (
                          <ListItemButton
                            key={child.key}
                            component={Link}
                            to={child.path}
                            selected={isChildActive}
                            sx={{
                              // pl: 8,
                              mb: 0.5,
                              "&.Mui-selected": {
                                backgroundColor: theme.palette.background.default ,
                                color: theme.palette.primary.main,
                              },
                              "&.Mui-selected:hover": {
                                backgroundColor: theme.palette.background.default ,
                              },
                              borderRadius: "8px",
                            }}
                          >
                             <ListItemIcon sx={{ minWidth: 30 }}>
                      <Box
                        sx={{
                          width: 6,
                          height: 24,
                          borderRadius: "3px",
                          backgroundColor: isDirectlyActive 
                            ? theme.palette.primary.main 
                            : theme.palette.primary.main,
                        }}
                      />
                    </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography
                                  sx={{ display: "flex", alignItems: "start" }}
                                  variant="body1"
                                  color={isChildActive ? "primary.main" : "inherit"}
                                >
                                  {child.label[i18n.language]}
                                </Typography>
                              }
                            />
                          </ListItemButton>
                        );
                      })}
                    </List>
                  </Collapse>
                )}
              </Box>

              {index < menuItems.length - 1 && (
                <Divider
                  sx={{
                    borderColor: "rgba(255, 255, 255, 0.3)",
                    mx: 2,
                    my: 1,
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </List>
    </Box>
  );

  return (
    <>
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          width: 250,
          flexShrink: 0,
        }}
      >
        {drawerContent}
      </Box>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: 250,
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;