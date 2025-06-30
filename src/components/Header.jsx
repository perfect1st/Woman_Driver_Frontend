import React, { useState, useContext } from 'react';
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
  Person
} from '@mui/icons-material';
import { ColorModeContext } from '../App';
import logo from '../assets/Logo.png';
import languageIcon from '../assets/languageIcon.png';
import notificationIcon from '../assets/natificationIcon.png';
import routes from "../data/routes";
import { Link } from 'react-router-dom';

const Header = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language
  const colorMode = useContext(ColorModeContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [langMenuAnchor, setLangMenuAnchor] = useState(null);
  const [user] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
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
    setUserMenuAnchor(null);
  };

  const handleLangMenuOpen = (event) => {
    setLangMenuAnchor(event.currentTarget);
  };

  const handleLangMenuClose = () => {
    setLangMenuAnchor(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.reload();
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

// Mobile drawer content
// Mobile drawer content
const drawerContent = (
  <Box 
    sx={{ 
      width: 250, 
      padding: 2, 
      height: '100%', 
      background: theme.palette.secondary.sec,
      direction: lang === 'ar' ? 'rtl' : 'ltr'
    }}
  >
    {/* Close Button */}
    <Box sx={{ 
      display: 'flex', 
      justifyContent: lang === 'ar' ? 'flex-start' : 'flex-end', 
      mb: 2 
    }}>
      <IconButton onClick={handleDrawerToggle}>
        <CloseIcon />
      </IconButton>
    </Box>

    {/* User Profile */}
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        flexDirection: lang === 'ar' ? 'row' : 'row',
        mb: 3,
        p: 2,
        borderRadius: 2,
        background: 'rgba(255,255,255,0.1)'
      }}
    >
      <Avatar 
        src={user?.image} 
        sx={{ 
          width: 60, 
          height: 60,
          border: `2px solid ${theme.palette.primary.main}`,
          marginLeft: lang === 'ar' ? 2 : 0,
          marginRight: lang === 'ar' ? 0 : 2
        }} 
      />
      <Box sx={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
        <Typography variant="h6" fontWeight="bold" sx={{color: theme.palette.primary.main}}>
          {user?.name}
        </Typography>
        <Typography variant="body2" sx={{color: theme.palette.primary.main}}>
          {user?.type}
        </Typography>
      </Box>
    </Box>

    <Divider sx={{ my: 2 }} />
  
    {/* Navigation Menu */}
    <List>
      {currentRoutes?.map((route) =>
        route.children ? (
          <React.Fragment key={route.key}>
            <ListItemButton 
              onClick={() => handleToggleMenu(route.key)}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: lang === 'ar' ? 'row' : 'row'
              }}
            >
              {/* Left-aligned content (icon + text) */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                flexDirection: lang === 'ar' ? 'row' : 'row'
              }}>

                <ListItemText 
                  primary={route.label[lang]} 
                  sx={{ textAlign: lang === 'ar' ? 'right' : 'left' }}
                />
              </Box>
              
              {/* Right-aligned arrow */}
              {openMenus[route.key] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            {/* Nested Children */}
            <Collapse in={openMenus[route.key]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {route.children.map((child) => (
                  <ListItemButton
                    key={child.key}
                    component={Link}
                    to={child.path}
                    onClick={handleDrawerToggle}
                    sx={{ 
                      pl: lang === 'ar' ? 0 : 4,
                      pr: lang === 'ar' ? 4 : 0,
                      flexDirection: lang === 'ar' ? 'row' : 'row'
                    }}
                  >
                    <ListItemText 
                      primary={child.label[lang]} 
                      sx={{ textAlign: lang === 'ar' ? 'right' : 'left' }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </React.Fragment>
        ) : (
          <ListItemButton
            key={route.key}
            component={Link}
            to={route.path}
            onClick={handleDrawerToggle}
            sx={{
              flexDirection: lang === 'ar' ? 'row' : 'row'
            }}
          >
            <ListItemText 
              primary={route.label[lang]} 
              sx={{ textAlign: lang === 'ar' ? 'right' : 'left' }}
            />
          </ListItemButton>
        )
      )}
    </List>
  
    {/* Additional Menu Items */}
    <List>
      {/* Notifications */}
      <ListItem 
        button 
        sx={{ 
          mb: 1,
          flexDirection: lang === 'ar' ? 'row' : 'row'
        }}
      >
        <Badge 
          badgeContent={3} 
          color="primary" 
          sx={{ 
            marginRight: lang === 'ar' ? 0 : 2,
            marginLeft: lang === 'ar' ? 2 : 0
          }}
        >
          <Box 
            component="img" 
            src={notificationIcon} 
            alt="Notification"
            sx={{
              width: 28,
              height: 28,
              // ml: lang === 'ar' ? 0 : 0,
              // mr: lang === 'ar' ? 0 : 0,
              filter: theme.palette.mode === 'dark' ? 'invert(1)' : 'none'
            }} 
          />
        </Badge>
        <ListItemText 
          primary={
            <Typography 
              fontWeight="bold"
              sx={{ textAlign: lang === 'ar' ? 'right' : 'left' }}
            >
              {i18n.t('notification')}
            </Typography>
          } 
        />
      </ListItem>
  
      <Divider sx={{ my: 2 }} />
  
      {/* Language Selector */}
      <ListItem 
        button 
        onClick={handleLangMenuOpen} 
        sx={{ 
          mb: 1,
          flexDirection: lang === 'ar' ? 'row' : 'row'
        }}
      >
        <Box 
          component="img" 
          src={languageIcon} 
          alt="Language"
          sx={{
            width: 28,
            height: 28,
            mx: 2,
            filter: theme.palette.mode === 'dark' ? 'invert(1)' : 'none'
          }} 
        />
        <ListItemText 
          primary={
            <Typography 
              fontWeight="bold"
              sx={{ textAlign: lang === 'ar' ? 'right' : 'left' }}
            >
              {i18n.language === 'en' ? 'En' : 'Ar'}
            </Typography>
          } 
        />
        {langMenuAnchor ? <ArrowDropUp /> : <ArrowDropDown />}
      </ListItem>
  
      <Divider sx={{ my: 2 }} />
  
      {/* User Menu */}
      <ListItem 
        button 
        onClick={handleUserMenuOpen} 
        sx={{ 
          mb: 1,
          flexDirection: lang === 'ar' ? 'row' : 'row'
        }}
      >
        {/* <Box 
          component="img" 
          src={Person} 
          alt="Profile"
          sx={{
            width: 28,
            height: 28,
            mr: lang === 'ar' ? 0 : 2,
            ml: lang === 'ar' ? 2 : 0,
            filter: theme.palette.mode === 'dark' ? 'invert(1)' : 'none'
          }} 
        /> */}
        <ListItemText 
          primary={
            <Typography 
              fontWeight="bold"
              sx={{ textAlign: lang === 'ar' ? 'right' : 'left' }}
            >
              {i18n.t('profile')}
            </Typography>
          } 
        />
      </ListItem>
      
      <ListItem 
        button 
        onClick={handleLogout} 
        sx={{ 
          mb: 1,
          flexDirection: lang === 'ar' ? 'row' : 'row'
        }}
      >
        {/* <Box 
          component="img" 
          src={Logout} 
          alt="Logout"
          sx={{
            width: 28,
            height: 28,
            mr: lang === 'ar' ? 0 : 2,
            ml: lang === 'ar' ? 2 : 0,
            filter: theme.palette.mode === 'dark' ? 'invert(1)' : 'none'
          }} 
        /> */}
        <ListItemText 
          primary={
            <Typography 
              fontWeight="bold"
              sx={{ textAlign: lang === 'ar' ? 'right' : 'left' }}
            >
              {i18n.t('logout')}
            </Typography>
          } 
        />
      </ListItem>
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
          {/* Notification */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            mr: { xs: 1, md: 3 },
            color: theme.palette.primary.main
          }}>
            <Badge badgeContent={3} color="primary">
              <Box 
                component="img" 
                src={notificationIcon} 
                alt="Notification"
                sx={{
                  width: 28,
                  height: 28,
                  ml:1,
                  filter: theme.palette.mode === 'dark' ? 'invert(1)' : 'none'
                }} 
              />
            </Badge>
            <Typography variant="body1" sx={{ ml: { xs: 0.5, md: 1.5 }, fontWeight: 'bold', display: { xs: 'none', sm: 'block' }, color: theme.palette.primary.main }}>
              {i18n.t('notification')}
            </Typography>
          </Box>

          {/* Vertical divider */}
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
            <Box 
              component="img" 
              src={languageIcon} 
              alt="Language"
              sx={{
                width: 28,
                height: 28,
                mx: { xs: 0, sm: 1 },
                filter: theme.palette.mode === 'dark' ? 'invert(1)' : 'none'
              }} 
            />
            <Typography variant="body1" fontWeight="bold" sx={{ display: { xs: 'none', sm: 'block' } }}>
              {i18n.language === 'en' ? 'En' : 'Ar'}
            </Typography>
            {langMenuAnchor ? <ArrowDropUp /> : <ArrowDropDown />}
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
              src={user?.image} 
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