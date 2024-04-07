import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Toast } from 'primereact/toast';
import Header from '../utils/Header';
import {baseUrl} from "../utils/baseUrl";

const AddUser = () => {
    const [showWarning, setShowWarning] = useState(false);
    const [drivers, setDrivers] = useState([]);
    const [user, setUser] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        superuser: false,
    });
    const [passwordMatch, setPasswordMatch] = useState(true);

    const toast = useRef(null);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleCheckboxChange = (e) => {
        setUser({ ...user, superuser: e.target.checked });
    };

    function onSubmit(e) {
        e.preventDefault();
        const isAnyFieldEmpty = Object.values(user).some((value) => value === '');

        if (isAnyFieldEmpty) {
            setShowWarning(true);
        } else {
            axios
                .post(`${baseUrl}/addUser`, user)
                .then((res) => {
                    console.log(res);
                    toast.current.show({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'User details added successfully',
                        life: 3000,
                    });
                })
                .catch((err) => {
                    toast.current.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Something went wrong',
                        life: 3000,
                    });
                    console.log(err);
                });
            setUser({
                email: '',
                password: '',
                confirmPassword: '',
                superuser: false,
            });
        }
    }

    useEffect(() => {
        axios
            .get(`${baseUrl}/getDrivers`)
            .then((response) => {
                setDrivers(response.data);
                console.log(drivers);
            })
            .catch((error) => console.log(error));
    }, []);

    return (
        <>
            <Header title={'Add user'} />
            <Toast ref={toast} />
            <div className={'container mt-4 border-black'}>
                {showWarning && (
                    <div className="col-12 alert alert-warning" role="alert">
                        Please fill in all the required fields.
                    </div>
                )}
                <h5>User Information</h5>
                <form className="row g-3">
                    <div className="row g-3">
                        {/* email */}
                        <div className="col-md-4">
                            <label htmlFor="input1" className="form-label">
                                Email
                            </label>
                            <input
                                name={'email'}
                                type="email"
                                id={'input1'}
                                className="form-control borderBlack"
                                placeholder="Email"
                                aria-label="email"
                                required={true}
                                value={user.email}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Password */}
                        <div className="col-md-4">
                            <label htmlFor="input2" className="form-label">
                                Password
                            </label>
                            <input
                                name={'password'}
                                type="password"
                                id={'input2'}
                                className="form-control"
                                placeholder="Password"
                                aria-label="Password"
                                required={true}
                                value={user.password}
                                onChange={handleChange}
                            />
                        </div>

                        {/* confirm password */}
                        <div className="col-md-4">
                            <label htmlFor="input3" className="form-label">
                                Confirm Password
                            </label>
                            <input
                                name={'confirmPassword'}
                                type="password"
                                id={'input3'}
                                className={`form-control ${!passwordMatch && 'border-danger'}`}
                                placeholder="Confirm Password"
                                aria-label="Confirm Password"
                                required={true}
                                value={user.confirmPassword}
                                onChange={(e) => {
                                    handleChange(e);
                                    if (e.target.value === user.password) {
                                        setPasswordMatch(true);
                                    } else {
                                        setPasswordMatch(false);
                                    }
                                }}
                            />
                            {!passwordMatch && (
                                <div className="text-danger">Passwords do not match</div>
                            )}
                        </div>

                        {/* superuser checkbox */}
                        <div className="col-md-4">
                            <label htmlFor="superuserCheckbox" className="form-label">
                                Administrator Account
                            </label>
                            <div className="form-check">
                                <input
                                    name={'superuser'}
                                    className="form-check-input"
                                    type="checkbox"
                                    id="superuserCheckbox"
                                    checked={user.superuser}
                                    onChange={handleCheckboxChange}
                                />
                                <label className="form-check-label" htmlFor="superuserCheckbox">
                                    Yes
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 d-flex justify-content-center">
                        <button
                            type="submit"
                            className="btn btn-outline-info btn-lg"
                            onClick={onSubmit}
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AddUser;
