import {
    createBrowserRouter,
} from "react-router-dom";
import LogbooksPage from "../pages/LogbooksPage";
import ErrorPage from "../pages/ErrorPage";
import BaseLayout from "../layouts/BaseLayout";
import SettingsPage from "../pages/SettingsPage";
import DXClusterPage from "../pages/DXClusterPage";
import LogbookPage from "../pages/LogbookPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <BaseLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <LogbooksPage />,
            },
            {
                path: "/logbook/:logbookId",
                element: <LogbookPage />,
            },
            {
                path: "settings",
                element: <SettingsPage />,
            },
            {
                path: "dx-cluster",
                element: <DXClusterPage />,
            }
        ]
    }
], { basename: "/field-logger" });

export default router;