import React, {useEffect, useRef, useState} from 'react';
import Header from "../utils/Header";
import axios from "axios";
import {v4 as uuidv4} from 'uuid';
import {Toast} from 'primereact/toast';

const DieselPurchase = () => {
    const [pump, setPump] = useState({
        date: '',
        PumpName: '',
        PumpAddress: '',
        Remark: '',
        Rate: '',
        Quantity: '',
        Total: '',
        uid: uuidv4()
    });
    const [showWarning, setShowWarning] = useState(false);
    const [stockDiesel, setStockDiesel] = useState(null);
    const toast = useRef(null);

    const handleChange = (e) => {
        setPump({...pump, [e.target.name]: e.target.value});
    }

    function onSubmitHandle(e) {
        e.preventDefault()
        const isAnyFieldEmpty = Object.values(pump).some((value) => value === '');

        if (isAnyFieldEmpty) {
            setShowWarning(true);
        } else {
            console.log(pump)
            axios
                .post('http://localhost:8081/fuelPurchase', {
                    ...pump,
                    from: 'Vishwaraj Enterprise',
                    to: pump.PumpName,
                    subject: 'Purchase Fuel',
                    type: 'Fuel',
                })
                .then(res => {
                    console.log(res)
                    toast.current.show({
                        severity: 'success', summary: 'Success', detail: 'Purchase info added successfully', life: 3000
                    });
                    // alert('added')
                })
                .catch(err => {
                    toast.current.show({
                        severity: 'error', summary: 'Error', detail: 'Something went wrong', life: 3000
                    });
                    console.log(err)
                })
            setPump({
                date: '',
                PumpName: '',
                PumpAddress: '',
                Remark: '',
                Rate: '',
                Quantity: '',
                Total: '',
                uid: uuidv4()
            })
        }
    }

    const handleQuantityChange = (event) => {
        const {value} = event.target;
        setPump(prevPump => ({
            ...prevPump,
            Quantity: value,
            Total: value * prevPump.Rate
        }));
    };

    const handleRateChange = (event) => {
        const {value} = event.target;
        setPump(prevPump => ({
            ...prevPump,
            Rate: value,
            Total: prevPump.Quantity * value
        }));
    };


    useEffect(() => {
        const fetchData = async () => {
            try {

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

        fetchData();
    }, []);
    return (
        <>
            <Header title={'Diesel Purchase'}/>
            <Toast ref={toast}/>

            <div className={'container mt-4 border-black'}>

                {showWarning && (
                    <div className="col-12 alert alert-warning" role="alert">
                        Please fill in all the required fields.
                    </div>
                )}<h5>Fuel Station Information</h5>
                <form className="row g-3">

                    <div className="row g-3">


                        {/*date*/}
                        <div className="col-md-4">
                            <label htmlFor="input1" className="form-label">Date</label>
                            <input name={'date'} type="datetime-local" id={'input1'}
                                   className="form-control borderBlack"
                                   placeholder="Site Owner Name" aria-label="date" required={true}
                                   value={pump.date} onChange={handleChange}/>
                        </div>

                        {/*pump Name*/}
                        <div className="col-md-4">
                            <label htmlFor="input2" className="form-label">Pump Name</label>
                            <input name={'PumpName'} type="text" id={'input2'} className="form-control"
                                   placeholder="Pump Name" aria-label="PumpName" required={true}
                                   value={pump.PumpName} onChange={handleChange}/>
                        </div>

                        {/*Remark*/}

                        <div className="col-md-4">
                            <label htmlFor="input9" className="form-label"> Remark </label>
                            <input name={'Remark'} type="text" id={'input9'} className="form-control"
                                   placeholder="Remark" aria-label="Remark" required={true}
                                   value={pump.Remark} onChange={handleChange}/>
                        </div>

                        {/*Pump Address*/}
                        <div className="col-md-6">

                            <label htmlFor="floatingTextarea" className="form-label">Pump Address</label>
                            <textarea className="form-control" placeholder="Pump Address" name={'PumpAddress'}
                                      id="floatingTextarea" required={true} value={pump.PumpAddress}
                                      onChange={handleChange}></textarea>
                        </div>


                    </div>
                    <h5 className={'mt-4'}>Payment information</h5>

                    <div className="row g-3 my-3">


                        {/*Rate*/}
                        <div className="col-md-4">
                            <label htmlFor="input3" className="form-label"> Rate</label>
                            <input name={'Rate'} type="number" id={'input3'} className="form-control"
                                   placeholder="Rate" aria-label="Rate" required={true}
                                   value={pump.Rate} onChange={handleRateChange}/>
                        </div>

                        {/*Quantity*/}
                        <div className="col-md-4">
                            <label htmlFor="input5" className="form-label"> Quantity </label>
                            <input name={'Quantity'} type="number" id={'input5'} className="form-control"
                                   placeholder="Quantity (in Liters)"
                                   aria-label="Quantity" required={true} value={pump.Quantity}
                                   onChange={handleQuantityChange}/>
                        </div>
                        {/*Total*/}
                        <div className="col-md-4">
                            <label htmlFor="input6" className="form-label">Total Amount Paid</label>
                            <input name={'Total'} type="number" id={'input6'} className="form-control"
                                   placeholder="Total Amount Paid"
                                   aria-label="Total Amount Paid" required={true} value={pump.Total}
                                   onChange={handleChange} disabled/>
                        </div>
                        <p>Remaining Diesel : {stockDiesel} liters</p>

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

export default DieselPurchase;