import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {db, LogbookEntry} from "../../model/db";
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

interface ContactOptionsProps {
    contact: LogbookEntry;
}

const ContactOptions = (props: ContactOptionsProps) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const dispact = useDispatch();
    const { contact } = props;
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const deleteContact = () => {
        db.contacts.delete(contact.id || 0)
            .then(() => {
                toast.success('QSO deleted');
            })
            .catch((e) => {
                dispact(displayError({ message: 'Error when deleting QSO', metadata: e }));
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
                        Are you sure you want to delete the QSO with <strong>{contact.CALL}</strong> on <strong>{contact.QSO_DATE} {contact.TIME_ON}</strong> <br/><br/>
                        <strong>This action cannot be undone.</strong>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant={'outlined'} onClick={()=> setIsDeleteDialogOpen(false)}>Cancel</Button>
                    <Button variant={'contained'} onClick={deleteContact}>Confirm</Button>
                </DialogActions>
            </Dialog>
        );
    };


    return (
        <div>
            <IconButton
                id={`contact-options-${contact.id}`}
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                size="small"
            >
                <SettingsIcon fontSize={'inherit'} />
            </IconButton >
            <Menu
                id={`contact-options-menu-${contact.id}`}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': `contact-options-${contact.id}`,
                }}
            >
                <MenuItem onClick={()=> {
                    handleClose();
                    alert('Feature not implemented yet');
                }}>Edit</MenuItem>
                <MenuItem onClick={()=> {
                    handleClose();
                    alert('Feature not implemented yet');
                }}>Create QSL Card</MenuItem>
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
export default ContactOptions;