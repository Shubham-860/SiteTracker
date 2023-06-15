import React, {useState} from 'react';
import {Menu, menuClasses, MenuItem, Sidebar, SubMenu} from 'react-pro-sidebar';
import {NavLink, useLocation} from 'react-router-dom';
import {BsCardChecklist, BsList, BsXLg} from 'react-icons/bs';

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
                width="250px"
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
                                <h2>Vishwaraj Enterprise</h2>
                            </div>
                            <MenuItem onClick={hide} active={location.pathname === "/SiteRegistration"}
                                      component={<NavLink to="/SiteRegistration"/>}>
                                Site Registration
                            </MenuItem>
                            <MenuItem onClick={hide} active={location.pathname === "/DriverRegistration"}
                                      component={<NavLink to="/DriverRegistration"/>}>
                                Driver Registration
                            </MenuItem>
                            <MenuItem onClick={hide} active={location.pathname === "/VehicleRegistration"}
                                      component={<NavLink to="/VehicleRegistration"/>}>
                                Vehicle Registration
                            </MenuItem>
                            <MenuItem onClick={hide} active={location.pathname === "/DieselPurchase"}
                                      component={<NavLink to="/DieselPurchase"/>}>
                                Diesel Purchase
                            </MenuItem>
                            <MenuItem onClick={hide} active={location.pathname === "/WorkEntry"}
                                      component={<NavLink to="/WorkEntry"/>}>
                                WorkEntry
                            </MenuItem>

                            <MenuItem onClick={hide} active={location.pathname === "/DriversSalary"}
                                      component={<NavLink to="/DriversSalary"/>}>
                                DriversSalary
                            </MenuItem>


                            <SubMenu label="Records" icon={<BsCardChecklist size={iconSize}/>}>
                                <MenuItem onClick={hide} component={<NavLink to="/Drivers"/>} active={location.pathname === "/DriversSalaryDrivers"}>
                                    Drivers
                                </MenuItem>
                                <MenuItem onClick={hide} component={<NavLink to="/Vehicles"/>} active={location.pathname === "/Vehicles"}>
                                    Vehicles
                                </MenuItem>
                                <MenuItem onClick={hide} component={<NavLink to="/WorkDone"/>} active={location.pathname === "/WorkDone"}>
                                    Work Done
                                </MenuItem>
                            </SubMenu>


                        </div>
                        <div className="d-flex justify-content-center mb-4">
                            <button className="btn btn-outline-light w-75" onClick={handleLogout}>
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
