import React, {useContext, useRef, useState} from 'react';
import axios from 'axios';
import User from '../../context/user';
import Cookies from 'js-cookie';
import {useNavigate} from "react-router-dom";
import {Toast} from "primereact/toast";
import {baseUrl} from "./baseUrl";

const Login = ({update,showSuccess}) => {
    const [userInfo, setUserInfo] = useState({
        email: '',
        password: ''
    });
    const [user, setUser] = useContext(User);
    const navigate = useNavigate();
    const handleChange = (e) => {
        setUserInfo({...userInfo, [e.target.name]: e.target.value});
    };
    const toast = useRef(null);


    if (user.login) {
        navigate('/Home')
    }

    const showError = () => {
        toast.current.show({severity: 'error', summary: 'Error', detail: 'Invalid credentials', life: 3000});
    }
    const showError2 = () => {
        toast.current.show({severity: 'error', summary: 'Error', detail: 'Login failed', life: 3000});
    }
    const onSubmitHandle = (e) => {
        e.preventDefault();

        axios
            .post(`${baseUrl}/login`, userInfo)
            .then((response) => {
                if (response.data !== 'No records found') {
                    const userCredentials = {...response.data[0], login: true};
                    setUser(userCredentials);
                    Cookies.set('loginCredentials', JSON.stringify(userCredentials)); // Store login credentials in a cookie
                    showSuccess()
                    update(userCredentials);
                    // console.log(userCredentials)
                    navigate('/Home')
                }
                else {
                    showError()
                }
            })
            .catch((err) => {
                console.log(err);
                showError2()
            });
    };

    return (
        <div
            className="d-flex align-items-center p-4"
            style={{minHeight: '100vh', backgroundColor: 'rgba(210,210,210,0.53)'}}
        >
            <Toast ref={toast}/>

            <form className={'container col-md-4 border border-2 p-5 rounded-4 shadow bg-white'}>
                <h2 className={'text-center'}>Log In</h2>
                <div className="mb-3">
                    <label>Email address</label>
                    <input
                        name={'email'}
                        type="email"
                        className="form-control"
                        placeholder="Enter email"
                        value={userInfo.email}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label>Password</label>
                    <input
                        name={'password'}
                        type="password"
                        className="form-control"
                        placeholder="Enter password"
                        value={userInfo.password}
                        onChange={handleChange}
                    />
                </div>

                <div className="d-grid">
                    <button type="submit" className="btn btn-outline-info" onClick={onSubmitHandle}>
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Login;
