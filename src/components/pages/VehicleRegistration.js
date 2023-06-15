import React, {useEffect, useRef, useState} from 'react';
import Header from "../utils/Header";
import axios from "axios";
import {Toast} from 'primereact/toast';

const VehicleRegistration = () => {
    const [showWarning, setShowWarning] = useState(false);
    const [drivers, setDrivers] = useState([]);
    const [vehicle, setVehicle] = useState({
        VehicleNumber: '',
        VehicleType: '',
        VehicleChassisNumber: '',
        VehiclePurchaseDate: '',
        VehicleAVG: '',
        Remark: ''
    });

    const toast = useRef(null);

    const handleChange = (e) => {
        setVehicle({...vehicle, [e.target.name]: e.target.value});
    }

    function onSubmitHandle(e) {
        e.preventDefault()
        const isAnyFieldEmpty = Object.values(vehicle).some((value) => value === '');
        console.log(vehicle)

        if (isAnyFieldEmpty) {
            setShowWarning(true);
        } else {
            console.log(vehicle)
            axios
                .post('http://localhost:8081/addVehicle', vehicle)
                .then(res => {
                    console.log(res)
                    // alert('added')
                    toast.current.show({severity: 'success', summary: 'Success', detail: 'Vehicles details added successfully', life: 3000});
                })
                .catch(err => console.log(err))
            setVehicle({
                VehicleNumber: '',
                VehicleType: '',
                VehicleChassisNumber: '',
                VehiclePurchaseDate: '',
                VehicleAVG: '',
                Remark: ''
            })
        }

    }

    useEffect(() => {
        axios.get('http://localhost:8081/getDrivers')
            .then((response) => {
                setDrivers(response.data)
                console.log(drivers)
            })
            .then(error => console.log(error))
    }, []);
    return (
        <>
            <Header title={'Vehicle Registration'}/>
            <Toast ref={toast}/>
            <div className={'container mt-4 border-black'}>

                {showWarning && (
                    <div className="col-12 alert alert-warning" role="alert">
                        Please fill in all the required fields.
                    </div>
                )}<h5>Vehicle Information</h5>
                <form className="row g-3">

                    <div className="row g-3">


                        {/*VehicleNumber*/}
                        <div className="col-md-4">
                            <label htmlFor="input1" className="form-label">Vehicle Number</label>
                            <input name={'VehicleNumber'} type="text" id={'input1'}
                                   className="form-control borderBlack"
                                   placeholder="Vehicle Number" aria-label="VehicleNumber" required={true}
                                   value={vehicle.VehicleNumber} onChange={handleChange}/>
                        </div>

                        {/*Vehicle Type*/}
                        <div className="col-md-4">
                            <label htmlFor="input2" className="form-label">Vehicle Type</label>
                            <input name={'VehicleType'} type="text" id={'input2'} className="form-control"
                                   placeholder="Vehicle Type" aria-label="VehicleType" required={true}
                                   value={vehicle.VehicleType} onChange={handleChange}/>
                        </div>

                        {/* Vehicle Chassis Number*/}
                        <div className="col-md-4">
                            <label htmlFor="input3" className="form-label"> Chassis Number </label>
                            <input name={'VehicleChassisNumber'} type="text" id={'input3'} className="form-control"
                                   placeholder="Vehicle Chassis Number " aria-label="Vehicle Chassis Number"
                                   required={true}
                                   value={vehicle.VehicleChassisNumber} onChange={handleChange}/>
                        </div>


                        {/*  Vehicle Purchase Date*/}
                        <div className="col-md-4">
                            <label htmlFor="input4" className="form-label"> Purchase Date</label>
                            <input name={'VehiclePurchaseDate'} type="date" id={'input4'} className="form-control"
                                   placeholder="Vehicle Purchase Date" aria-label="Vehicle Purchase Date"
                                   required={true}
                                   value={vehicle.VehiclePurchaseDate} onChange={handleChange}/>
                        </div>


                        {/*VehicleAVG*/}
                        <div className="col-md-4">
                            <label htmlFor="input5" className="form-label"> Average</label>
                            <input name={'VehicleAVG'} type="number" id={'input5'} className="form-control"
                                   placeholder="Vehicle Average" aria-label="Vehicle Average" required={true}
                                   value={vehicle.VehicleAVG} onChange={handleChange}/>
                        </div>



                        {/*remark*/}

                        <div className="col-md-6">
                            <label htmlFor="floatingTextarea" className="form-label"> Remark</label>
                            <textarea className="form-control" placeholder="Remark" name={'Remark'}
                                      id="floatingTextarea" required={true} value={vehicle.Remark}
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

export default VehicleRegistration;