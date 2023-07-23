import {Box} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useSelector} from "react-redux";
import {selectCurrentErrorMessage, selectCurrentErrorMetaData} from "../features/error/errorSlice";
import {useRouteError} from "react-router-dom";

const ErrorPage = () => {

    const message = useSelector(selectCurrentErrorMessage);
    const metadata = useSelector(selectCurrentErrorMetaData);
    const error = useRouteError();
    console.error('Route Error', error);

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            padding: '1rem',
        }}>
            <Typography variant="h4">Oh no!</Typography>
            <Typography variant="body1" align={'center'} gutterBottom>Ooops.. if you're seeing this there was an error</Typography>

            {message && <Box>
                <Typography variant="h6" align={'center'}>{message}</Typography>
                {metadata && <Box sx={{ border:'1px solid #ccc', padding: '15px' }}>
                    <pre>{JSON.stringify(metadata, null, 2)}</pre>
                </Box>}

            </Box>}
        </Box>
    );
};

export default ErrorPage;