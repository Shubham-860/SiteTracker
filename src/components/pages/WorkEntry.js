import React, {useEffect, useRef, useState} from 'react';
import Header from "../utils/Header";
import axios from "axios";
import {Dropdown} from 'primereact/dropdown';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import {Toast} from 'primereact/toast';

const WorkEntry = () => {
    const [stockDiesel, setStockDiesel] = useState();
    const [showWarning, setShowWarning] = useState(false);
    const [vehicles, setVehicles] = useState([]);
    const [sites, setSites] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [work, setWork] = useState({
        VehicleNumber: '',
        DriverName: '',
        SiteName: '',
        WorkDate: '',
        StartTime: '09:00:00',
        EndTime: '17:00:00',
        WorkingStatus: 'Working',
        Remark: '',
        DieselConsumption: '',
        RatePerHour: '',
        TotalPayableHours: '8',
        AmountToPay: '',
    });


    const vehicleType = useRef();
    const vehicleAVG = useRef();
    const RPH = useRef();
    const driverContact = useRef();
    const toast = useRef(null);
    const fetchData = async () => {
        try {
            const driversResponse = await axios.get('http://localhost:8081/getDrivers');
            setDrivers(driversResponse.data);
            // console.log("drivers")
            // console.log(drivers);

            const vehicleResponse = await axios.get('http://localhost:8081/getVehicles');
            setVehicles(vehicleResponse.data);
            // console.log('vehicles')
            // console.log(vehicle);

            const siteResponse = await axios.get('http://localhost:8081/getSite');
            setSites(siteResponse.data);
            // console.log('sites')
            // console.log(site);
            const stockDieselResponse = await axios.get('http://localhost:8081/getStockDiesel');
            setStockDiesel(stockDieselResponse.data[0].stock);
            // console.log(stockDieselResponse.data[0].stock)

        } catch (error) {
            console.log(error);
        }
        // console.log("drivers")
        // console.log(drivers);
        // console.log('vehicles')
        // console.log(vehicle);
        // console.log('sites')
        // console.log(site);
        // console.log('stockDiesel')
        // console.log(stockDiesel)

    };
    const handleRateChange = (e) => {
        const ratePerHour = parseFloat(e.target.value);
        const totalPayableHours = parseFloat(work.TotalPayableHours);
        const amountToPay = ratePerHour * totalPayableHours;

        setWork({
            ...work, RatePerHour: ratePerHour, AmountToPay: isNaN(amountToPay) ? '' : amountToPay.toFixed(2),
        });
    };

    const handleTotalHoursChange = (e) => {
        const totalPayableHours = parseFloat(e.target.value);
        const ratePerHour = parseFloat(work.RatePerHour);
        const amountToPay = ratePerHour * totalPayableHours;

        setWork({
            ...work,
            TotalPayableHours: totalPayableHours,
            AmountToPay: isNaN(amountToPay) ? '' : amountToPay.toFixed(2),
        });
    };
    const handleChange = (e) => {
        const {name, value} = e.target;

        if (name === 'StartTime' || name === 'EndTime') {
            const {StartTime, EndTime} = work;

            if (StartTime && EndTime) {
                const start = new Date(`2000-01-01T${StartTime}`);
                const end = new Date(`2000-01-01T${EndTime}`);

                const diffInHours = Math.abs((end - start) / (1000 * 60 * 60));

                setWork({
                    ...work, TotalPayableHours: diffInHours.toFixed(2), [name]: value,
                });
            } else {
                setWork({
                    ...work, [name]: value,
                });
            }
        } else {
            setWork({
                ...work, [name]: value,
            });
        }
        console.log(work.TotalPayableHours)
    };

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

    function onSubmitHandle(e) {
        e.preventDefault()
        const isAnyFieldEmpty = Object.values(work).some((value) => value === '');
        console.log(work)

        if (isAnyFieldEmpty) {
            setShowWarning(true);
        } else {
            console.log(work)
            const data = {
                ...work,
                SiteName: work.SiteName.name,
                DriverName: work.DriverName.name,
                VehicleNumber: work.VehicleNumber.name
            }
            console.log(data)
            axios
                .post('http://localhost:8081/addWorkDone', data)
                .then(res => {
                    console.log(res)
                    // alert(res.data)
                    fetchData();
                    toast.current.show({severity: 'success', summary: 'Success', detail: 'Work Entry details added successfully', life: 3000});
                })
                .catch(err => {
                    toast.current.show({severity: 'error', summary: 'Error', detail: 'Something went wrong', life: 3000});
                    console.log(err)
                })
            setWork({
                VehicleNumber: '',
                DriverName: '',
                SiteName: '',
                WorkDate: '',
                StartTime: '09:00:00',
                EndTime: '17:00:00',
                WorkingStatus: 'Working',
                Remark: '',
                DieselConsumption: '',
                RatePerHour: '',
                TotalPayableHours: '8',
                AmountToPay: '',
            })
        }

    }


    useEffect(() => {
        fetchData();
    }, []);


    return (<>
        <Header title={'Work Entry'}/>
        <Toast ref={toast}/>
        <div className={'container my-4 pb-5 border-black'}>

            {showWarning && (<div className="col-12 alert alert-warning" role="alert">
                Please fill in all the required fields.
            </div>)}
            <form className="row g-3">


                <h5>Vehicle Information</h5>

                <div className="row g-3">


                    {/*Vehicle Number*/}
                    <div className="col-md-4">
                        <label htmlFor="select1" className="form-label"> Select Vehicle Number</label>
                        <div className="card flex justify-content-center">
                            <Dropdown
                                id={'select1'}
                                options={vehicles.map(vehicle => ({name: vehicle.VehicleNumber}))} optionLabel="name"
                                placeholder="Vehicle Number" filter valueTemplate={selectedTemplate}
                                name={'VehicleNumber'}
                                itemTemplate={optionTemplate} className="w-full md:w-14rem"
                                value={work.VehicleNumber} onChange={(e) => {
                                setWork({...work, [e.target.name]: e.target.value})
                                vehicles.filter(vehicle => {
                                    if (vehicle.VehicleNumber === e.value.name) {
                                        vehicleType.current.value = vehicle.VehicleType
                                        vehicleAVG.current.value = vehicle.VehicleAVG
                                        return true;
                                    }
                                    return false;
                                })
                            }}
                            />
                        </div>
                    </div>

                    {/*VehicleType*/}
                    <div className="col-md-4">
                        <label htmlFor="input1" className="form-label">Vehicle Type</label>
                        <input name={'VehicleType'} type="text" id={'input1'} ref={vehicleType}
                               className="form-control" placeholder="Vehicle Type"
                               aria-label="Vehicle Type" required={true} disabled/>
                    </div>

                    {/*  VehicleAVG*/}
                    <div className="col-md-4">
                        <label htmlFor="input2" className="form-label">Vehicle AVG</label>
                        <input name={'VehicleAVG'} type="number" id={'input2'} ref={vehicleAVG}
                               className="form-control" placeholder="Vehicle AVG"
                               aria-label="Vehicle AVG" required={true}
                               disabled/>
                    </div>

                </div>


                <h5 className={'mt-4'}>Driver Information</h5>

                <div className="row g-3">

                    {/*Driver Name*/}
                    <div className="col-md-4">

                        <label htmlFor="select2" className="form-label">Driver Name</label>
                        <div className="card flex justify-content-center">
                            <Dropdown
                                id={'select2'}
                                options={drivers.map(driver => ({name: driver.DriverName}))} optionLabel="name"
                                placeholder="Select drivers" filter valueTemplate={selectedTemplate}
                                name={'DriverName'} itemTemplate={optionTemplate} className="w-full md:w-14rem"
                                value={work.DriverName} onChange={(e) => {
                                setWork({...work, [e.target.name]: e.target.value})
                                drivers.filter(driver => {
                                    if (driver.DriverName === e.value.name) {
                                        RPH.current.value = driver.RatePerHour
                                        driverContact.current.value = driver.DriverContact
                                        return true;
                                    }
                                    return false;
                                })
                                // setWork({...work, RatePerHour: RPH.current.value})
                            }}
                            />
                        </div>
                    </div>

                    {/*  Rate Per Hour */}
                    <div className="col-md-4">
                        <label htmlFor="input4" className="form-label"> Rate Per Hour</label>
                        <input name={'RatePerHour'} type="dat" id={'input4'} className="form-control"
                               placeholder="Rate Per Hour" aria-label="Rate Per Hour" ref={RPH}
                               required={true}
                               disabled/>
                    </div>

                    {/*Driver Contact*/}
                    <div className="col-md-4">
                        <label htmlFor="input5" className="form-label"> DriverContact</label>
                        <input name={'DriverContact'} type="number" id={'input5'} className="form-control"
                               ref={driverContact}
                               placeholder="Driver Contact" aria-label="Driver Contact" required={true}
                               disabled/>
                    </div>
                </div>


                <h5 className={'mt-4'}>Site Information</h5>
                <div className="row g-3">


                    {/*Site Name*/}
                    <div className="col-md-4">
                        <label htmlFor="input3" className="form-label">Site Name</label>
                        <div className="card flex justify-content-center">
                            <Dropdown
                                id={'select3'}
                                options={sites.map(sites => ({name: sites.SiteName}))} optionLabel="name"
                                placeholder="Select drivers" filter valueTemplate={selectedTemplate}
                                name={'SiteName'}
                                itemTemplate={optionTemplate} className="w-full md:w-14rem"
                                value={work.SiteName} onChange={(e) => {
                                setWork({...work, [e.target.name]: e.target.value})
                            }}
                            />
                        </div>
                    </div>


                </div>

                {/*Work*/}

                <div className="row g-3">

                    {/*WorkDate*/}
                    <div className="col-md-4">
                        <label htmlFor="input6" className="form-label">Work Date</label>
                        <input name={'WorkDate'} type="date" id={'input6'}
                               className="form-control borderBlack"
                               placeholder="Work Date" aria-label="Work Date" required={true}
                               value={work.WorkDate} onChange={handleChange}/>
                    </div>

                    {/*Start Time*/}
                    <div className="col-md-4">
                        <label htmlFor="input7" className="form-label">Start Time</label>
                        <input name={'StartTime'} type="time" id={'input7'}
                               className="form-control borderBlack"
                               placeholder="Work Date" aria-label="Work Date" required={true}
                               value={work.StartTime} onChange={handleChange}/>
                    </div>

                    {/*End Time */}
                    <div className="col-md-4">
                        <label htmlFor="input8" className="form-label">End Time</label>
                        <input name={'EndTime'} type="time" id={'input8'}
                               className="form-control borderBlack"
                               placeholder="End Time" aria-label="End Time" required={true}
                               value={work.EndTime} onChange={handleChange}/>
                    </div>

                    {/*Work Date*/}
                    <div className="col-md-4">
                        <label className="form-label me-5" form={'inlineRadio1'}>WorkingStatus</label>
                        <div onChange={handleChange}>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="WorkingStatus"
                                       id="inlineRadio2" value="Working" defaultChecked/>
                                <label className="form-check-label" htmlFor="inlineRadio2">Working</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="WorkingStatus"
                                       id="inlineRadio1" value="Maintenance"/>
                                <label className="form-check-label" htmlFor="inlineRadio1">Maintenance</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="WorkingStatus"
                                       id="inlineRadio3" value="Any Other Issue"/>
                                <label className="form-check-label" htmlFor="inlineRadio3">Any Other Issue</label>
                            </div>
                        </div>
                    </div>

                    {/*Remark*/}
                    <div className="col-md-6">
                        <label htmlFor="floatingTextarea1" className="form-label">Remark</label>
                        <textarea className="form-control" placeholder="Remark" name={'Remark'}
                                  id="floatingTextarea1" required={true}
                                  value={work.Remark} onChange={handleChange}></textarea>
                    </div>
                </div>


                <div className="row g-3">

                    {/*Diesel Consumption  */}
                    <div className="col-md-4">
                        <label htmlFor="input9" className="form-label">Diesel Consumption</label>
                        <input name={'DieselConsumption'} type="number" id={'input9'}
                               className="form-control borderBlack"
                               placeholder="Diesel Consumption (in Liters)" aria-label="DieselConsumption"
                               required={true}
                               value={work.DieselConsumption} onChange={handleChange}/>
                    </div>

                    {/*Rate Per Hour */}
                    <div className="col-md-4">
                        <label htmlFor="input11" className="form-label">Rate Per Hour</label>
                        <input name={'RatePerHour'} type="number" id={'input11'} className="form-control borderBlack"
                               placeholder="if not changed" aria-label="Rate Per Hour" required={true}
                               value={work.RatePerHour} onChange={handleRateChange}
                        />
                    </div>

                    {/*Total Payable Hours*/}
                    <div className="col-md-4">
                        <label htmlFor="input12" className="form-label">Total Payable Hours</label>
                        <input name={'TotalPayableHours'} type="number" id={'input12'}
                               className="form-control borderBlack" placeholder="Total Payable Hours"
                               aria-label="Total Payable Hours" required={true} value={work.TotalPayableHours}
                               onChange={handleTotalHoursChange}
                        />
                    </div>

                    {/*Amount To Pay */}
                    <div className="col-md-4">
                        <label htmlFor="input13" className="form-label">Amount To Pay</label>
                        <input name={'AmountToPay'} type="number" id={'input13'} className="form-control borderBlack"
                               placeholder="Amount To Pay" aria-label="Amount To Pay" required={true}
                               value={work.AmountToPay} onChange={handleChange} disabled
                        />
                    </div>

                    <p>Remaining Diesel : {stockDiesel} liters</p>
                </div>

                <div className="col-12 d-flex justify-content-center">
                    <button type="submit" className="btn btn-outline-info btn-lg" onClick={onSubmitHandle}>Submit
                    </button>
                </div>
            </form>
        </div>
    </>);
};

export default WorkEntry;