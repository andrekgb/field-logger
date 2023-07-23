import {Box} from "@mui/material";
import PageTitle from "../components/PageTitle";
import React, {useEffect, useState} from "react";
import axios from 'axios';
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import moment from 'moment';
import {TableVirtuoso} from "react-virtuoso";

const DXClusterPage = () => {
    const [data, setData] = useState<any[]>([]);

    const fetchData = async () => {
        try {
            const response = await axios.get(
                'http://www.dxsummit.fi/api/v1/spots?limit_time=true&refresh='+new Date().getTime()
            );
            const newData = response.data.concat(data);
            setData(newData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        // Fetch data initially when the component mounts
        fetchData();

        // Setup a timer to fetch data every 30 seconds
        const timer = setInterval(fetchData, 30000);

        // Clean up the timer when the component unmounts
        return () => clearInterval(timer);
    }, []); // The empty dependency array ensures this effect runs only once when the component mounts

    // @ts-ignore
    const Scroller = React.forwardRef((props, ref) => <TableContainer component={Paper} {...props} ref={ref} />);
    const TableBody = React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />);
    const renderTableVirtuoso = () => {

        const headerCellStyle = { background: 'white' };
        return (
            <TableVirtuoso
                style={{ height: 'calc(100vh - 145px)' }}
                data={data}
                fixedHeaderContent={() => (
                    <TableRow>
                        <TableCell sx={headerCellStyle}>DX</TableCell>
                        <TableCell sx={headerCellStyle}>Freq.</TableCell>
                        <TableCell sx={headerCellStyle}>Time</TableCell>
                        <TableCell sx={headerCellStyle}>Country</TableCell>
                        <TableCell sx={headerCellStyle}>Spotter</TableCell>
                        <TableCell sx={{...headerCellStyle, ...{minWidth:'150px'}}}>Info</TableCell>
                    </TableRow>
                )}
                itemContent={(index, row) => {

                    const rowStyle = { background: index % 2 ? '#f9f9f9' : '#fff' };

                    return (
                        <>
                            <TableCell sx={rowStyle}>{row.dx_call}</TableCell>
                            <TableCell sx={rowStyle}>{row.frequency}</TableCell>
                            <TableCell sx={rowStyle}>{moment.utc(row.time).format('HH:mm')}</TableCell>
                            <TableCell sx={rowStyle}>{row.dx_country}</TableCell>
                            <TableCell sx={rowStyle}>{row.de_call}</TableCell>
                            <TableCell sx={rowStyle}>{row.info}</TableCell>
                        </>
                    )
                }}
            />
        )
    }


    return (
        <Box>
            <PageTitle title={'DX Cluster'} />
            {/*{renderTable()}*/}
            {renderTableVirtuoso()}
        </Box>
    );
};
export default DXClusterPage;