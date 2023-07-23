import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {Box} from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const UTCClock: React.FC = () => {
    const [utcTime, setUTCTime] = useState(moment.utc().format('YYYY-MM-DD HH:mm:ss'));

    useEffect(() => {
        const interval = setInterval(() => {
            setUTCTime(moment.utc().format('YYYY-MM-DD HH:mm:ss'));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Box sx={{
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            width: '130px'
        }}>
            <AccessTimeIcon sx={{
                fontSize: '14px'
            }} />&nbsp;
            <span>{utcTime}</span>
        </Box>
    );
};

export default UTCClock;
