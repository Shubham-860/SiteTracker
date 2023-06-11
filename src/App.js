import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { SideNavBar } from "./components/utils/SideNavBar";
import SiteRegistration from "./components/pages/SiteRegistration";
import Login from "./components/pages/Login";
import User from "./context/user";
import { useEffect, useState } from "react";
import DriverRegistration from "./components/pages/DriverRegistration";
import Error404 from '../src/assects/img/Error404.jpg'
import Cookies from 'js-cookie';
import DieselPurchase from "./components/pages/DieselPurchase";
import VehicleRegistration from "./components/pages/VehicleRegistration";
import VehicleWorkEntry from "./components/pages/VehicleWorkEntry";

function App() {
    const [login, setLogin] = useState(false);
    const [user, setUser] = useState({ name: "user" });

    const updateUser = (newUser) => {
        setUser(newUser);
        setLogin(newUser.login);
    };

    const handleLogout = () => {
        Cookies.remove('loginCredentials');
        setUser({ name: "user", login: false });
        setLogin(false);

    };

    useEffect(() => {
        const storedCredentials = Cookies.get('loginCredentials');
        if (storedCredentials) {
            const userCredentials = JSON.parse(storedCredentials);
            setUser(userCredentials);
            setLogin(userCredentials.login);
        }
    }, []);

    return (
        <User.Provider value={[user, setUser]}>
            <BrowserRouter>
                {login&&<SideNavBar handleLogout={handleLogout} />}
                <Routes>
                    {!login ? (
                        <>
                            <Route path="/" element={<Login update={updateUser} />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/*" element={<Navigate to="/" />} />
                        </>
                    ) : (
                        <>

                            <Route path="/" element={<SiteRegistration />} />
                            <Route path="/SiteRegistration" element={<SiteRegistration />} />
                            <Route path="/DriverRegistration" element={<DriverRegistration />} />
                            <Route path="/DieselPurchase" element={<DieselPurchase />} />
                            <Route path="/VehicleRegistration" element={<VehicleRegistration />} />
                            <Route path="/VehicleWorkEntry" element={<VehicleWorkEntry />} />
                            <Route path="/p11" element={<div>p11</div>} />
                            <Route path="/p12" element={<div>p12</div>} />
                            <Route path="/p2" element={<div>p2</div>} />
                            <Route path="/*" element={<Navigate to="/" />} />
                            <Route path="*" element={<div className={'container d-flex justify-content-center align-content-around mt-md-3'}>
                                <div className={'col-md-8'}>
                                    <img className={'img-fluid w-auto'} src={Error404} alt={'error 404'}/>
                                </div>
                            </div>}/>

                        </>
                    )}
                </Routes>
            </BrowserRouter>
        </User.Provider>
    );
}

export default App;
