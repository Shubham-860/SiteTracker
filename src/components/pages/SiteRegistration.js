import React, {useContext, useRef, useState} from 'react';
import '../../App.css'
import axios from "axios";
import Header from "../utils/Header";
import User from "../../context/user";
import {Toast} from 'primereact/toast';

const SiteRegistration = () => {
    const [site, setSite] = useState({
        OwnerName: '',
        SiteName: '',
        Contact: '',
        Email: '',
        SiteAddress: '',
        Remark: '',
        FixedAmount: '',
        PaidAmount: '',
    });
    const [showWarning, setShowWarning] = useState(false);
    const [showWarning2, setShowWarning2] = useState(false);
    const toast = useRef(null);
    const handleChange = (e) => {
        setSite({...site, [e.target.name]: e.target.value});
    }
    const onSubmit = (e) => {
        e.preventDefault()
        const isAnyFieldEmpty = Object.values(site).some((value) => value === '');
        setShowWarning2(false)

        if (isAnyFieldEmpty) {
            setShowWarning(true);
        } else {
            setShowWarning(false);
            console.log(site);
            axios
                .post('http://localhost:8081/addSite', site)
                .then(res => {
                    console.log(res)
                    if (res.data !=="error Error: ER_DUP_ENTRY: Duplicate entry 'phaltan' for key 'site.SiteName_UNIQUE'"){
                        toast.current.show({severity: 'success', summary: 'Success', detail: 'Site details added successfully', life: 3000});
                        // alert('added');
                        setSite({
                            OwnerName: '',
                            SiteName: '',
                            Contact: '',
                            Email: '',
                            SiteAddress: '',
                            Remark: '',
                            FixedAmount: '',
                            PaidAmount: '',
                        })
                    }
                    else {
                        setShowWarning2(true)
                        toast.current.show({severity:'warn', summary: 'Warning', detail:'Message Content', life: 3000});
                    }
                })
                .catch(err => {
                    toast.current.show({severity: 'error', summary: 'Error', detail: 'Something went wrong', life: 3000});
                    console.log(err)
                })


        }
    };


    return (
        <>
            <Header title={'Site Registration'}/>
            <Toast ref={toast}/>
            <div className={'container mt-4 border-black'}>

                {showWarning && (
                    <div className="col-12 alert alert-warning" role="alert">
                        Please fill in all the required fields.
                    </div>
                )}
                {showWarning2 && (
                    <div className="col-12 alert alert-warning" role="alert">
                        Site Name already exists
                    </div>
                )}
                <h5>Site information</h5>
                <form className="row g-3">

                    <div className="row g-3">


                        {/*Site Owner Name*/}
                        <div className="col-md-4">
                            <label htmlFor="input1" className="form-label">Site Owner Name</label>
                            <input name={'OwnerName'} type="text" id={'input1'} className="form-control borderBlack"
                                   placeholder="Site Owner Name" aria-label="Site Owner Name" required={true}
                                   value={site.OwnerName} onChange={handleChange}/>
                        </div>

                        {/*Site Name*/}
                        <div className="col-md-4">
                            <label htmlFor="input2" className="form-label">Site Name</label>
                            <input name={'SiteName'} type="text" id={'input2'} className="form-control"
                                   placeholder="Site Name" aria-label="Site Name" required={true}
                                   value={site.SiteName} onChange={handleChange}/>
                        </div>

                        {/*Contact Number*/}
                        <div className="col-md-4">
                            <label htmlFor="input3" className="form-label"> Contact Number </label>
                            <input name={'Contact'} type="number" id={'input3'} className="form-control"
                                   placeholder="Contact Number" aria-label="Contact Number" required={true}
                                   value={site.Contact} onChange={handleChange}/>
                        </div>

                        {/*Email id*/}
                        <div className="col-md-4">
                            <label htmlFor="input4" className="form-label"> Email id </label>
                            <input name={'Email'} type="email" id={'input4'} className="form-control"
                                   placeholder="Email id"
                                   aria-label="Email id" required={true} value={site.Email} onChange={handleChange}/>
                        </div>

                    </div>
                    <h5 className={'mt-4'}>Payment information</h5>

                    <div className="row g-3 my-3">

                        <div className="col-md-6">
                            <label htmlFor="floatingTextarea" className="form-label">Site address</label>
                            <textarea className="form-control" placeholder="Site address" name={'SiteAddress'}
                                      id="floatingTextarea" required={true} value={site.SiteAddress}
                                      onChange={handleChange}></textarea>
                        </div>


                        <div className="col-md-6">
                            <label htmlFor="floatingTextarea2" className="form-label">Any remark</label>
                            <textarea className="form-control" placeholder="Any remark" name={'Remark'}
                                      id="floatingTextarea2" required={true} value={site.Remark}
                                      onChange={handleChange}></textarea>
                        </div>


                        <div className="col-md-4">
                            <label htmlFor="input5" className="form-label"> Owner Fixed Amount </label>
                            <input name={'FixedAmount'} type="number" id={'input5'} className="form-control"
                                   placeholder="Owner Fixed Amount"
                                   aria-label="Owner Fixed Amount" required={true} value={site.FixedAmount}
                                   onChange={handleChange}/>
                        </div>

                        <div className="col-md-4">
                            <label htmlFor="input6" className="form-label">Paid Amount </label>
                            <input name={'PaidAmount'} type="number" id={'input6'} className="form-control"
                                   placeholder="Paid Amount"
                                   aria-label="Paid Amount" required={true} value={site.PaidAmount}
                                   onChange={handleChange}/>
                        </div>

                    </div>

                    <div className="col-12 d-flex justify-content-center">
                        <button type="submit" className="btn btn-outline-info btn-lg" onClick={onSubmit}>Submit
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default SiteRegistration;