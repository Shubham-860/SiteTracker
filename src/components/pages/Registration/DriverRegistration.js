import React, {useRef, useState} from 'react';
import Header from "../../utils/Header";
import axios from "axios";
import {Toast} from 'primereact/toast';
import {baseUrl} from "../../utils/baseUrl";

const DriverRegistration = () => {
    const [showWarning, setShowWarning] = useState(false);
    const [driver, setDriver] = useState({
        DriverName: '',
        DriverContact: '',
        DriverAddress: '',
        AadharCard: '',
        DrivingLicense: '',
        JoinDate: '',
        RatePerHour: '',
        Remark: '',
    });
    const toast = useRef(null);

    const handleChange = (e) => {
        setDriver({...driver, [e.target.name]: e.target.value});
    }

    function onSubmitHandle(e) {
        e.preventDefault()
        const isAnyFieldEmpty = Object.values(driver).some((value) => value === '');

        if (isAnyFieldEmpty) {
            setShowWarning(true);
        } else {
            console.log(driver)
            axios
                .post(`${baseUrl}/addDriver`, driver)
                .then(res => {
                    console.log(res)
                    // alert('added')
                    toast.current.show({
                        severity: 'success', summary: 'Success', detail: 'Driver details added successfully', life: 3000
                    });
                })
                .catch(err => {
                        toast.current.show({severity: 'error', summary: 'Error', detail: 'Something went wrong', life: 3000});
                    console.log(err)
                })
            setDriver({
                DriverName: '',
                DriverContact: '',
                DriverAddress: '',
                AadharCard: '',
                DrivingLicense: '',
                JoinDate: '',
                RatePerHour: '',
                Remark: '',
            })

        }

    }

    return (
        <>
            <Header title={'Driver Registration'}/>
            <Toast ref={toast}/>
            <div className={'container mt-4 border-black'}>

                {showWarning && (
                    <div className="col-12 alert alert-warning" role="alert">
                        Please fill in all the required fields.
                    </div>
                )}<h5>Driver Information</h5>
                <form className="row g-3">

                    <div className="row g-3">


                        {/*Joining Date*/}
                        <div className="col-md-4">
                            <label htmlFor="input1" className="form-label">Joining Date</label>
                            <input name={'JoinDate'} type="date" id={'input1'}
                                   className="form-control borderBlack"
                                   placeholder="Join Date" aria-label="JoinDate" required={true}
                                   value={driver.JoinDate} onChange={handleChange}/>
                        </div>

                        {/*driver Name*/}
                        <div className="col-md-4">
                            <label htmlFor="input2" className="form-label">Name</label>
                            <input name={'DriverName'} type="text" id={'input2'} className="form-control"
                                   placeholder="Driver Name" aria-label="Driver Name" required={true}
                                   value={driver.DriverName} onChange={handleChange}/>
                        </div>

                        {/*Driver Contact*/}
                        <div className="col-md-4">
                            <label htmlFor="input3" className="form-label"> Contact</label>
                            <input name={'DriverContact'} type="number" id={'input3'} className="form-control"
                                   placeholder="DriverContact" aria-label="DriverContact" required={true}
                                   value={driver.DriverContact} onChange={handleChange}/>
                        </div>


                        {/*Driver Aadhar Card*/}
                        <div className="col-md-4">
                            <label htmlFor="input4" className="form-label"> Aadhar Card</label>
                            <input name={'AadharCard'} type="number" id={'input4'} className="form-control"
                                   placeholder="Aadhar Card" aria-label="AadharCard" required={true}
                                   value={driver.AadharCard} onChange={handleChange}/>
                        </div>


                        {/*Driver DrivingLicense*/}
                        {/*Driver DrivingLicense*/}
                        <div className="col-md-4">
                            <label htmlFor="input5" className="form-label"> Driving License</label>
                            <input name={'DrivingLicense'} type="text" id={'input5'} className="form-control"
                                   placeholder="DrivingLicense" aria-label="DriverContact" required={true}
                                   value={driver.DrivingLicense} onChange={handleChange}/>
                        </div>


                        {/*Driver Address*/}

                        <div className="col-md-6">
                            <label htmlFor="floatingTextarea" className="form-label">Address</label>
                            <textarea className="form-control" placeholder="Driver Address" name={'DriverAddress'}
                                      id="floatingTextarea" required={true} value={driver.DriverAddress}
                                      onChange={handleChange}></textarea>
                        </div>

                    </div>
                    <h5 className={'mt-4'}>Payment information</h5>

                    <div className="row g-3 my-3">


                        {/*Rate*/}
                        <div className="col-md-4">
                            <label htmlFor="input6" className="form-label"> RatePerHour</label>
                            <input name={'RatePerHour'} type="number" id={'input6'} className="form-control"
                                   placeholder="RatePerHour" aria-label="Rate" required={true}
                                   value={driver.RatePerHour} onChange={handleChange}/>
                        </div>


                        {/*Remark*/}

                        <div className="col-md-6">
                            <label htmlFor="floatingTextarea1" className="form-label">Remark</label>
                            <textarea className="form-control" placeholder="Remark" name={'Remark'}
                                      id="floatingTextarea1" required={true} value={driver.Remark}
                                      onChange={handleChange}></textarea>
                        </div>

                    </div>

                    <div className="col-12 d-flex justify-content-center">
                        <button type="submit" className="btn btn-outline-info btn-lg" onClick={onSubmitHandle}>Submit
                        </button>
                    </div>
                </form>
            </div>

        </>
    );
};

export default DriverRegistration;