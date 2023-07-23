import {Box, Button} from "@mui/material";
import PageTitle from "../components/PageTitle";
import LogbookList from "../components/logbook/LogbookList";
import {useState} from "react";
import LogbookForm from "../components/logbook/LogbookForm";
import AddIcon from '@mui/icons-material/Add';

const LogbooksPage = () => {
    const [isFormOpened, setIsFormOpened] = useState(false);
    return (
        <Box>
            <Box
                sx={{
                    display: 'flex',
                    gap: '1rem',
                    mb: '1rem',
                }}
            >
                <Box sx={{flexGrow: 1}}>
                    <PageTitle title={'Logbooks'} />
                </Box>
                <Button
                    variant="text"
                    size="small"
                    onClick={() => setIsFormOpened(true)}
                    startIcon={<AddIcon/>}
                >
                    New Logbook
                </Button>
            </Box>
            <LogbookForm
                isOpened={isFormOpened}
                onCreateSuccess={() => setIsFormOpened(false)}
                onCloseModal={() => setIsFormOpened(false)}
            />
            <Box>
                <LogbookList />
            </Box>

        </Box>
    );
};

export default LogbooksPage;