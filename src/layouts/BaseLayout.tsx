import Header from "./Header";
import Footer from "./Footer";
import {Outlet} from "react-router-dom";
import {Box} from "@mui/material";
import {ToastContainer} from 'react-toastify';

const BaseLayout = () => {
    return (
        <div>
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
        </div>
    );
}

export default BaseLayout;