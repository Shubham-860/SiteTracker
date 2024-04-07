import React, {useEffect, useRef, useState} from 'react';
import Header from '../utils/Header';
import axios from 'axios';
import {Chart} from 'primereact/chart';
import {NavLink} from 'react-router-dom';
import {Dropdown} from "primereact/dropdown";
import {baseUrl} from "../utils/baseUrl";

const Home = () => {
    const [payments, setPayments] = useState({});
    const toast = useRef(null);
    const [month, setMonth] = useState('');
    const [sites, setSites] = useState([]);
    const [selectedSite, setSelectedSite] = useState({});
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [chartData2, setChartData2] = useState({});
    const [chartOptions2, setChartOptions2] = useState({});
    const [result, setResult] = useState({});
    const [result2, setResult2] = useState(
        {income: 0, expense: 0}
    );


    const selectedTemplate = (option, props) => {
        if (option) {
            return (<div className="flex align-items-center">
                <div>{option.name}</div>
            </div>);
        }
        return <span>{props.placeholder}</span>;
    };
    const optionTemplate = (option) => {
        return (<div className="flex align-items-center">
            <div>{option.name}</div>
        </div>);
    };

    const date = (rawData) => {
        const date = new Date(rawData);
        console.log(date);
        return date;
    };

    const getAllPayment = async () => {
        try {

            axios
                .get(`${baseUrl}/getAllPayment`)
                .then((response) => {
                    setPayments(response.data);
                    console.log(response.data);
                    setResult(response.data.reduce((acc, item) => {
                        if (item.from === 'Vishwaraj Enterprise') {
                            acc.fromAmount += item.amount;
                        }
                        if (item.to === 'Vishwaraj Enterprise') {
                            acc.toAmount += item.amount;
                        }
                        return acc;
                    }, {fromAmount: 0, toAmount: 0}));
                    console.log('result');
                    console.log(result);
                })
                .catch(error => console.log(error));
            const siteResponse = await axios.get(`${baseUrl}/getSite`);
            setSites(siteResponse.data);
        } catch (e) {
            console.log(e)
        }
    };

    useEffect(() => {
        getAllPayment();
    }, []);

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const data = {
            labels: [
                `Expense ${result?.fromAmount || 0}`,
                `Income ${result?.toAmount || 0}`
            ],
            datasets: [{
                data: [result?.fromAmount || 0, result?.toAmount || 0],
                backgroundColor: [
                    documentStyle.getPropertyValue('--red-500'),
                    documentStyle.getPropertyValue('--green-500'),
                ],
                hoverBackgroundColor: [
                    documentStyle.getPropertyValue('--red-500'),
                    documentStyle.getPropertyValue('--green-400'),
                ],
            },],
        };
        const options = {
            cutout: '60%',
        };

        setChartData(data);
        setChartOptions(options);

    }, [result]);

    return (<>
        <Header title={'Home'}/>

        <div className={'container'}>
            <h3 className={'pt-3'}>Site Tracker</h3>

            <div className="container row my-5 justify-content-center">

                {/*Total*/}
                <div className="border-1 rounded-5 shadow-lg col-lg-4 p-5 m-3">
                    <div  className={'p-2'}>
                        <h3>Total</h3>
                        <h5 className={'p-2'}>Expense: {result?.fromAmount || 0}</h5>
                        <h5 className={'p-2'}>Income: {result?.toAmount || 0}</h5>
                    </div>
                    <div className={'col-auto'}>
                        <form className="row g-3">
                            <div className="row g-3">

                                {/*Month Select*/}

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
                                            setResult(payments.reduce((acc, item) => {
                                                if (date(item.date).getMonth() === date(e.target.value).getMonth()) {
                                                    if (item.from === 'Vishwaraj Enterprise') {
                                                        acc.fromAmount += item.amount;
                                                    }
                                                    if (item.to === 'Vishwaraj Enterprise') {
                                                        acc.toAmount += item.amount;
                                                    }
                                                }
                                                return acc;
                                            }, {fromAmount: 0, toAmount: 0}));
                                        }}
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                {/* chart */}
                <div className="border-1 rounded-5 col-lg-4 shadow-lg m-3 p-5 d-flex justify-content-center">
                    <span>
                        <h3 className={'text-center my-2'}>Income Expense Chart </h3>
                        <Chart type="doughnut" data={chartData} options={chartOptions} className="md:w-30rem"/>
                    </span>
                </div>
                {/*Reports*/}
                <div className="border-1 rounded-5 col-lg-3 shadow-lg m-3 p-5">
                    <h3 className={'ps-4 pb-3'}>Reports</h3>
                    <ol style={{listStyle: 'none'}} className={'text-dark'}>
                        <li className={'text-decoration-none'}>
                            <NavLink className={'text-decoration-none text-dark'} to={'/Sites'}>
                                > Sites
                            </NavLink>
                        </li>
                        <li className={'text-decoration-none'}>
                            <NavLink className={'text-decoration-none text-dark'} to={'/Drivers'}>
                                > Drivers
                            </NavLink>
                        </li>
                        <li className={'text-decoration-none'}>
                            <NavLink className={'text-decoration-none text-dark'} to={'/Vehicles'}>
                                > Vehicles
                            </NavLink>
                        </li>
                        <li className={'text-decoration-none'}>
                            <NavLink className={'text-decoration-none text-dark'} to={'/Diesel'}>
                                > Diesel
                            </NavLink>
                        </li>
                        <li className={'text-decoration-none'}>
                            <NavLink className={'text-decoration-none text-dark'} to={'/WorkDone'}>
                                > Work Done
                            </NavLink>
                        </li>
                        <li className={'text-decoration-none'}>
                            <NavLink className={'text-decoration-none text-dark'} to={'/SiteOwnerPayment'}>
                                > Site Owner Payment
                            </NavLink>
                        </li>
                        <li className={'text-decoration-none'}>
                            <NavLink className={'text-decoration-none text-dark'} to={'/Salarys'}>
                                > Salarys
                            </NavLink>
                        </li>
                        <li className={'text-decoration-none'}>
                            <NavLink className={'text-decoration-none text-dark'} to={'/Payments'}>
                                > Payments
                            </NavLink>
                        </li>
                    </ol>
                </div>

            </div>

            <div className="container my-5 row justify-content-center">


                <div className="border-1 rounded-5 shadow-lg col-md-5 p-5 m-3">
                    <h3>Select Site</h3>
                    <div className="">
                        <div className="card flex justify-content-center mt-5">
                            <Dropdown
                                id={'select3'}
                                options={sites.map(sites => ({name: sites.SiteName}))} optionLabel="name"
                                placeholder="Select drivers" filter valueTemplate={selectedTemplate}
                                name={'SiteName'} itemTemplate={optionTemplate}
                                className="w-full md:w-14rem" value={selectedSite.SiteName}
                                onChange={async (e) => {
                                    setSelectedSite({[e.target.name]: e.target.value})

                                    console.log(e.target.value.name)
                                    try {

                                        // expence
                                        const Response = await axios.get(`${baseUrl}/getWorkDone`)
                                            .then();
                                        const AmountToPay = Response.data.reduce((acc, item) => {
                                            if (item.SiteName === e.target.value.name) {
                                                // console.log(item)
                                                acc.AmountToPay += item.AmountToPay;
                                            }

                                            return acc;
                                        }, {AmountToPay: 0})

                                        // income
                                        const income = sites.reduce((acc, item) => {
                                            if (item.SiteName === e.target.value.name) {
                                                console.log(item)
                                                acc.PaidAmount += item.PaidAmount;
                                            }

                                            return acc;
                                        }, {PaidAmount: 0})

                                        console.log('income')
                                        console.log(income)
                                        console.log('AmountToPay')
                                        console.log(AmountToPay)


                                        setResult2({expense: AmountToPay.AmountToPay, income: income.PaidAmount})


                                        const documentStyle = getComputedStyle(document.documentElement);
                                        const data = {
                                            labels: [
                                                `Expense`,
                                                `Income`
                                            ],
                                            datasets: [{
                                                data: [AmountToPay.AmountToPay || 0, income.PaidAmount || 0],
                                                backgroundColor: [
                                                    documentStyle.getPropertyValue('--red-500'),
                                                    documentStyle.getPropertyValue('--green-500'),
                                                ],
                                                hoverBackgroundColor: [
                                                    documentStyle.getPropertyValue('--red-500'),
                                                    documentStyle.getPropertyValue('--green-400'),
                                                ],
                                            },],
                                        };
                                        const options = {
                                            cutout: '60%',
                                        };
                                        setChartData2(data);
                                        setChartOptions2(options);
                                    } catch (e) {
                                        console.log(e)
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div className={'my-5'}>
                        <h3 className={'p-2'}>Total</h3>
                        <h5 className={'p-1'}>Expense: {result2?.expense || 0}</h5>
                        <h5 className={'p-1'}>Income: {result2?.income || 0}</h5>
                    </div>
                </div>

                <div className="border-1 rounded-5 col-lg-5 shadow-lg m-3 p-5 d-flex justify-content-center">
                    <span>
                        <h3 className={'text-center my-2'}>Site Expense Income Chart</h3>
                        <Chart type="doughnut" data={chartData2} options={chartOptions2} className="md:w-30rem"/>
                    </span>
                </div>
            </div>

        </div>
    </>);
};

export default Home;
