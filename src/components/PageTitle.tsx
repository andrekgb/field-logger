import Typography from "@mui/material/Typography";
import {useEffect} from "react";

const PageTitle = ({ title }: { title: string }) => {

    useEffect(() => {
        document.title = `${title} - Field Logger`
    }, []);

    return (
        <Typography variant="h4" gutterBottom>{title}</Typography>
    );
};

export default PageTitle;