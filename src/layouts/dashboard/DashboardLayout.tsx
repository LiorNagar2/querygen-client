import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {Outlet, useNavigate} from 'react-router-dom';
import Button from '@mui/material/Button';
import SelectMenu, {SelectMenuOption} from "../../components/SelectMenu/SelectMenu";
import CloudIcon from "@mui/icons-material/Cloud";
import {
    selectEntityData,
    selectEntityError,
    selectEntityLoading,
    selectSelectedDatabaseId
} from "../../store/crud/crud.selectors";
import {useAppDispatch, useAppSelector} from "../../store/hooks";
import {connectToDatabase, fetchEntities} from "../../store/crud/crud.actions";
import {useContext, useEffect} from "react";
import {menuItems, Pages} from "./MainMenu";
import {setSelectedDatabase} from '../../store/crud/crud.slice';
import {CircularProgress} from "@mui/material";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import {ThemeModeContext} from "../../theme/themeContext";
import {toggleThemeMode} from '../../store/theme/theme.slice';
import Logo from '../../logo.png';
import {setSelectedDatabaseLocalStorage} from "../../utils/database";

const drawerWidth = 240;

interface Props {
}

export default function DashboardLayout(props: Props) {
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isClosing, setIsClosing] = React.useState(false);
    const navigate = useNavigate();

    const dispatch = useAppDispatch();
    const data = useAppSelector((state) => selectEntityData(state, 'database'));
    const loading = useAppSelector((state) => selectEntityLoading(state, 'database'));
    const error = useAppSelector((state) => selectEntityError(state, 'database'));
    const themeMode = useAppSelector((state) => state.theme.mode);

    const [databaseOptions, setDatabaseOptions] = React.useState<SelectMenuOption[]>([]);
    const selectedDatabaseId = useAppSelector(selectSelectedDatabaseId);

    useEffect(() => {
        if (selectedDatabaseId) {
            dispatch(fetchEntities(`queries`, `database/${selectedDatabaseId}/queries`));
            dispatch(connectToDatabase(selectedDatabaseId));
            setSelectedDatabaseLocalStorage(selectedDatabaseId);
        }
    }, [selectedDatabaseId]);

    useEffect(() => {
        const dbs: SelectMenuOption[] = data?.map((db: any) => {
            return {
                value: db._id,
                title: db.name,
            }
        }) || [];
        setDatabaseOptions(dbs);
        dispatch(setSelectedDatabase(selectedDatabaseId || dbs[0]?.value));
    }, [data]);

    useEffect(() => {
        dispatch(fetchEntities('database'));
    }, [dispatch]);

    const handleDatabaseChange = (event: any) => {
        dispatch(setSelectedDatabase(event.target.value));
    };

    const toggleMode = () => {
        dispatch(toggleThemeMode());
    };

    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };

    const drawer = (
        <Box
            component="main"
            sx={{
                flexGrow: 1,
            }}
        >
            <Toolbar/>
            <Toolbar>
                <Button
                    variant={'outlined'}
                    color="secondary"
                    fullWidth
                    onClick={() => navigate(Pages.DATABASE__CREATE)}
                >
                    Add New Database
                </Button>
            </Toolbar>
            <Divider/>
            <List>
                {menuItems.map((item, index) => (
                    <ListItem key={item.link} disablePadding>
                        <ListItemButton onClick={() => navigate(item.link)}>
                            <ListItemIcon>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text}/>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}>
                <CircularProgress disableShrink/>
            </Box>
        );
    }

    return (
        <Box sx={{display: 'flex'}}>
            <AppBar position="fixed" sx={{zIndex: (theme) => theme.zIndex.drawer + 1,}}>
                <Toolbar sx={{display: "flex", justifyContent: "space-between"}} variant="dense">
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{mr: 2, display: {sm: 'none'}}}
                    >
                        <MenuIcon/>
                    </IconButton>
                    {/* <Typography variant="h6" noWrap component="div">
                        My Awesome Database Dashboard
                    </Typography>*/}
                    {/*<Box
                        component="img"
                        sx={{
                            height: 64,
                            padding: '.8rem 0'
                        }}
                        alt="Your logo."
                        src={Logo}
                    />*/}

                    <Box component="a" href="/" sx={{display: "flex"}}>
                        <img src={Logo} alt="QuerygenAI" style={{height: 64, width: "auto", padding: '.8rem 0'}}/>
                    </Box>

                    <Box sx={{display: "flex", alignItems: "center"}}>
                        <IconButton
                            size="large"
                            aria-label="dark mode switcher"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={toggleMode}
                            color="inherit"
                        >
                            {themeMode === 'light' ? <DarkModeIcon/> : <LightModeIcon/>}
                        </IconButton>
                        <SelectMenu
                            //label="Select Database"
                            value={selectedDatabaseId}
                            options={databaseOptions}
                            onChange={handleDatabaseChange}
                            icon={<CloudIcon color={'primary'}/>} // ✅ Custom icon
                        />
                    </Box>
                </Toolbar>
            </AppBar>

            <Box sx={{width: {sm: drawerWidth}, flexShrink: {sm: 0}}} component="nav" aria-label="mailbox folders">
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onTransitionEnd={handleDrawerTransitionEnd}
                    onClose={handleDrawerClose}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: {xs: 'block', sm: 'none'},
                        '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: {xs: 'none', sm: 'block'},
                        '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    /*p: 3,*/
                    width: {sm: `calc(100% - ${drawerWidth}px)`},
                }}
            >
                <Toolbar/>
                <Outlet/>
            </Box>
        </Box>
    );
}
