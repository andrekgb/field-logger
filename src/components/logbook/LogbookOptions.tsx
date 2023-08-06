import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {db, Logbook} from "../../model/db";
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import {Button, DialogContentText, Divider} from "@mui/material";
import {toast} from 'react-toastify';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {useDispatch} from "react-redux";
import {displayError} from "../../features/error/errorSlice";

interface LogbookOptionsProps {
    logbook: Logbook;
}

const LogbookOptions = (props: LogbookOptionsProps) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const dispact = useDispatch();
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const deleteLogbook = () => {
        db.deleteLogbook(props.logbook.id || 0)
            .then(() => {
                toast.success('Logbook deleted');
            })
            .catch((e) => {
                dispact(displayError({ message: 'Error when deleting logbook', metadata: e }));
            });
    };

    const renderDeleteDialog = () => {

        return(
            <Dialog
                open={isDeleteDialogOpen}
                onClose={()=> setIsDeleteDialogOpen(false)}
                fullWidth={true}
            >
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the logbook (<strong>{props.logbook.name}</strong>)? <br/><br/>
                        <strong>This action cannot be undone.</strong>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant={'outlined'} onClick={()=> setIsDeleteDialogOpen(false)}>Cancel</Button>
                    <Button variant={'contained'} onClick={deleteLogbook}>Confirm</Button>
                </DialogActions>
            </Dialog>
        );
    };


    return (
        <div>
            <IconButton
                id={`logbook-options-${props.logbook.id}`}
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                size="small"
            >
                <SettingsIcon fontSize={'inherit'} />
            </IconButton >
            <Menu
                id={`logbook-options-menu-${props.logbook.id}`}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': `logbook-options-${props.logbook.id}`,
                }}
            >
                <MenuItem onClick={()=> {
                    handleClose();
                    alert('Feature not implemented yet');
                }}>Edit</MenuItem>
                <MenuItem onClick={()=> {
                    handleClose();
                    alert('Feature not implemented yet');
                }}>Duplicate</MenuItem>
                <MenuItem onClick={()=> {
                    handleClose();
                    alert('Feature not implemented yet');
                }}>Export .ADI</MenuItem>
                <Divider />
                <MenuItem onClick={()=> {
                    handleClose();
                    setIsDeleteDialogOpen(true);
                }}>Delete</MenuItem>
            </Menu>
            {renderDeleteDialog()}
        </div>
    );
};
export default LogbookOptions;