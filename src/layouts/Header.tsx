import React, {useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import {useNavigate} from "react-router-dom";
import {Box, ListItemIcon} from "@mui/material";
import FactCheckIcon from '@mui/icons-material/FactCheck';
import AppSettingsAltIcon from '@mui/icons-material/AppSettingsAlt';
import PowerIcon from '@mui/icons-material/Power';
import UTCClock from "../components/UTCClock";


const Header: React.FC = () => {
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const navigate = useNavigate();

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event &&
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }
        setDrawerOpen(open);
    };

    const list = () => (
        <List>
            <ListItem button>
                <ListItemIcon>
                    <FactCheckIcon/>
                </ListItemIcon>
                <ListItemText primary="Logbooks" onClick={() => {
                    setDrawerOpen(false);
                    navigate('/')
                }}/>
            </ListItem>
            <ListItem button>
                <ListItemIcon>
                    <AppSettingsAltIcon/>
                </ListItemIcon>
                <ListItemText primary="Settings" onClick={() => {
                    setDrawerOpen(false);
                    navigate('/settings');
                }}/>
            </ListItem>
            <ListItem button>
                <ListItemIcon>
                    <PowerIcon/>
                </ListItemIcon>
                <ListItemText primary="DX Cluster" onClick={() => {
                    setDrawerOpen(false);
                    navigate('/dx-cluster');
                }}/>
            </ListItem>
            {/* Add more menu items as needed */}
        </List>
    );

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Box sx={{display: 'flex', flexGrow: 1, alignItems: 'center'}}>
                        <Typography variant="h6" component="div">Field Logger</Typography>
                        <Box sx={{flexGrow: 1, display: 'flex', justifyContent: 'center'}}>
                            <UTCClock/>
                        </Box>
                    </Box>

                    <IconButton edge="end" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
                        <MenuIcon/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Drawer
                anchor="right"
                open={isDrawerOpen}
                onClose={toggleDrawer(false)}
                style={{width: '80%'}}
            >
                {list()}
            </Drawer>
        </>
    );
};

export default Header;