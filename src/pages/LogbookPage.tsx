import {Box} from "@mui/material";
import PageTitle from "../components/PageTitle";
import { useParams } from 'react-router-dom';
import {db} from "../model/db";
import {useLiveQuery} from "dexie-react-hooks";
import ContactList from "../components/logbook/ContactList.tsx";
import ContactForm from "../components/logbook/ContactForm.tsx";

const LogbookPage = () => {
    const { logbookId } = useParams();
    const logbook = useLiveQuery(() => db.logbooks.get(parseInt(logbookId ?? '0')));

    if(!logbook) {
        return (
            <Box>
                <PageTitle title={'Logbook'}/>
                <pre>Logbook not found</pre>
            </Box>
        );
    }

    return (
        <Box sx={{ display:'flex', flexDirection: 'column', gap:'1rem' }}>
            <PageTitle title={logbook.name}/>
            <ContactForm logbookId={logbook.id || 0} yourCallsign={logbook.callsign} />
            <ContactList logbookId={logbook.id || 0}  />

        </Box>
    );
};
export default LogbookPage;