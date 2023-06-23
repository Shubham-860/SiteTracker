import React, {useEffect, useRef, useState} from 'react';
import Header from "../utils/Header";
import {Toast} from "primereact/toast";
import axios from "axios";
import {v4 as uuidv4} from 'uuid';
import {Dropdown} from "primereact/dropdown";
import {useNavigate} from "react-router-dom";

const OwnerPayments = () => {
    const toast = useRef(null);
    const [sites, setSites] = useState([]);
    const [ownerPayment, setOwnerPayment] = useState({
        SiteName: '',
        Date: '',
        PayingAmount: '',
        uid: uuidv4(),
    });
    const [showWarning, setShowWarning] = useState(false);
    const navigate = useNavigate()

    const OwnerName = useRef();
    const Contact = useRef();
    const Email = useRef();
    const Address = useRef();
    const Remark = useRef();

    const FixedAmount = useRef();
    const PaidAmount = useRef();
    const RemainingAmount = useRef();

    const PendingAmount = useRef();

    const handleChange = (e) => {
        setOwnerPayment({...ownerPayment, [e.target.name]: e.target.value});
    }

    function onSubmitHandle(e) {
        e.preventDefault()
        const isAnyFieldEmpty = Object.values(ownerPayment).some((value) => value === '');
        console.log(ownerPayment)
        if (isAnyFieldEmpty) {
            toast.current.show({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please fill in all the fields.',
                life: 3000
            });
        } else {
            console.log(ownerPayment)
            console.log('ownerPayment')
            console.log({
                ...ownerPayment,
                SiteName: ownerPayment.SiteName.name,
                from: OwnerName.current.value,
                to: 'Vishwaraj Enterprise',
                subject: 'Owner Payment',
                type: 'Payment',
            })
            axios
                .post('http://localhost:8081/sitePayment', {
                    ...ownerPayment,
                    FixedAmount: FixedAmount.current.value,
                    SiteName: ownerPayment.SiteName.name,
                    from: OwnerName.current.value,
                    to: 'Vishwaraj Enterprise',
                    subject: 'Owner PAyment',
                    type: 'Payment',
                })
                .then(res => {
                    console.log(res)
                    // alert('added')
                    toast.current.show({
                        severity: 'success', summary: 'Success', detail: 'Driver details added successfully', life: 3000
                    });
                })
                .catch(err => {
                    toast.current.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Something went wrong',
                        life: 3000
                    });
                    console.log(err)
                })
            setOwnerPayment({
                SiteName: '',
                Date: '',
                PayingAmount: '',
                uid: uuidv4(),
            })
            fetchData().then()
            navigate(0)
        }

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

    const fetchData = async () => {
        try {
            const siteResponse = await axios.get('http://localhost:8081/getSite');
            setSites(siteResponse.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);
    return (
        <>

            <Header title={'Owner Payments'}/>
            <Toast ref={toast}/>

            <div className={'container mb-4 pb-5 border-black'}>

                {showWarning && (
                    <div className="col-12 alert alert-warning" role="alert">
                        Please fill in all the required fields.
                    </div>
                )}

                <form className="row g-3">

                    {/*select info*/}

                    {/*<h5>Select  Information</h5>*/}
                    <div className="row g-3">
                        <div className="col-md-1"/>
                        {/*Site Name*/}
                        <div className="col-md-4">
                            <label htmlFor="input3" className="form-label">Select Site</label>
                            <div className="card flex justify-content-center">
                                <Dropdown
                                    id={'select3'}
                                    options={sites.map(sites => ({name: sites.SiteName}))} optionLabel="name"
                                    placeholder="Select drivers" filter valueTemplate={selectedTemplate}
                                    name={'SiteName'} itemTemplate={optionTemplate}
                                    className="w-full md:w-14rem" value={ownerPayment.SiteName}
                                    onChange={(e) => {
                                        setOwnerPayment({...ownerPayment, [e.target.name]: e.target.value})
                                        console.log(e.target.value.name)
                                        sites.map(site => {
                                            if (site.SiteName === e.target.value.name) {
                                                OwnerName.current.value = site.OwnerName
                                                Contact.current.value = site.Contact
                                                Email.current.value = site.Email
                                                Address.current.value = site.SiteAddress
                                                Remark.current.value = site.Remark
                                                FixedAmount.current.value = site.FixedAmount
                                                PaidAmount.current.value = site.PaidAmount
                                                RemainingAmount.current.value = site.FixedAmount - site.PaidAmount
                                            }
                                            return null
                                        })
                                    }}
                                />
                            </div>
                        </div>
                        <div className="col-md-1 "/>
                        {/*payment Date*/}
                        <div className="col-md-4">
                            <label htmlFor="input1" className="form-label">Payment Date</label>
                            <input name={'Date'} type="datetime-local" id={'input1'}
                                   className="form-control form-control-lg "
                                   placeholder="Join Date" aria-label="JoinDate" required={true}
                                   value={ownerPayment.Date} onChange={handleChange}/>
                        </div>
                    </div>


                    {/*Fixed info*/}
                    <h5 className={''}>Select Information</h5>
                    <div className="row g-2">

                        {/*Site Owner Name*/}
                        <div className="col-md-4">
                            <label htmlFor="input1" className="form-label">Site Owner Name</label>
                            <input name={'OwnerName'} type="text" id={'input1'} className="form-control borderBlack"
                                   placeholder="Site Owner Name" aria-label="Site Owner Name" required={true}
                                   ref={OwnerName} disabled/>
                        </div>


                        {/*Contact Number*/}
                        <div className="col-md-4">
                            <label htmlFor="input3" className="form-label"> Contact Number </label>
                            <input name={'Contact'} type="number" id={'input3'} className="form-control"
                                   placeholder="Contact Number" aria-label="Contact Number" required={true}
                                   ref={Contact} disabled/>
                        </div>

                        {/*Email id*/}
                        <div className="col-md-4">
                            <label htmlFor="input4" className="form-label"> Email id </label>
                            <input name={'Email'} type="email" id={'input4'} className="form-control"
                                   placeholder="Email id" aria-label="Email id" required={true}
                                   ref={Email} disabled/>
                        </div>

                    </div>


                    <div className="row g-3">

                        {/*address*/}
                        <div className="col-md-6">
                            <label htmlFor="floatingTextarea" className="form-label">address</label>
                            <textarea className="form-control" placeholder="Site address" name={'SiteAddress'} rows={1}
                                      id="floatingTextarea" required={true} ref={Address} disabled/>
                        </div>

                        {/*remark*/}
                        <div className="col-md-6">
                            <label htmlFor="floatingTextarea2" className="form-label">remark</label>
                            <textarea className="form-control" placeholder="Any remark" name={'Remark'} rows={1}
                                      id="floatingTextarea2" required={true} ref={Remark} disabled/>
                        </div>
                    </div>


                    {/*Fixed info*/}
                    <h5 className={''}>Payment Information</h5>
                    <div className="row g-2">
                        {/*Owner Fixed Amount*/}
                        <div className="col-md-4">
                            <label htmlFor="input5" className="form-label"> Owner Fixed Amount </label>
                            <input name={'FixedAmount'} type="number" id={'input5'} className="form-control"
                                   placeholder="Owner Fixed Amount" aria-label="Owner Fixed Amount"
                                   required={true} ref={FixedAmount} disabled/>
                        </div>

                        {/*Paid Amount*/}
                        <div className="col-md-4">
                            <label htmlFor="input6" className="form-label">Paid Amount </label>
                            <input name={'PaidAmount'} type="number" id={'input6'} className="form-control"
                                   placeholder="Paid Amount" aria-label="Paid Amount"
                                   required={true} ref={PaidAmount} disabled/>
                        </div>


                        {/*Remaining Amount*/}
                        <div className="col-md-4">
                            <label htmlFor="input6" className="form-label">Remaining Amount </label>
                            <input name={'RemainingAmount'} type="number" id={'input6'} className="form-control"
                                   placeholder="Remaining Amount" aria-label="Remaining Amount"
                                   required={true} ref={RemainingAmount} disabled/>
                        </div>


                        <div className="col-md-4">
                            <label htmlFor="input6" className="form-label">Paid Amount </label>
                            <input name={'PayingAmount'} type="number" id={'input6'} className="form-control"
                                   placeholder="Paying Amount"
                                   aria-label="Paying Amount" required={true} value={ownerPayment.PayingAmount}
                                   onChange={e => {
                                       const paidAmount = Number(e.target.value);
                                       const remainingAmount = Number(RemainingAmount.current.value);
                                       const pendingAmount = remainingAmount - paidAmount;

                                       if (pendingAmount < 0) {
                                           toast.current.show({
                                               severity: 'error',
                                               summary: 'Error',
                                               detail: 'Incorrect Amount',
                                               life: 3000
                                           });
                                       } else {
                                           setOwnerPayment({...ownerPayment, PayingAmount: paidAmount});
                                           PendingAmount.current.value = pendingAmount;
                                       }
                                   }}/>
                        </div>


                        <div className="col-md-4">
                            <label htmlFor="input8" className="form-label">Pending Amount </label>
                            <input name={'PendingAmount'} type="number" id={'input8'} className="form-control"
                                   placeholder="Pending Amount" aria-label="Pending Amount"
                                   required={true} ref={PendingAmount} readOnly/>
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

export default OwnerPayments;