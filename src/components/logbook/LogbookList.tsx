import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../../model/db";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {Box} from "@mui/material";
import LogbookOptions from "./LogbookOptions";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";

const LogbookList = () => {
    const logbooks = useLiveQuery(() => db.logbooks.toArray());
    const logbooksEOF = logbooks?.length === 0;




    const renderTable = () => {
        if(logbooksEOF) {
            return (
                <Box sx={{ padding: '1rem' }}>
                    <Typography variant={'body1'} align={'center'}>
                        You have no logbooks created on this browser yet.
                    </Typography>
                </Box>
            );
        }
        return(
            <TableContainer component={Paper}>
                <Table sx={{ width: '100%' }} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Template</TableCell>
                            <TableCell>QSOs</TableCell>
                            <TableCell>&nbsp;</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {logbooks?.map((logbook ) => (
                            <TableRow
                                key={logbook.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell sx={{ flexGrow:1 }}>
                                    <Link to={`/logbook/${logbook.id}`}>
                                        {logbook.name}
                                    </Link>
                                </TableCell>
                                <TableCell>{logbook.template}</TableCell>
                                <TableCell>{logbook.qsoCount || 0}</TableCell>
                                <TableCell align={'right'}>
                                    <LogbookOptions logbook={logbook} />
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