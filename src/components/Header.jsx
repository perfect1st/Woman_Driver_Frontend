import React, { useState, useContext, useEffect, useMemo } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Box, 
  IconButton, 
  Typography, 
  Divider, 
  Badge, 
  Menu, 
  MenuItem, 
  Avatar,
  Stack,
  useTheme,
  Button,
  useMediaQuery,
  Hidden,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Collapse
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { 
  ArrowDropDown, 
  ArrowDropUp,
  LightMode, 
  DarkMode,
  Menu as MenuIcon,
  Close as CloseIcon,
  ExpandLess,
  ExpandMore,
  Logout,
  Person,
  AccountCircle
} from '@mui/icons-material';
import { ColorModeContext } from '../App';
import logo from '../assets/Logo.png';
import routes from "../data/routes";
import { Link, matchPath, useLocation, useNavigate } from 'react-router-dom';
import { ReactComponent as LanguageIcon } from "../assets/language.svg";
import { ReactComponent as NotificationIcon } from "../assets/natification.svg";
import { ReactComponent as SettingIcon } from "../assets/setting.svg";
import useBaseImageUrl from "../hooks/useBaseImageUrl";
import getAccessibleRoutes from '../hooks/getAccessibleRoutes';
import { clearAllCookies, getUserCookie } from '../hooks/authCookies';


const Header = ({ onAction }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language
  const colorMode = useContext(ColorModeContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [langMenuAnchor, setLangMenuAnchor] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
const [settingAnchor, setSettingAnchor] = useState(null);
const [settingMenuOpen, setSettingMenuOpen] = useState(false);
const [settingMenuAnchor, setSettingMenuAnchor] = useState(null);
const baseImageUrl = useBaseImageUrl();
const navigate = useNavigate();

const handleSettingMenuOpen = (event) => {
  setSettingMenuAnchor(event.currentTarget);
  setSettingMenuOpen(true);
};

const handleSettingMenuClose = () => {
  setSettingMenuAnchor(null);
  setSettingMenuOpen(false);
};

 const user = getUserCookie();
  const currentRoutes = routes.admin;

  const [openMenus, setOpenMenus] = useState({});

  const handleToggleMenu = (key) => {
    setOpenMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    navigate("/profile")
    setUserMenuAnchor(null);
  };

  const handleLangMenuOpen = (event) => {
    setLangMenuAnchor(event.currentTarget);
  };

  const handleLangMenuClose = () => {
    setLangMenuAnchor(null);
  };

  const handleLogout = () => {
    clearAllCookies();
    navigate("/login")
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
    handleLangMenuClose();
    if (isMobile) setMobileOpen(false);
  };

  const toggleColorMode = () => {
    colorMode.toggleColorMode();
    if (isMobile) setMobileOpen(false);
  };
  const location = useLocation();

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };
// Mobile drawer content
// Mobile drawer content
const menuItems = useMemo(() => getAccessibleRoutes("admin"), []);
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
  console.log("menuItems",menuItems)
const drawerContent = (
  <Box
    sx={{
      width: 250,
      p: 2,
      height: "100%",
      background: theme.palette.secondary.sec,
      direction: lang === "ar" ? "rtl" : "ltr",
    }}
  >
    {/* Close Button */}
    <Box
      sx={{
        display: "flex",
        justifyContent: lang === "ar" ? "flex-start" : "flex-end",
        mb: 2,
      }}
    >
      <IconButton onClick={handleDrawerToggle}>
        <CloseIcon />
      </IconButton>
    </Box>

    {/* User Profile */}
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        mb: 3,
        p: 2,
        borderRadius: 2,
        background: "rgba(255,255,255,0.1)",
      }}
    >
      <Avatar
        src={`${baseImageUrl}${user?.profile_image}`}
        sx={{
          width: 60,
          height: 60,
          border: `2px solid ${theme.palette.primary.main}`,
          ml: lang === "ar" ? 2 : 0,
          mr: lang === "ar" ? 0 : 2,
        }}
      />
      <Box sx={{ textAlign: lang === "ar" ? "right" : "left" }}>
        <Typography variant="h6" fontWeight="bold" color="primary">
          {user?.name}
        </Typography>
        <Typography variant="body2" color="primary">
          {user?.type}
        </Typography>
      </Box>
    </Box>

    <Divider sx={{ my: 2 }} />

    {/* Main Routes */}
    <List>
      {menuItems?.map((route) =>
        route.children ? (
          <React.Fragment key={route.key}>
            <ListItemButton onClick={() => handleToggleMenu(route.key)}>
              <ListItemText
                primary={route.label[lang]}
                sx={{ textAlign: lang === "ar" ? "right" : "left" }}
              />
              {openMenus[route.key] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse in={openMenus[route.key]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {route.children.map((child) => (
                  <ListItemButton
                    key={child.key}
                    // component={Link}
                    // to={child.path}
                    onClick={() => {
                      if (child.action && onAction) onAction(child.action);
                      navigate(child.path);
                      handleDrawerToggle();
                    }}
                    sx={{
                      pl: lang === "ar" ? 0 : 4,
                      pr: lang === "ar" ? 4 : 0,
                      backgroundColor: isActiveRoute(child.path)
                        ? theme.palette.primary.main
                        : "transparent",
                      color: isActiveRoute(child.path)
                        ? "#fff"
                        : theme.palette.text.primary,
                      "&:hover": {
                        backgroundColor: theme.palette.primary.light,
                        color: "#fff",
                      },
                    }}
                  >
                    <ListItemText
                      primary={child.label[lang]}
                      sx={{
                        textAlign: lang === "ar" ? "right" : "left",
                        fontWeight: isActiveRoute(child.path) ? "bold" : "normal",
                      }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </React.Fragment>
        ) : (
          <ListItemButton
            key={route.key}
            // component={Link}
            // to={route.path}
            onClick={() => {
              navigate(route.path);
              handleDrawerToggle();
            }}
                        sx={{
              backgroundColor: isActiveRoute(route.path)
                ? theme.palette.primary.main
                : "transparent",
              color: isActiveRoute(route.path)
                ? "#fff"
                : theme.palette.text.primary,
              "&:hover": {
                backgroundColor: theme.palette.primary.light,
                color: "#fff",
              },
            }}
          >
            <ListItemText
              primary={route.label[lang]}
              sx={{
                textAlign: lang === "ar" ? "right" : "left",
                fontWeight: isActiveRoute(route.path) ? "bold" : "normal",
              }}
            />
          </ListItemButton>
        )
      )}
    </List>

    <List>
  {/* Notifications */}
  <ListItemButton onClick={(e) => setNotificationAnchor(e.currentTarget)}>
    <Box sx={{ display: "flex", alignItems: "center", width: "100%" , flex:0}}>
      {/* <Badge badgeContent={3} color="primary" sx={{ mr: 2 }}>
        <NotificationIcon
          style={{
            width: 24,
            height: 24,
            filter: theme.palette.mode === "dark" ? "invert(1)" : "none",
          }}
        />
      </Badge> */}
      <ListItemText
        primary={
          <Typography fontWeight="bold">{t("notification")}</Typography>
        }
      />
      {notificationAnchor ? <ExpandLess /> : <ExpandMore />}
    </Box>
  </ListItemButton>

  <Menu
    anchorEl={notificationAnchor}
    open={Boolean(notificationAnchor)}
    onClose={() => setNotificationAnchor(null)}
    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    transformOrigin={{ vertical: "top", horizontal: "right" }}
  >
    <MenuItem>{t("new_user_registered")}</MenuItem>
    <MenuItem>{t("driver_completed_trip")}</MenuItem>
    <MenuItem>{t("payment_received")}</MenuItem>
  </Menu>

  {/* Language Selector */}
  <ListItemButton onClick={handleLangMenuOpen}>
    <Box sx={{ display: "flex", alignItems: "center", width: "100%", flex:0 }}>
      {/* <LanguageIcon
        style={{
          width: 24,
          height: 24,
          filter: theme.palette.mode === "dark" ? "invert(1)" : "none",
          marginRight: 8,
        }}
      /> */}
      <ListItemText
        primary={
          <Typography fontWeight="bold">
            {i18n.language === "en" ? "English" : "العربية"}
          </Typography>
        }
      />
      {langMenuAnchor ? <ArrowDropUp /> : <ArrowDropDown />}
    </Box>
  </ListItemButton>
</List>


    <Divider sx={{ my: 2 }} />

    <List>
  {/* Profile */}
  <ListItemButton onClick={handleUserMenuOpen}>
    <Box sx={{ display: "flex", alignItems: "center", width: "100%", flex:0 }}>
      {/* <AccountCircle
        style={{
          width: 24,
          height: 24,
          filter: theme.palette.mode === "dark" ? "invert(1)" : "none",
          marginRight: 8,
        }}
      /> */}
      <ListItemText onClick={handleUserMenuClose}
        primary={
          <Typography fontWeight="bold" sx={{width:150, display:'flex',justifyContent:'flex-start'}}>{t("profile")}</Typography>
        }
      />
    </Box>
  </ListItemButton>

  {/* Logout */}
  <ListItemButton onClick={handleLogout}>
    <Box sx={{ display: "flex", alignItems: "center", width: "100%", flex:0 }}>
      {/* <Logout
        style={{
          width: 24,
          height: 24,
          filter: theme.palette.mode === "dark" ? "invert(1)" : "none",
          marginRight: 8,
        }}
      /> */}
      <ListItemText
        primary={
          <Typography fontWeight="bold" color='error' sx={{width:150, display:'flex',justifyContent:'flex-start'}} >{t("logout")}</Typography>
        }
      />
    </Box>
  </ListItemButton>
</List>


  </Box>
);

  
  

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        background: theme.palette.secondary.sec,
        px: { xs: 2, md: 4 },
        py: { xs: 1, md: 1.5 },
        maxHeight: { xs: 60, md: 80 },
        boxShadow: 'none' ,
        
      }}
    >
      <Toolbar disableGutters>
        {/* Mobile Menu Button */}
      <Hidden mdUp>
      <Box
  sx={{
    display: "flex",
    alignItems: "center",
    justifyContent: { xs: "space-between", md: "flex-start" }, // space-between في الموبايل فقط
    width: "100%",
  }}
>
  {/* Menu Icon (Hidden on mdUp) */}
  <Hidden mdUp>
    <IconButton
      color="primary"
      aria-label="open drawer"
      edge="start"
      onClick={handleDrawerToggle}
      sx={{
        ml: 2,
        color: theme.palette.primary.main,
      }}
    >
      <MenuIcon
        sx={{
          fontSize: 32,
          color: theme.palette.primary.main,
        }}
      />
    </IconButton>
  </Hidden>

  {/* Logo */}
  <Box
    component="img"
    src={logo}
    alt="Logo"
    sx={{
      height: { xs: 40, md: 60 },
      ml: i18n.language === "ar" ? { xs: 1, md: 3 } : 0,
      mr: i18n.language === "ar" ? 0 : { xs: 1, md: 3 },
    }}
  />
</Box>

          </Hidden>
          <Hidden mdDown>

        <Box 
          component="img" 
          src={logo} 
          alt="Logo" 
          sx={{ 
            height: { xs: 40, md: 60 },
            ml: i18n.language === 'ar' ? { xs: 1, md: 3 } : 0,
            mr: i18n.language === 'ar' ? 0 : { xs: 1, md: 3 }
          }} 
        />
          </Hidden>

        <Box sx={{ flexGrow: 1 }} />

        {/* Desktop Content - Hidden on Mobile */}
        <Hidden mdDown>
        {/* Notifications with Menu */}
{/* Notifications */}
<Box sx={{ position: 'relative', mr: { xs: 1, md: 3 } }}>
  <Button onClick={(e) => setNotificationAnchor(e.currentTarget)} sx={{ color: theme.palette.primary.main }}>
    <Badge badgeContent={3} color="primary">
      <NotificationIcon style={{ width: 28, height: 28, filter: theme.palette.mode === 'dark' ? 'invert(1)' : 'none' }} />
    </Badge>
    <Typography sx={{ mx: 1 }}>{t('notification')}</Typography>

    {notificationAnchor ? <ArrowDropUp /> : <ArrowDropDown />}
  </Button>
  <Menu
    anchorEl={notificationAnchor}
    open={Boolean(notificationAnchor)}
    onClose={() => setNotificationAnchor(null)}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
  >
    <MenuItem>{t("new_user_registered")}</MenuItem>
    <MenuItem>{t("driver_completed_trip")}</MenuItem>
    <MenuItem>{t("payment_received")}</MenuItem>
  </Menu>
</Box>
<Divider 
            orientation="vertical" 
            flexItem 
            sx={{ 
              mx: { xs: 1, md: 3 },
              height: 40,
              alignSelf: 'center',
              borderColor: theme.palette.divider,
              borderWidth: 1
            }} 
          />
{/* <Box sx={{ position: 'relative', mr: { xs: 1, md: 3 } }}>
  <Button
    onClick={(e) => setSettingAnchor(e.currentTarget)}
    sx={{
      color: theme.palette.primary.main,
      textTransform: 'none',
      // minWidth: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: 1
    }}
  >
    <SettingIcon sx={{ width: 28, height: 28, filter: theme.palette.mode === 'dark' ? 'invert(1)' : 'none' }} />
    <Typography fontWeight="bold" sx={{ display: { xs: 'none', sm: 'block' } }}>{t('settings')}</Typography>
    {settingAnchor ? <ArrowDropUp /> : <ArrowDropDown />}
  </Button>

  <Menu
    anchorEl={settingAnchor}
    open={Boolean(settingAnchor)}
    onClose={() => setSettingAnchor(null)}
  >
    <MenuItem onClick={() => setSettingAnchor(null)}>{t('settings')}</MenuItem>
    <MenuItem onClick={() => setSettingAnchor(null)}>{t('account')}</MenuItem>
    <MenuItem onClick={() => setSettingAnchor(null)}>{t('Tracking Frequency')}</MenuItem>
  </Menu>
</Box> */}




          {/* Vertical divider */}
          {/* <Divider 
            orientation="vertical" 
            flexItem 
            sx={{ 
              mx: { xs: 1, md: 3 },
              height: 40,
              alignSelf: 'center',
              borderColor: theme.palette.divider,
              borderWidth: 1
            }} 
          /> */}

          {/* Language Menu */}
          <Button 
  onClick={handleLangMenuOpen}
  sx={{
    mr: { xs: 1, md: 3 },
    color: theme.palette.primary.main,
    textTransform: 'none',
    minWidth: 'auto'
  }}
>
  <Box sx={{ display: 'flex', alignItems: 'center' }}>
    <LanguageIcon 
      sx={{ 
        width: 28, 
        height: 28, 
        mr: 1,  // مسافة يمين الأيقونة
        filter: theme.palette.mode === 'dark' ? 'invert(1)' : 'none' 
      }} 
    />
    <Typography variant="body1" fontWeight="bold" sx={{ display: { xs: 'none', sm: 'block' }, mx:2 }}>
      {i18n.language === 'en' ? 'En' : 'Ar'}
    </Typography>
    {langMenuAnchor ? <ArrowDropUp /> : <ArrowDropDown />}
  </Box>
</Button>

          
          {/* Language Menu Dropdown */}
          <Menu
            anchorEl={langMenuAnchor}
            open={Boolean(langMenuAnchor)}
            onClose={handleLangMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: i18n.language === 'ar' ? 'right' : 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: i18n.language === 'ar' ? 'right' : 'left',
            }}
            sx={{
              '& .MuiPaper-root': {
                backgroundColor: theme.palette.background.paper,
                color:theme.palette.primary.main,
                minWidth: 120
              }
            }}
          >
            <MenuItem onClick={() => changeLanguage('en')}>
              <Typography fontWeight={i18n.language === 'en' ? 'bold' : 'normal'}>
                English
              </Typography>
            </MenuItem>
            <MenuItem onClick={() => changeLanguage('ar')}>
              <Typography fontWeight={i18n.language === 'ar' ? 'bold' : 'normal'}>
                العربية
              </Typography>
            </MenuItem>
          </Menu>

          {/* Dark/Light Mode Toggle */}
          {/* <IconButton 
            onClick={toggleColorMode} 
            sx={{ 
              mr: { xs: 1, md: 3 },
              color: theme.palette.text.primary
            }}
          >
            {theme.palette.mode === 'dark' ? (
              <LightMode sx={{ fontSize: 32 }} />
            ) : (
              <DarkMode sx={{ fontSize: 32 }} />
            )}
          </IconButton> */}

          {/* Vertical divider */}
          {/* <Divider 
            orientation="vertical" 
            flexItem 
            sx={{ 
              mx: { xs: 1, md: 3 },
              height: 40,
              alignSelf: 'center',
              borderColor: theme.palette.divider,
              borderWidth: 1,
              display: { xs: 'none', sm: 'block' }
            }} 
          /> */}

          {/* User Profile */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              p: { xs: 0.5, md: 1.5 },
              borderRadius: 2,
              '&:hover': { bgcolor: 'action.hover' },
              color:theme.palette.primary.main
            }}
            onClick={handleUserMenuOpen}
          >
            <Avatar 
        src={`${baseImageUrl}${user?.profile_image}`}
        sx={{ 
                width: { xs: 36, md: 46 }, 
                height: { xs: 36, md: 46 },
                border: `2px solid ${theme.palette.primary.main}`
              }} 
            />
            <Box sx={{ 
              textAlign: i18n.language === 'ar' ? 'right' : 'left',
              mx: { xs: 0.5, md: 1.5 },
              display: { xs: 'none', md: 'block' }
            }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{color: theme.palette.primary.main}}>
                {user?.name}
              </Typography>
              <Typography variant="body2" sx={{color: theme.palette.primary.main}}>
                {user?.type}
              </Typography>
            </Box>
            <ArrowDropDown sx={{ display: { xs: 'none', md: 'block' } }} />
          </Box>

          {/* User Menu */}
          <Menu
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClose={handleUserMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: i18n.language === 'ar' ? 'right' : 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: i18n.language === 'ar' ? 'right' : 'left',
            }}
            sx={{
              '& .MuiPaper-root': {
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.primary.main,
                minWidth: 140
              }
            }}
          >
            <MenuItem onClick={handleUserMenuClose}>
              <Typography fontWeight="medium">
                {i18n.t('profile')}
              </Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Typography fontWeight="medium">
                {i18n.t('logout')}
              </Typography>
            </MenuItem>
          </Menu>
        </Hidden>
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor={i18n.language === 'ar' ? 'right' : 'left'}
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 250,
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Language Menu for Mobile */}
      <Menu
        anchorEl={langMenuAnchor}
        open={Boolean(langMenuAnchor)}
        onClose={handleLangMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: i18n.language === 'ar' ? 'right' : 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: i18n.language === 'ar' ? 'right' : 'left',
        }}
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.primary.main,
            minWidth: 120
          }
        }}
      >
        <MenuItem onClick={() => changeLanguage('en')}>
          <Typography fontWeight={i18n.language === 'en' ? 'bold' : 'normal'}>
            English
          </Typography>
        </MenuItem>
        <MenuItem onClick={() => changeLanguage('ar')}>
          <Typography fontWeight={i18n.language === 'ar' ? 'bold' : 'normal'}>
            العربية
          </Typography>
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Header;