import './App.css';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {SideNavBar} from "./components/utils/SideNavBar";
import SiteRegistration from "./components/pages/Registration/SiteRegistration";
import Login from "./components/utils/Login";
import User from "./context/user";
import {useEffect, useRef, useState} from "react";
import DriverRegistration from "./components/pages/Registration/DriverRegistration";
import Error404 from '../src/assects/img/Error404.jpg'
import Cookies from 'js-cookie';
import DieselPurchase from "./components/pages/DieselPurchase";
import VehicleRegistration from "./components/pages/Registration/VehicleRegistration";
import WorkEntry from "./components/pages/WorkEntry";
import Drivers from "./components/pages/Reports/Drivers";
import Vehicles from "./components/pages/Reports/Vehicles";
import WorkDone from "./components/pages/Reports/WorkDone";
import DriversSalary from "./components/pages/DriversSalary";
import OwnerPayments from "./components/pages/OwnerPayments";
import SiteOwnerPayment from "./components/pages/Reports/SiteOwnerPayment";
import Diesel from "./components/pages/Reports/Diesel";
import Payments from "./components/pages/Reports/Payments";
import Sites from "./components/pages/Reports/Sites";
import Salarys from "./components/pages/Reports/Salarys";
import {Toast} from 'primereact/toast';
import Home from "./components/pages/Home";
import AddUser from "./components/pages/AddUser";
import Users from "./components/pages/Reports/Users";

function App() {
    const [login, setLogin] = useState(false);
    const [user, setUser] = useState({name: "user"});
    const toast = useRef(null);

    const updateUser = (newUser) => {
        setUser(newUser);
        setLogin(newUser.login);
    };

    const handleLogout = () => {
        Cookies.remove('loginCredentials');
        setUser({name: "user", login: false});
        setLogin(false);

        window.opener = null;
        window.open("", "_self");
        window.close();
    };
    const showSuccess = (no) => {
        toast.current.show({
            severity: 'success', summary: 'Success', detail: 'Login successful', life: 3000
        });
    }
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
            <Toast ref={toast}/>
            <BrowserRouter>
                {login && <SideNavBar handleLogout={handleLogout}/>}
                <Routes>
                    {!login ? (
                        <>
                            <Route path="/" element={<Login update={updateUser} showSuccess={showSuccess}/>}/>
                            <Route path="/login" element={<Login/>} update={updateUser} showSuccess={showSuccess}/>
                            <Route path="/*" element={<Navigate to="/" />} />

                        </>
                    ) : (
                        <>

                            <Route path="/" element={<Home/>}/>
                            <Route path="/Home" element={<Home/>}/>
                            <Route path="/SiteRegistration" element={<SiteRegistration/>}/>
                            <Route path="/DriverRegistration" element={<DriverRegistration/>}/>
                            <Route path="/DieselPurchase" element={<DieselPurchase/>}/>
                            <Route path="/VehicleRegistration" element={<VehicleRegistration/>}/>
                            <Route path="/WorkEntry" element={<WorkEntry/>}/>
                            <Route path="/Drivers" element={<Drivers/>}/>
                            <Route path="/Vehicles" element={<Vehicles/>}/>
                            <Route path="/WorkDone" element={<WorkDone/>}/>
                            <Route path="/DriversSalary" element={<DriversSalary/>}/>
                            <Route path="/OwnerPayments" element={<OwnerPayments/>}/>
                            <Route path="/SiteOwnerPayment" element={<SiteOwnerPayment/>}/>
                            <Route path="/Diesel" element={<Diesel/>}/>
                            <Route path="/Payments" element={<Payments/>}/>
                            <Route path="/Sites" element={<Sites/>}/>
                            <Route path="/Salarys" element={<Salarys/>}/>
                            <Route path="/AddUser" element={<AddUser/>}/>
                            <Route path="/Users" element={<Users/>}/>
                            <Route path="*" element={<div
                                className={'container d-flex justify-content-center align-content-around mt-md-3'}>
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
