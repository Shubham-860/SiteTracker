import React, {useContext, useState} from 'react';
import {Menu, menuClasses, MenuItem, Sidebar, SubMenu} from 'react-pro-sidebar';
import {NavLink, useLocation} from 'react-router-dom';
import {
    BsBuildingAdd,
    BsCardChecklist,
    BsCreditCard2Front,
    BsList, BsPeople, BsPerson, BsPersonAdd,
    BsPersonPlus,
    BsPersonVcard,
    BsXLg
} from 'react-icons/bs';
import {AiOutlineAppstoreAdd} from "react-icons/ai";
import {BiCar, BiGasPump, BiHomeAlt2, BiMoneyWithdraw} from "react-icons/bi";
import {FaRegMoneyBillAlt} from "react-icons/fa";
import User from "../../context/user";


const SlideBarBtn = ({toggled, setToggled}) => {
    return (
        <div>
            <button className="sb-button btn btn-outline-dark" onClick={() => setToggled(!toggled)}>
                {toggled ? <BsXLg size={25}/> : <BsList size={25}/>}
            </button>
        </div>
    );
};

const SideNavBar = ({handleLogout}) => {
    const [toggled, setToggled] = useState(false);
    const iconSize = 25;
    const location = useLocation();
    const user = useContext(User);
    console.log(location.pathname);
    const hide = () => {
        setToggled(!toggled);
    };
    // const handleLogout = () => {
    //     setUser({}); // Clear the user context
    //     Cookies.remove('loginCredentials'); // Remove the login credentials cookie
    //     navigate('/login'); // Redirect to the login page
    // };

    return (
        <div style={{display: 'flex', height: '100%', minHeight: '400px', position: 'fixed', zIndex: 1}}>
            <Sidebar
                toggled={toggled}
                collapsedWidth="60px"
                width="300px"
                backgroundColor="rgba(45,45,45,0.85)"
                image="https://images.unsplash.com/photo-1531804055935-76f44d7c3621?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=388&q=80"
                transitionDuration={500}
                onBackdropClick={() => setToggled(false)}
                breakPoint="always"
            >
                <Menu
                    transitionDuration={500}
                    menuItemStyles={{
                        button: ({level, active, disabled}) => {
                            // only apply styles on first level elements of the tree
                            if (level === 0)
                                return {
                                    color: disabled ? 'rgba(90,90,90,0.88)' : '#ffffff',
                                    backgroundColor: active ? 'rgba(239,239,239,0.4)' : undefined,
                                    margin: '5px',
                                    borderRadius: '5px',
                                    "&:hover": {
                                        backgroundColor: 'rgba(234,233,233,0.18)',
                                    }
                                };
                            else {
                                return {
                                    color: disabled ? 'rgba(90,90,90,0.88)' : '#ffffff',
                                    backgroundColor: active ? 'rgba(239,239,239,0.4)' : undefined,
                                    borderRadius: '5px',
                                    "&:hover": {
                                        backgroundColor: 'rgba(234,233,233,0.27)',
                                    }
                                }
                            }
                        },
                    }}
                    rootStyles={{
                        ['.' + menuClasses.subMenuContent]: {
                            margin: '5px',
                            borderRadius: '5px',
                            backgroundColor: 'rgba(197,197,197,0.15)',
                            "&:hover": {
                                backgroundColor: 'rgba(234,233,233,0.18)',
                            }
                        },
                    }}
                >
                    <div className="d-flex flex-column justify-content-between" style={{height: "100vh"}}>
                        <div>
                            <div className="py-3 px-1 text-light text-center border-bottom border-secondary">
                                <h2>Site Tracker</h2>
                            </div>


                            <MenuItem onClick={hide} icon={<BiHomeAlt2 size={iconSize}/>}
                                      active={location.pathname === "/Home"}
                                      component={<NavLink to="/Home"/>}>
                                Home
                            </MenuItem>


                            <SubMenu label={'Registration'} icon={< AiOutlineAppstoreAdd size={iconSize}/>}>


                                <MenuItem onClick={hide} icon={< BsBuildingAdd size={iconSize}/>}
                                          active={location.pathname === "/SiteRegistration"}
                                          component={<NavLink to="/SiteRegistration"/>}>
                                    Site Registration
                                </MenuItem>

                                <MenuItem onClick={hide} icon={<BsPersonPlus size={iconSize}/>}
                                          active={location.pathname === "/DriverRegistration"}
                                          component={<NavLink to="/DriverRegistration"/>}>
                                    Driver Registration
                                </MenuItem>

                                <MenuItem onClick={hide} icon={<BiCar size={iconSize}/>}
                                          active={location.pathname === "/VehicleRegistration"}
                                          component={<NavLink to="/VehicleRegistration"/>}>
                                    Vehicle Registration
                                </MenuItem>


                            </SubMenu>


                            <MenuItem onClick={hide} icon={<BsPersonVcard size={iconSize}/>}
                                      active={location.pathname === "/WorkEntry"}
                                      component={<NavLink to="/WorkEntry"/>}>
                                Work Entry
                            </MenuItem>

                            <SubMenu label={'Payments'} icon={< BsCreditCard2Front size={iconSize}/>}>

                                <MenuItem onClick={hide} icon={< BiGasPump size={iconSize}/>}
                                          active={location.pathname === "/DieselPurchase"}
                                          component={<NavLink to="/DieselPurchase"/>}>
                                    Diesel Purchase
                                </MenuItem>

                                <MenuItem onClick={hide} icon={<BiMoneyWithdraw size={iconSize}/>}
                                          active={location.pathname === "/DriversSalary"}
                                          component={<NavLink to="/DriversSalary"/>}>
                                    Drivers Salary
                                </MenuItem>

                                <MenuItem onClick={hide} icon={<FaRegMoneyBillAlt size={iconSize}/>}
                                          active={location.pathname === "/OwnerPayments"}
                                          component={<NavLink to="/OwnerPayments"/>}>
                                    Owner Payments
                                </MenuItem>

                            </SubMenu>


                            <SubMenu label="Records" icon={<BsCardChecklist size={iconSize}/>}>
                                <MenuItem onClick={hide} component={<NavLink to="/Sites"/>}
                                          active={location.pathname === "/Sites"}>
                                    Sites
                                </MenuItem>
                                <MenuItem onClick={hide} component={<NavLink to="/Drivers"/>}
                                          active={location.pathname === "/DriversSalaryDrivers"}>
                                    Drivers
                                </MenuItem>
                                <MenuItem onClick={hide} component={<NavLink to="/Vehicles"/>}
                                          active={location.pathname === "/Vehicles"}>
                                    Vehicles
                                </MenuItem>
                                <MenuItem onClick={hide} component={<NavLink to="/Diesel"/>}
                                          active={location.pathname === "/Diesel"}>
                                    Diesel
                                </MenuItem>
                                <MenuItem onClick={hide} component={<NavLink to="/WorkDone"/>}
                                          active={location.pathname === "/WorkDone"}>
                                    Work Done
                                </MenuItem>
                                <MenuItem onClick={hide} component={<NavLink to="/SiteOwnerPayment"/>}
                                          active={location.pathname === "/SiteOwnerPayment"}>
                                    Site Owner Payment
                                </MenuItem>
                                <MenuItem onClick={hide} component={<NavLink to="/Salarys"/>}
                                          active={location.pathname === "/Salarys"}>
                                    Salarys
                                </MenuItem>
                                <MenuItem onClick={hide} component={<NavLink to="/Payments"/>}
                                          active={location.pathname === "/Payments"}>
                                    Payments
                                </MenuItem>
                            </SubMenu>

                            {user[0].superuser === 'Yes' &&
                                <SubMenu label={'User'} icon={<BsPerson size={iconSize} />}>
                                    <MenuItem onClick={hide} icon={<BsPersonAdd size={iconSize}/>}
                                              active={location.pathname === "/AddUser"}
                                              component={<NavLink to="/AddUser"/>}>
                                        Add User
                                    </MenuItem>
                                    <MenuItem onClick={hide} icon={<BsPeople size={iconSize}/>}
                                              active={location.pathname === "/Users"}
                                              component={<NavLink to="/Users"/>}>
                                        Users
                                    </MenuItem>
                                </SubMenu>

                            }

                        </div>
                        <div className="d-flex justify-content-center mb-4">
                            <button className="btn btn-outline-light w-75 my-3" onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    </div>
                </Menu>
            </Sidebar>
            <main style={{padding: 10, position: "fixed", right: 0}}>
                <SlideBarBtn toggled={toggled} setToggled={setToggled}/>
            </main>
        </div>
    );
};

export {SideNavBar, SlideBarBtn};
