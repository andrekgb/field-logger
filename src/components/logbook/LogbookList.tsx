import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../../model/db";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {Alert, Box} from "@mui/material";
import LogbookOptions from "./LogbookOptions";
import Typography from "@mui/material/Typography";
import {Link} from "react-router-dom";

const LogbookList = () => {
    const logbooks = useLiveQuery(() => db.logbooks.toArray());
    const logbooksEOF = logbooks?.length === 0;


    const renderTable = () => {
        if (logbooksEOF) {
            return (
                <Box sx={{padding: '1rem'}}>
                    <Typography variant={'body1'} align={'center'}>
                        You have no logbooks created on this browser yet.
                    </Typography>

                    <Alert sx={{
                        mt: '1rem',
                    }} severity="warning">
                        <Typography variant={'body1'}>

                            <strong>IMPORTANT</strong><br/><br/>
                            The data of this application is stored in <a
                            href={'https://en.wikipedia.org/wiki/Indexed_Database_API'} target={'_blank'}>Indexed DB</a>.
                            This means that the Logbooks and QSOs are stored in a database that exists in your
                            browser.<br/><br/>
                            This means that:
                            <ol>
                                <li><strong><u>You should not use this application in a incognito window</u></strong></li>
                                <li>The logbooks created in a browser will only exist in that browser. Example: you create a loogbook on Chrome, add some QSOs and close it. When you open Chrome again the logbook with your QSOs will be there. But if you open Firefox they will not.</li>
                                <li>If you clear your browser data, the logbooks and QSOs will be deleted. This is something regular users do not know how to do, some advanced users do. This warning is for the advanced users.</li>
                            </ol>
                        </Typography>
                    </Alert>
                </Box>
            );
        }
        return (
            <TableContainer component={Paper}>
                <Table sx={{width: '100%'}} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Template</TableCell>
                            <TableCell>QSOs</TableCell>
                            <TableCell>&nbsp;</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {logbooks?.map((logbook) => (
                            <TableRow
                                key={logbook.id}
                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                            >
                                <TableCell sx={{flexGrow: 1}}>
                                    <Link to={`/logbook/${logbook.id}`}>
                                        {logbook.name}
                                    </Link>
                                </TableCell>
                                <TableCell>{logbook.template}</TableCell>
                                <TableCell>{logbook.qsoCount || 0}</TableCell>
                                <TableCell align={'right'}>
                                    <LogbookOptions logbook={logbook}/>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    return (
        <Box>
            {renderTable()}
        </Box>
    );
};
export default LogbookList;