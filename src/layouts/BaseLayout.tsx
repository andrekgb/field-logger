import Header from "./Header";
import Footer from "./Footer";
import {Outlet} from "react-router-dom";
import {Box} from "@mui/material";
import {ToastContainer} from 'react-toastify';

const BaseLayout = () => {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
        }}>
            <Header/>
            <Box sx={{
                padding: '1rem',
            }}>
                <Outlet/>
            </Box>
            <Footer/>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </Box>
    );
}

export default BaseLayout;