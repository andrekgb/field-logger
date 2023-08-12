import Paper from "@mui/material/Paper";
import {SubmitHandler, useForm} from "react-hook-form";
import {db, QSO} from "../../model/db.tsx";

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
import SelectInput from "../form/SelectInput.tsx";

interface LogbookEntry extends QSO {
    date_str: string,
    time_str: string,
}

interface ContactFormProps {
    logbookId: number
}

const ContactForm = (props: ContactFormProps) => {
    const {logbookId} = props;
    const [isTimerRunning, setTimeRunning] = useState(true);
    const [isSimpleForm, setSimpleForm] = useState(false);
    const dispatch = useDispatch();

    const defaultValues = {
        rstSent: localStorage.getItem('rstSent') || '',
        rstReceived: localStorage.getItem('rstReceived') || '',
        band: localStorage.getItem('band') || '',
        mode: localStorage.getItem('mode') || '',
    };

    if(localStorage.getItem('frequency')) {
        const formatter = new Intl.NumberFormat(undefined, {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3,
        });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        defaultValues['frequency'] = formatter.format(parseFloat(localStorage.getItem('frequency') || ''));
    }

    const {
        register,
        handleSubmit,
        formState: {errors},
        setValue,
        watch,
    } = useForm<LogbookEntry>({
        defaultValues
    });

    useEffect(() => {
        const interval = setInterval(() => {
            if (isTimerRunning) {
                setValue('date_str', moment.utc().format('YYYY-MM-DD'));
                setValue('time_str', moment.utc().format('HH:mm:ss'));
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [isTimerRunning]);

    const clearForm = () => {
        setValue('callsign', '');
        setValue('name', '');
        setValue('comments', '');
    }


    const onSubmit: SubmitHandler<LogbookEntry> = (data) => {
        data.logbookId = logbookId;
        data.callsign = data.callsign.toUpperCase();
        if (data.time_str.length === 5) data.time_str = data.time_str + ':00';
        data.date = moment(`${data.date_str} ${data.time_str}`, 'YYYY-MM-DD HH:mm:ss').toDate();

        const entry: QSO = data;
        db.insertQSO(entry)
            .then(() => {
                clearForm();
            })
            .catch((e) => {
                console.log('ContactForm.onSubmit', data, e);
                dispatch(displayError({message: 'Error adding the contact', metadata: e}));
            });
    };

    const toggleSimpleForm = () => {
        if(!isSimpleForm) {
            if(!watch('time_str') || !watch('date_str') || (!watch('frequency') && !watch('band')) || !watch('mode')) {
                alert('You have to fill all the following fields to be able to enable this mode: Date, Time, Frequency/Band, Mode');
                return;
            }
        }
        setSimpleForm(!isSimpleForm);
    };

    const renderSimpleForm = () => {
        if(!isSimpleForm) return null;
        const str = `Band: ${watch('band')}. ${(watch('frequency') ? `Freq.: ${watch('frequency')} Mhz` : '')} Mode: ${watch('mode')}. Date: ${watch('date_str')}. Time: ${watch('time_str')} `;
        return (
            <Box sx={{ width:'100%'}}>
                <Typography variant={'caption'}>{str}</Typography>
            </Box>
        );
    }

    return (
        <Paper sx={{padding: '1rem'}}>
            <form style={{display: 'flex', flexDirection: 'column', gap: '1rem'}} autoComplete={'off'}>
                <Box sx={{
                    display: 'flex',
                    gap: '1rem'
                }}>
                    <FormControl variant="standard" style={{flexGrow: 1}}>
                        <TextField
                            fullWidth={true}
                            label={'Callsign'}
                            variant={'outlined'}
                            {...register('callsign', {required: true})}
                            error={(errors.callsign !== undefined ? true : false)}
                            inputProps={{style: {textTransform: 'uppercase'}}}
                            InputLabelProps={{shrink: true}}
                        />
                    </FormControl>
                    <FormControl variant="standard" style={{width: '90px'}}>
                        <TextField
                            label={'RST S'}
                            variant={'outlined'}
                            {...register('rstSent', {required: true})}
                            error={(errors.rstSent !== undefined ? true : false)}
                            inputProps={{maxLength: 3}}
                            type={'number'}
                            InputLabelProps={{shrink: true}}
                        />
                    </FormControl>
                    <FormControl variant="standard" style={{width: '90px'}}>
                        <TextField
                            label={'RST R'}
                            variant={'outlined'}
                            {...register('rstReceived', {required: true})}
                            error={(errors.rstReceived !== undefined ? true : false)}
                            inputProps={{maxLength: 3}}
                            type={'number'}
                            InputLabelProps={{shrink: true}}
                        />
                    </FormControl>
                </Box>
                {renderSimpleForm()}

                {!isSimpleForm && (
                    <>
                        <Box sx={{
                            display: 'flex',
                            gap: '1rem'
                        }}>
                            <TextField
                                fullWidth={true}
                                label={'Time'}
                                variant={'outlined'}
                                {...register('time_str', {
                                    required: true,
                                    pattern: {
                                        value: /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/,
                                        message: 'Invalid time format (HH:mm:ss or HH:mm)',
                                    }
                                })}
                                error={(errors.time_str !== undefined ? true : false)}
                                disabled={isTimerRunning}
                                InputLabelProps={{shrink: true}}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position={'end'}>
                                            <IconButton
                                                onClick={() => setTimeRunning(!isTimerRunning)}
                                                color={isTimerRunning ? 'primary' : 'secondary'}
                                            >
                                                {isTimerRunning ? <PauseIcon/> : <PlayArrowIcon/>}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                fullWidth={true}
                                label={'Date'}
                                variant={'outlined'}
                                {...register('date_str', {
                                    required: true,
                                    pattern: {
                                        value: /^\d{4}-\d{2}-\d{2}$/,
                                        message: 'Invalid date format (YYYY-MM-DD)',
                                    }
                                })}
                                error={(errors.date_str !== undefined ? true : false)}
                                disabled={isTimerRunning}
                                InputLabelProps={{shrink: true}}
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
                                {...register('frequency', {
                                    required: true,
                                    pattern: {
                                        value: /^\d{1,3}\.\d{3}$/,
                                        message: 'Invalid frequency format (e.g., XXX.XXX)'
                                    }
                                })}
                                type={'number'}
                                error={(errors.frequency !== undefined ? true : false)}
                                InputLabelProps={{shrink: true}}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position={'end'}>
                                            <Typography variant={'body2'}>MHz</Typography>
                                        </InputAdornment>
                                    ),
                                }}
                                onBlur={() => {
                                    const freq = watch('frequency') as unknown as string;
                                    if (freq?.length > 0) {
                                        const band = findBandByFrequency(freq as unknown as number);
                                        if (band) setValue('band', band?.value);

                                        localStorage.setItem('frequency', freq);

                                    }
                                }}
                            />
                            <FormControl variant="standard" fullWidth={true}>
                                <SelectInput
                                    label={'Band'}
                                    variant={'outlined'}
                                    value={watch('band')}
                                    {...register('band', {required: true})}
                                    error={(errors.band !== undefined ? true : false)}
                                    onBlur={() => {
                                        const band = watch('band') as string;
                                        if (band?.length > 0) {
                                            localStorage.setItem('band', band);
                                        }
                                    }}
                                >
                                    {bands.map((band) => (
                                        <MenuItem key={band.value} value={band.value}>
                                            {band.value.toUpperCase()}
                                        </MenuItem>
                                    ))}
                                </SelectInput>
                            </FormControl>

                        </Box>
                    </>
                )}
                <Box sx={{
                    display: 'flex',
                    gap: '1rem'
                }}>
                    {!isSimpleForm && (
                    <FormControl variant="standard" fullWidth={true}>
                        <SelectInput
                            label={'Mode'}
                            variant={'outlined'}
                            value={watch('mode')}
                            {...register('mode', {required: true})}
                            error={(errors.mode !== undefined ? true : false)}
                            onBlur={() => {
                                const mode = watch('mode') as string;
                                if (mode?.length > 0) {
                                    localStorage.setItem('mode', mode);
                                }
                            }}
                        >
                            <MenuItem value={'CW'}>CW</MenuItem>
                            <MenuItem value={'SSB'}>SSB</MenuItem>
                        </SelectInput>
                    </FormControl>
                    )}

                    <TextField
                        fullWidth={true}
                        label={'Operator'}
                        variant={'outlined'}
                        {...register('name')}
                        error={(errors.name !== undefined ? true : false)}
                        InputLabelProps={{shrink: true}}
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
                        {...register('comments')}
                        error={(errors.comments !== undefined ? true : false)}
                        InputLabelProps={{shrink: true}}
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
                            onChange={toggleSimpleForm}/>} label="Short mode"/>
                    <Button size={'small'} variant={'contained'} onClick={clearForm} color={'secondary'}
                            type={'reset'}>Cancel</Button>
                    <Button size={'small'} variant={'contained'} onClick={handleSubmit(onSubmit)} type={'submit'}
                            color={'success'}>Save</Button>
                </Box>

            </form>
        </Paper>
    );
};

export default ContactForm;