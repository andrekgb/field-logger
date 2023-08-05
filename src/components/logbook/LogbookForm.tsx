import { useForm, SubmitHandler } from "react-hook-form"
import {db, Logbook, LogbookTemplate} from "../../model/db";
import {Box, Button, FormHelperText, TextField} from "@mui/material";
import {useDispatch} from "react-redux";
import {displayError} from "../../features/error/errorSlice";
import {toast} from 'react-toastify';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import SelectInput from "../form/SelectInput";
const LogbookForm = (props: {isOpened: boolean, onCreateSuccess: () => void, onCloseModal: () => void}) => {
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<Logbook>();

    const onSubmit: SubmitHandler<Logbook> = (data) => {
        db.logbooks.add({name: data.name, callsign:data.callsign, template: data.template})
            .then(() => {
                toast.success('Logbook created');
                setValue('name', '');
                setValue('template', LogbookTemplate.GENERIC);
                props.onCreateSuccess();
            })
            .catch((e) => {
                console.log('LogbookForm.onSubmit', e);
                dispatch(displayError({message: 'Error when creating logbook', metadata: e}));
            });
    };

    return(
        <form onSubmit={handleSubmit(onSubmit)}>
        <Dialog
            open={props.isOpened}
            onClose={props.onCloseModal}
            fullWidth={true}
        >
            <DialogTitle>New Logbook</DialogTitle>
            <DialogContent>
                <Box sx={{
                    display: 'flex',
                    gap: '1rem',
                    flexDirection: 'column',
                    mt: '1rem',
                }}>
                    <FormControl variant="standard">
                        <TextField
                            fullWidth={true}
                            label={'Logbook name'}
                            variant={'outlined'}
                            {...register('name', { required: true })}
                        />
                        { errors.name && <FormHelperText error={true}>This field is required</FormHelperText> }
                    </FormControl>

                    <FormControl variant="standard">
                        <TextField
                            fullWidth={true}
                            label={'Your callsign'}
                            variant={'outlined'}
                            {...register('callsign', { required: true })}
                        />
                        { errors.name && <FormHelperText error={true}>This field is required</FormHelperText> }
                    </FormControl>

                    <FormControl variant="standard">
                        <SelectInput
                            label={'Template'}
                            variant={'outlined'}
                            value={watch('template')}
                            {...register('template', { required: true })}
                        >
                            <MenuItem value={LogbookTemplate.GENERIC}>Generic</MenuItem>
                            <MenuItem value={LogbookTemplate.POTA}>POTA</MenuItem>
                            <MenuItem value={LogbookTemplate.SST}>Slow Speed Contest</MenuItem>
                        </SelectInput>
                        { errors.template && <FormHelperText error={true}>This field is required</FormHelperText> }
                    </FormControl>
                </Box>

            </DialogContent>
            <DialogActions>
                <Button variant={'outlined'} onClick={props.onCloseModal}>Cancel</Button>
                <Button variant={'contained'} type={'submit'} onClick={handleSubmit(onSubmit)}>Create</Button>
            </DialogActions>
        </Dialog>
        </form>
    );

};

export default LogbookForm;