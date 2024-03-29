import {Route, Routes} from 'react-router-dom';
import './App.css'
import Accounts from "./pages/accounts.jsx";
import Profiles from "./pages/profiles.jsx";
import Campaigns from "./pages/campaigns.jsx";

function App() {

    return (
            <Routes >
                <Route index element={<Accounts/>}/>
                <Route path="/profiles" element={<Profiles/>}/>
                <Route path="/campaigns" element={<Campaigns/>}/>
            </Routes>
    )
}

export default App
