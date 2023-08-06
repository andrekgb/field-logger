import Paper from "@mui/material/Paper";
import {SubmitHandler, useForm} from "react-hook-form";
import {db, LogbookEntry} from "../../model/db.tsx";

import {displayError} from "../../features/error/errorSlice.tsx";
import {useDispatch} from "react-redux";
import {Box, Button, FormControlLabel, InputAdornment, Switch, TextField} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import {useEffect, useState} from "react";
import moment from "moment/moment";
import IconButton from "@mui/material/IconButton";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import Typography from "@mui/material/Typography";
import {bands, findBandByFrequency} from "../../utils/Bands.tsx";
import MenuItem from "@mui/material/MenuItem";

interface ContactFormProps {
    logbookId: number,
    yourCallsign: string,
}
const ContactForm = (props: ContactFormProps) => {
    const {logbookId, yourCallsign} = props;
    const [isTimerRunning, setTimeRunning] = useState(true);
    const [isSimpleForm, setSimpleForm] = useState(false);
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<LogbookEntry>({
        defaultValues: {
            RST_SENT: localStorage.getItem('RST_SENT') || '',
            RST_RCVD: localStorage.getItem('RST_RCVD') || '',
            BAND: localStorage.getItem('BAND') || '',
            MODE: localStorage.getItem('MODE') || '',
        }
    });

    useEffect(() => {
        const interval = setInterval(() => {
            if(isTimerRunning){
                setValue('QSO_DATE',moment.utc().format('YYYY-MM-DD'));
                setValue('TIME_ON',moment.utc().format('HH:mm:ss'));
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [isTimerRunning]);

    const clearForm = () => {
        setValue('CALL', '');
        setValue('NAME', '');
        setValue('COMMENT', '');
    }


    const onSubmit: SubmitHandler<LogbookEntry> = (data) => {

        localStorage.setItem('RST_SENT', data.RST_SENT);
        localStorage.setItem('RST_RCVD', data.RST_RCVD);
        if(data.FREQ) localStorage.setItem('FREQ', data.FREQ.toString());
        localStorage.setItem('BAND', data.BAND);
        localStorage.setItem('MODE', data.MODE);

        data.logbookId = logbookId;
        data.CALL = data.CALL.toUpperCase();
        if(data.TIME_ON.length === 5) data.TIME_ON = data.TIME_ON + ':00';
        data.STATION_CALLSIGN = yourCallsign;

        console.log('ContactForm.onSubmit', data);

        db.contacts.add(data)
            .then(() => {
                clearForm();
            })
            .catch((e) => {
                console.log('ContactForm.onSubmit', e);
                dispatch(displayError({message: 'Error adding the contact', metadata: e}));
            });
    };


    return(
        <Paper sx={{ padding: '1rem' }}>
            <form style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                <Box sx={{
                    display: 'flex',
                    gap: '1rem'
                }}>
                    <FormControl variant="standard" style={{flexGrow: 1}}>
                        <TextField
                            fullWidth={true}
                            label={'Callsign'}
                            variant={'outlined'}
                            {...register('CALL', { required: true })}
                            error={(errors.CALL !== undefined ? true : false)}
                            inputProps={{ style: { textTransform: 'uppercase' } }}
                            InputLabelProps={{ shrink: true }}
                        />
                    </FormControl>
                    <FormControl variant="standard" style={{width: '90px'}}>
                        <TextField
                            label={'RST S'}
                            variant={'outlined'}
                            {...register('RST_SENT', { required: true })}
                            error={(errors.RST_SENT !== undefined ? true : false)}
                            inputProps={{ maxLength: 3 }}
                            type={'number'}
                            InputLabelProps={{ shrink: true }}
                        />
                    </FormControl>
                    <FormControl variant="standard" style={{width: '90px'}}>
                        <TextField
                            label={'RST R'}
                            variant={'outlined'}
                            {...register('RST_RCVD', { required: true })}
                            error={(errors.RST_RCVD !== undefined ? true : false)}
                            inputProps={{ maxLength: 3 }}
                            type={'number'}
                            InputLabelProps={{ shrink: true }}
                        />
                    </FormControl>
                </Box>
                <Box sx={{
                    display: 'flex',
                    gap: '1rem'
                }}>
                    <TextField
                        fullWidth={true}
                        label={'Time'}
                        variant={'outlined'}
                        {...register('TIME_ON', {
                            required: true,
                            pattern: {
                                value: /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/,
                                message: 'Invalid time format (HH:mm:ss or HH:mm)',
                            }
                        })}
                        error={(errors.TIME_ON !== undefined ? true : false)}
                        disabled={isTimerRunning}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position={ 'end' }>
                                    <IconButton
                                        onClick={ () => setTimeRunning(!isTimerRunning) }
                                        color={ isTimerRunning ? 'primary' : 'secondary'}
                                    >
                                        {isTimerRunning ? <PauseIcon /> : <PlayArrowIcon />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        fullWidth={true}
                        label={'Date'}
                        variant={'outlined'}
                        {...register('QSO_DATE', {
                            required: true,
                            pattern: {
                                value: /^\d{4}-\d{2}-\d{2}$/,
                                message: 'Invalid date format (YYYY-MM-DD)',
                            }
                        })}
                        error={(errors.QSO_DATE !== undefined ? true : false)}
                        disabled={isTimerRunning}
                        InputLabelProps={{ shrink: true }}
                    />
                </Box>
                <Box sx={{
                    display: 'flex',
                    gap: '1rem'
                }}>
                    <TextField
                        fullWidth={true}
                        label={'Frequency'}
                        variant={'outlined'}
                        {...register('FREQ', {
                            required: true,
                            pattern: {
                                value: /^\d{1,3}\.\d{3}$/,
                                message: 'Invalid frequency format (e.g., XXX.XXX)'
                            }
                        })}
                        error={(errors.FREQ !== undefined ? true : false)}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position={ 'end' }>
                                    <Typography variant={'body2'}>MHz</Typography>
                                </InputAdornment>
                            ),
                        }}
                        onBlur={() => {
                            const freq = watch('FREQ') as unknown as string;
                            if(freq?.length > 0){
                                const band = findBandByFrequency(freq as unknown as number);
                                console.log('band', band);
                                if(band)setValue('BAND', band?.value);
                            }
                        }}
                    />
                    <TextField
                        fullWidth={true}
                        label={'Band'}
                        variant={'outlined'}
                        {...register('BAND', {required: true})}
                        error={(errors.BAND !== undefined ? true : false)}
                        InputLabelProps={{ shrink: true }}
                        select={true}
                    >
                        {bands.map((band) => (
                            <MenuItem key={band.value} value={band.value}>
                                {band.value.toUpperCase()}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
                <Box sx={{
                    display: 'flex',
                    gap: '1rem'
                }}>
                    <TextField
                        fullWidth={true}
                        label={'Mode'}
                        variant={'outlined'}
                        {...register('MODE', {required: true})}
                        error={(errors.MODE !== undefined ? true : false)}
                        InputLabelProps={{ shrink: true }}
                        select={true}
                    >
                        <MenuItem key={'CW'} value={'CW'}>CW</MenuItem>
                        <MenuItem key={'SSB'} value={'SSB'}>SSB</MenuItem>
                    </TextField>
                    <TextField
                        fullWidth={true}
                        label={'Operator'}
                        variant={'outlined'}
                        {...register('NAME')}
                        error={(errors.NAME !== undefined ? true : false)}
                        InputLabelProps={{ shrink: true }}
                    />
                </Box>
                <Box sx={{
                    display: 'flex',
                    gap: '1rem'
                }}>
                    <TextField
                        fullWidth={true}
                        label={'Comments'}
                        variant={'outlined'}
                        {...register('COMMENT')}
                        error={(errors.COMMENT !== undefined ? true : false)}
                        InputLabelProps={{ shrink: true }}
                    />
                </Box>
                <Box sx={{
                    display: 'flex',
                    gap: '1rem'
                }}>
                    <FormControlLabel
                        sx={{flexGrow: 1}}
                        control={<Switch
                            checked={isSimpleForm}
                            onChange={() => {
                                setSimpleForm(!isSimpleForm);
                        }} />} label="Short mode" />
                    <Button size={'small'} variant={'contained'} onClick={clearForm} color={'secondary'} type={'reset'}>Cancel</Button>
                    <Button size={'small'} variant={'contained'} onClick={handleSubmit(onSubmit)} type={'submit'} color={'success'}>Save</Button>
                </Box>

            </form>
        </Paper>
    );
};

export default ContactForm;