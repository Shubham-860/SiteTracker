import React, {useEffect, useRef, useState} from 'react';
import Header from '../utils/Header';
import axios from 'axios';
import {Chart} from 'primereact/chart';
import {NavLink} from 'react-router-dom';

const Home = () => {
    const [payments, setPayments] = useState({});
    const toast = useRef(null);
    const [month, setMonth] = useState('');

    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [result, setResult] = useState({});

    const handleChange = (e) => {
        setPayments({...payments, [e.target.name]: e.target.value});
    };

    const showSuccess = () => {
        toast.current.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Driver details deleted successfully',
            life: 3000,
        });
    };

    const showError = () => {
        toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Something went wrong',
            life: 3000,
        });
    };

    const date = (rawData) => {
        const date = new Date(rawData);
        console.log(date);
        return date;
    };

    const getAllPayment = () => {
        axios
            .get('http://localhost:8081/getAllPayment')
            .then((response) => {
                setPayments(response.data);
                console.log(response.data);
                setResult(
                    response.data.reduce(
                        (acc, item) => {
                            if (item.from === 'Vishwaraj Enterprise') {
                                acc.fromAmount += item.amount;
                            }
                            if (item.to === 'Vishwaraj Enterprise') {
                                acc.toAmount += item.amount;
                            }
                            return acc;
                        },
                        {fromAmount: 0, toAmount: 0}
                    )
                );
                console.log('result');
                console.log(result);
            })
            .catch(error => console.log(error));
    };

    useEffect(() => {
        getAllPayment();
    }, []);

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const data = {
            labels: [`Expense ${result?.fromAmount || 0}`, `Income ${result?.toAmount || 0}`],
            datasets: [
                {
                    data: [result?.fromAmount || 0, result?.toAmount || 0],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--red-500'),
                        documentStyle.getPropertyValue('--green-500'),
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--red-500'),
                        documentStyle.getPropertyValue('--green-400'),
                    ],
                },
            ],
        };
        const options = {
            cutout: '60%',
        };

        setChartData(data);
        setChartOptions(options);
    }, [result]);

    return (
        <>
            <Header title={'Home'}/>

            <div className={'container'}>
                <h3 className={'pt-3'}>Site Tracker</h3>
                {/* chart */}
                <div className="container row my-5 ">
                    <div className="border-1 rounded-5 shadow-lg col-md-4 p-5 my-3 h-25">
                        <div>
                            <h4 className={'p-3'}>Expense: {result?.fromAmount || 0}</h4>
                            <h4 className={'p-3'}>Income: {result?.toAmount || 0}</h4>
                        </div>
                        <div className={'col-auto'}>
                            <form className="row g-3">
                                <div className="row g-3">
                                    <div className="">
                                        <label htmlFor="input1" className="form-label">
                                            Select Month
                                        </label>
                                        <input
                                            name="Month" type="month" id="input1"
                                            className="form-control form-control-lg" placeholder="Month"
                                            aria-label="JoinDate" required={true} value={payments.Month}
                                            onChange={(e) => {
                                                // handleChange(e);
                                                setMonth(date(e.target.value));
                                                setResult(
                                                    payments.reduce((acc, item) => {
                                                        if (
                                                            date(item.date).getMonth() === date(e.target.value).getMonth()
                                                        ) {
                                                            if (item.from === 'Vishwaraj Enterprise') {
                                                                acc.fromAmount += item.amount;
                                                            }
                                                            if (item.to === 'Vishwaraj Enterprise') {
                                                                acc.toAmount += item.amount;
                                                            }
                                                        }
                                                        return acc;
                                                    }, {fromAmount: 0, toAmount: 0})
                                                );
                                            }}
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="border-1 rounded-5 col-md-4 shadow-lg m-3 p-5 d-flex justify-content-center">
            <span>
              <Chart type="doughnut" data={chartData} options={chartOptions} className="md:w-30rem"/>
              <h4 className={'text-center my-2'}>Income Expense Chart </h4>
            </span>
                    </div>
                    <div className="border-1 rounded-5 col-md-3 shadow-lg m-3 p-5">
                        <h4 className={'ps-4'}>Reports</h4>
                        <ol style={{ listStyle: 'none' }} className={'text-dark'}>
                            <li className={'text-decoration-none'}>
                                <NavLink className={'text-decoration-none text-dark'} to={'/Drivers'}>
                                    Drivers
                                </NavLink>
                            </li>
                            <li className={'text-decoration-none'}>
                                <NavLink className={'text-decoration-none text-dark'} to={'/Vehicles'}>
                                    Vehicles
                                </NavLink>
                            </li>
                            <li className={'text-decoration-none'}>
                                <NavLink className={'text-decoration-none text-dark'} to={'/WorkDone'}>
                                    WorkDone
                                </NavLink>
                            </li>
                            <li className={'text-decoration-none'}>
                                <NavLink className={'text-decoration-none text-dark'} to={'/SiteOwnerPayment'}>
                                    SiteOwnerPayment
                                </NavLink>
                            </li>
                            <li className={'text-decoration-none'}>
                                <NavLink className={'text-decoration-none text-dark'} to={'/Diesel'}>
                                    Diesel
                                </NavLink>
                            </li>
                            <li className={'text-decoration-none'}>
                                <NavLink className={'text-decoration-none text-dark'} to={'/Payments'}>
                                    Payments
                                </NavLink>
                            </li>
                            <li className={'text-decoration-none'}>
                                <NavLink className={'text-decoration-none text-dark'} to={'/Sites'}>
                                    Sites
                                </NavLink>
                            </li>
                            <li className={'text-decoration-none'}>
                                <NavLink className={'text-decoration-none text-dark'} to={'/Salarys'}>
                                    Salarys
                                </NavLink>
                            </li>
                        </ol>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
