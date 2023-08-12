import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../../model/db.tsx";
import {Box} from "@mui/material";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import ContactOptions from "./ContactOptions.tsx";
import moment from "moment";
import {DataGrid} from '@mui/x-data-grid';

interface ContactListProps {
    logbookId: number
}

const ContactList = (props: ContactListProps) => {
    const qsos = useLiveQuery(() => db.qsos.where('logbookId').equals(props.logbookId).toArray());

    if (qsos?.length === 0) {
        return (
            <Paper sx={{padding: '1rem'}}>
                <Box>
                    <Typography variant={'body1'} align={'center'}>
                        There are no contacts in this logbook yet.
                    </Typography>
                </Box>
            </Paper>
        );
    }

    const rows = qsos?.map((qso) => qso);

    return (
        <TableContainer component={Paper}>
            <DataGrid
                columns={[
                    {
                        headerName: 'Date', field: 'date', width: 200,
                        renderCell: (params) => {
                            return moment(params.value).format('MMM D, YYYY, h:mm a');
                        }
                    },
                    {headerName: 'Callsign', field: 'callsign'},
                    {headerName: 'Mode', field: 'mode'},
                    {headerName: 'RST S', field: 'rstSent'},
                    {headerName: 'RST R', field: 'rstReceived'},
                    {headerName: 'Freq.', field: 'frequency'},
                    {headerName: 'Band', field: 'band'},
                    {headerName: 'Operator', field: 'name'},
                    {headerName: 'Comments', field: 'comments'},
                    {headerName: ' ', field: 'id', width: 50, renderCell: (params) => <ContactOptions qso={params.row}/>},
                ]}
                rows={rows || []}
                pageSizeOptions={[10, 25, 50, 100]}
                sortModel={[{field: 'date', sort: 'desc'}]}
                disableColumnMenu={true}
            />
        </TableContainer>
    );

};

export default ContactList;