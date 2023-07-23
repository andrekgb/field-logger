import {Box} from "@mui/material";
import PageTitle from "../components/PageTitle";
import { useParams } from 'react-router-dom';
import {db} from "../model/db";
import {useLiveQuery} from "dexie-react-hooks";

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
        <Box>
            <PageTitle title={logbook.name}/>
            <pre>{JSON.stringify(logbook, null, 2)}</pre>
        </Box>
    );
};
export default LogbookPage;