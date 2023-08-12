import {Box, Button, DialogContentText} from "@mui/material";
import {useEffect, useState} from "react";
import {db, Logbook} from "../../model/db.tsx";
import {AdifExporter} from "../../classes/AdifExporter .tsx";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

interface LogbookAdifExporterProps {
    logbook: Logbook;
    onClose: () => void;
}

const LogbookAdifExporter = (props: LogbookAdifExporterProps) => {
    const [adifString, setAdifString] = useState('');
    const [isExporting, setIsExporting] = useState(true);

    useEffect(() => {
        setIsExporting(true);
        db.qsos.where('logbookId').equals(props.logbook.id||0).toArray().then((qsos) => {
            if (qsos.length > 0) {
                const adifExporter = new AdifExporter(qsos);
                const adifString = adifExporter.exportToAdif();
                setAdifString(adifString);
            }
            setIsExporting(false);
        });


    }, []);

    const getModalContent = () => {
        if (isExporting) return (<DialogContentText><Box>Exporting...</Box></DialogContentText>);
        return (
            <DialogContentText>
                <textarea style={{ width: '100%', height: 'calc(100vh - 300px)' }}>{adifString}</textarea>
            </DialogContentText>
        );
    };

    const handleDownload = () => {
        const fileName = props.logbook.name.replace(/[^\w\s]|_/g, "").replace(/\s+/g, "_") + '.adi';
        const blob = new Blob([adifString], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = fileName;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(downloadLink);
    };

    return (
        <Dialog
            open={true}
            onClose={props.onClose}
            fullWidth={true}
        >
            <DialogTitle>ADIF Export</DialogTitle>
            <DialogContent>
                {getModalContent()}
            </DialogContent>
            <DialogActions>
                <Button variant={'outlined'} onClick={props.onClose}>Close</Button>
                <Button variant={'contained'} onClick={handleDownload}>Download</Button>
            </DialogActions>
        </Dialog>
    );

};

export default LogbookAdifExporter;