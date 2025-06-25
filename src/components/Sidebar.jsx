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
import { Link, useLocation } from "react-router-dom";
import routesData from "../data/routes";

const Sidebar = ({ userType, mobileOpen, onClose }) => {
  const theme = useTheme();
  const { i18n } = useTranslation();
  const location = useLocation();

  const menuItems = routesData["admin"] || [];
  const [openKeys, setOpenKeys] = useState({});

  // Automatically open parent routes when child route is active
  useEffect(() => {
    const newOpenKeys = {};
    menuItems.forEach((item) => {
      if (item.children) {
        const isChildActive = item.children.some((child) =>
          location.pathname.startsWith(child.path)
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
          const isParentActive =
            item.children &&
            item.children.some((child) =>
              location.pathname.startsWith(child.path)
            );
          const selected =
            location.pathname.startsWith(item.path || "") || isParentActive;
          const hasChildren = !!item.children;
          const IconComponent = item.icon;

          return (
            <React.Fragment key={item.key}>
              <Box sx={{ px: 2, mb: 0.5 }}>
                <ListItemButton
                  component={item.path ? Link : "div"}
                  to={item.path || undefined}
                  onClick={() => hasChildren && toggleOpen(item.key)}
                  selected={selected}
                  sx={{
                    pl: 3,
                    mb: 0.5,

                    "&.Mui-selected": {
                      // backgroundColor: theme.palette.customBackground.mainCard,
                      // color: theme.palette.primary.main,
                    },
                    "&.Mui-selected:hover": {
                      backgroundColor: theme.palette.customBackground.mainCard,
                    },
                    borderRadius: "8px",
                  }}
                >
                  {IconComponent ? (
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      <IconComponent sx={{ color: "inherit" }} />
                    </ListItemIcon>
                  ) : (
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      <Box
                        sx={{
                          width: 6,
                          height: 24,
                          borderRadius: "3px",
                          backgroundColor: theme.palette.primary.main,
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
                        const childSel = location.pathname.startsWith(
                          child.path
                        );
                        return (
                          <ListItemButton
                            key={child.key}
                            component={Link}
                            to={child.path}
                            selected={childSel}
                            sx={{
                              pl: 8,
                              mb: 0.5,
                              "&.Mui-selected": {
                                backgroundColor:
                                  theme.palette.customBackground.mainCard,
                                color: theme.palette.text.primary,
                              },
                              "&.Mui-selected:hover": {
                                backgroundColor:
                                  theme.palette.customBackground.mainCard,
                              },
                              borderRadius: "8px",
                            }}
                          >
                            <ListItemText
                              primary={
                                <Typography
                                sx={{ display: "flex", alignItems: "start" }}
                                variant="body1"
                                // fontWeight="bold"
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

              {/* Add divider between routes except the last one */}
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
      {/* Desktop sidebar - hidden on mobile */}
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          width: 250,
          flexShrink: 0,
        }}
      >
        {drawerContent}
      </Box>

      {/* Mobile drawer - hidden completely on mobile */}
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
