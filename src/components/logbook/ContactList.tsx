import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../../model/db.tsx";
import {Box} from "@mui/material";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import ContactOptions from "./ContactOptions.tsx";

interface ContactListProps {
    logbookId: number
}

const ContactList = (props: ContactListProps) => {
    const contacts = useLiveQuery(() => db.contacts.where('logbookId').equals(props.logbookId).toArray());

    if(contacts?.length === 0) {
        return(
            <Paper sx={{ padding: '1rem' }}>
                <Box>
                    <Typography variant={'body1'} align={'center'}>
                        There are no contacts in this logbook yet.
                    </Typography>
                </Box>
            </Paper>
        );
    }

    return(
        <TableContainer component={Paper}>
            <Table sx={{ width: '100%' }} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Callsign</TableCell>
                        <TableCell>Freq.</TableCell>
                        <TableCell>Mode</TableCell>
                        <TableCell>RSTS</TableCell>
                        <TableCell>RSTR</TableCell>
                        <TableCell>Operator</TableCell>
                        <TableCell>Comments</TableCell>
                        <TableCell>&nbsp;</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {contacts?.map((item ) => (
                        <TableRow
                            key={item.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell>{item.QSO_DATE}<br/>{item.TIME_ON}</TableCell>
                            <TableCell>{item.CALL}</TableCell>
                            <TableCell>{item.FREQ}</TableCell>
                            <TableCell>{item.MODE}</TableCell>
                            <TableCell>{item.RST_SENT}</TableCell>
                            <TableCell>{item.RST_RCVD}</TableCell>
                            <TableCell>{item.NAME}</TableCell>
                            <TableCell>{item.COMMENT}</TableCell>
                            <TableCell align={'right'}>
                                <ContactOptions contact={item} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );

};

export default ContactList;