import React, {useEffect, useRef, useState} from 'react';
import Header from '../utils/Header';
import axios from 'axios';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {InputText} from 'primereact/inputtext';
import {FilterMatchMode} from 'primereact/api';
import {Dropdown} from 'primereact/dropdown';
import {Toast} from 'primereact/toast';
import {v4 as uuidv4} from 'uuid';
import {useNavigate} from "react-router-dom";

const DriversSalary = () => {

    const [paidSalary, setPaidSalary] = useState([]);
    const [workDone, setWorkDone] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedDriver, setSelectedDriver] = useState([]);
    const [filters, setFilters] = useState({global: {value: null, matchMode: FilterMatchMode.CONTAINS}});
    const [pendingSalary, setPendingSalary] = useState([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [salary, setSalary] = useState({
        uid: '', DriverName: '', PayDay: '', Month: '', AmountToPay: '', TotalHours: '',
    });

    const toast = useRef(null);
    const DriverName = useRef();
    const PayDay = useRef();
    const Month = useRef();
    const AmountToPay = useRef();
    const TotalHours = useRef();

    const navigate = useNavigate();

    const date = new Date()


    function onSubmitHandle(e) {
        e.preventDefault();
        const date = new Date(Month.current.value)
        const data = {
            ...salary,
            uid: uuidv4(),
            DriverName: DriverName.current.value,
            PayDay: PayDay.current.value,
            Month: date.toISOString().split('T')[0],
            AmountToPay: AmountToPay.current.value,
            TotalHours: TotalHours.current.value,
            from: 'Vishwaraj Enterprise',
            to: DriverName.current.value,
            subject: 'Salary',
            type: 'Salary',
        }
        console.log(data)
        axios
            .post('http://localhost:8081/addDriverSalary', data)
            .then((res) => {
                console.log(res);
                toast.current.show({
                    severity: 'success', summary: 'Success', detail: 'Salary details added successfully', life: 3000
                });
            })
            .catch((err) => console.log(err));
        setSalary({
            uid: '', DriverName: '', PayDay: '', Month: '', AmountToPay: '', TotalHours: '',
        });
        navigate(0)
    }

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

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = {...filters};
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const header = (<div className="row g-3">
        {/*<div className={'col-md-4'}></div>*/}
        <h2 className={'col-lg-9 text-center'}>Remaining drivers and their corresponding salaries.</h2>
        <div className={'col-lg-3 text-md-end text-center'}>
            <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder={'Keyword Search'}/>
        </div>
    </div>);

    const fetchData = async () => {
        try {
            const [workDoneResponse, paidSalaryResponse] = await Promise.all([

                axios.get('http://localhost:8081/getWorkDone'), axios.get('http://localhost:8081/getDriversSalary'),]);


            setWorkDone(workDoneResponse.data);
            setPaidSalary(paidSalaryResponse.data)
        } catch (error) {
            console.log(error);
        }
    };

    const getMonthYear = (d) => {
        const date = new Date(d)
        // console.log(d)
        // console.log(date.getFullYear()+'/'+date.getMonth())
        return date.getFullYear() + '/' + date.getMonth()
    }

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const selectedMonth = new Date(selectedDate);
        const filteredWorkDone = workDone.filter((item) => {
            const workDate = new Date(item.WorkDate);
            return workDate.getMonth() === selectedMonth.getMonth() && workDate.getFullYear() === selectedMonth.getFullYear();
        });

        const pendingSalaryData = filteredWorkDone.reduce((accumulator, current) => {
            const existingEntry = accumulator.find((item) => item.DriverName === current.DriverName);
            if (existingEntry) {
                existingEntry.AmountToPay += current.AmountToPay;
                existingEntry.TotalHours += current.TotalPayableHours;
            } else {
                accumulator.push({
                    DriverName: current.DriverName,
                    AmountToPay: current.AmountToPay,
                    TotalHours: current.TotalPayableHours
                });
            }
            return accumulator;
        }, []);

        setPendingSalary(pendingSalaryData);
    }, [selectedDate, workDone]);
    // console.log('pendingSalary')
    // console.log(pendingSalary)
    return (<>
        <Header title={'Drivers salary'}/>

        <Toast ref={toast}/>
        <div className={'container'}>
            {/*select Month*/}

            <h5 className={'my-4'}>Salary Information</h5>

            <div className={'row g3 my-3'}>
                <div className="col-md-4">
                    <label htmlFor="select1" className="form-label"> Select Month </label>
                    <input name={'date'} type="month" id={'input1'} className="form-control form-control-lg"
                           placeholder="month" required={true} value={selectedDate}
                           onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </div>

                {/*Select Driver*/}

                <div className="col-md-4">
                    <label htmlFor="select2" className="form-label">Select Driver</label>
                    <div className="card m-5'">
                        <Dropdown
                            id={'select2'}
                            options={pendingSalary.filter(item => !paidSalary.some(i => (i.DriverName === item.DriverName) && (getMonthYear(i.Month) === (date.getFullYear() + '/' + date.getMonth())))).map((driver) => ({name: driver.DriverName}))}
                            optionLabel="name" placeholder="Select drivers" filter valueTemplate={selectedTemplate}
                            name={'DriverName'} itemTemplate={optionTemplate} className="w-full md:w-14rem"
                            value={selectedDriver.DriverName}
                            onChange={async (e) => {
                                await setSelectedDriver({[e.target.name]: e.target.value});
                                pendingSalary.map((driver) => {
                                    if (driver.DriverName === e.value.name) {
                                        // RPH.current.value = driver.RatePerHour
                                        // driverContact.current.value = driver.DriverContact

                                        DriverName.current.value = driver.DriverName;
                                        PayDay.current.value = date.toISOString().split('T')[0];
                                        Month.current.value = selectedDate;
                                        AmountToPay.current.value = driver.AmountToPay;
                                        TotalHours.current.value = driver.TotalHours;
                                        // console.log(driver)
                                        return true;
                                    }
                                    return false;
                                });

                                // setWork({...work, RatePerHour: RPH.current.value})
                            }}
                        />
                    </div>
                </div>
            </div>

            {selectedDriver.DriverName && (<><h5 className={'my-4'}>Selected Drivers Salary Information</h5>

                <form className={'row g3 my-3'}>

                    <div className={'row g3 my-3'}>
                        {/* DriverName*/}
                        <div className="col-md-4">
                            <label htmlFor="input1" className="form-label">Driver Name</label>
                            <input name={'DriverName'} type="text" id={'input1'} ref={DriverName}
                                   className="form-control" placeholder="Driver Name"
                                   aria-label="Driver Name" disabled/>
                        </div>

                        {/*  PayDay */}
                        <div className="col-md-4">
                            <label htmlFor="input2" className="form-label">Pay Day</label>
                            <input name={'PayDay'} type="date" id={'input2'} ref={PayDay}
                                   className="form-control" placeholder="Pay Day"
                                   aria-label="Pay Day" disabled/>
                        </div>

                        {/*  Month */}
                        <div className="col-md-4">
                            <label htmlFor="input3" className="form-label">Month</label>
                            <input name={'Month'} type="month" id={'input3'} ref={Month}
                                   className="form-control" placeholder="Month"
                                   aria-label="Month" disabled/>
                        </div>

                        {/*  AmountToPay */}
                        <div className="col-md-4">
                            <label htmlFor="input4" className="form-label">Amount To Pay</label>
                            <input name={'AmountToPay'} type="number" id={'input4'} ref={AmountToPay}
                                   className="form-control" placeholder="Amount To Pay"
                                   aria-label="Amount To Pay" disabled/>
                        </div>
                        {/*  Total Hours */}
                        <div className="col-md-4">
                            <label htmlFor="input4" className="form-label">Total Hours</label>
                            <input name={'TotalHours'} type="number" id={'input4'} ref={TotalHours}
                                   className="form-control" placeholder="Total Hours"
                                   aria-label="Total Hours" disabled/>
                        </div>
                    </div>
                    <div className={'row g3 my-3'}>

                        <div className="col-12 d-flex justify-content-center">
                            <button type="submit" className="btn btn-outline-info btn-lg"
                                    onClick={onSubmitHandle}>Submit
                            </button>
                        </div>
                    </div>

                </form>
            </>)}


            {// pendingSalary === null ? (
                pendingSalary.length !== 0 ? (<>
                    <h5 className={'my-4'}>Pending salary drivers</h5>
                    <div className={''}>
                        <div className={'card m-5'}>
                            <DataTable
                                value={pendingSalary.filter(item => !paidSalary.some(i => (i.DriverName === item.DriverName) && (getMonthYear(i.Month) === (date.getFullYear() + '/' + date.getMonth()))))}
                                removableSort tableStyle={{minWidth: '50rem'}} filters={filters}
                                header={header} emptyMessage="No customers found." rows={5} resizableColumns
                                stripedRows paginator rowsPerPageOptions={[5, 10, 25, 50]}
                                globalFilterFields={['DriverName', 'AmountToPay', 'TotalHours']}
                            >
                                <Column field={'DriverName'} header={'Driver Name'} sortable/>
                                <Column field={'TotalHours'} header={'Total Work Hours'} sortable/>
                                <Column field={'AmountToPay'} header={'Amount To Pay'} sortable/>
                            </DataTable>
                        </div>
                    </div>
                </>) : (
                    <h3 className={'mt-5'}><span className={'container border-2 border-bottom'}>All personnel have been issued their respective salary payments</span>
                    </h3>)
                // )
                //     : (
                //     <h3 className={'mt-5'}><span className={'container border-2 border-bottom'}>Please choose a month to view the salary records.</span>
                //     </h3>
                // )
            }
        </div>
    </>);
};

export default DriversSalary;
