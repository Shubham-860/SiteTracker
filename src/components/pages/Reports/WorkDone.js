import React, {useEffect, useRef, useState} from 'react';
import './style.css'
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import axios from "axios";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {BsFileEarmarkExcel, BsFileEarmarkPdf, BsTrash} from "react-icons/bs";
import {Toast} from 'primereact/toast';
import {Button} from 'primereact/button';
import {InputText} from 'primereact/inputtext';
import {FilterMatchMode} from 'primereact/api';
import Header from "../../utils/Header";

const WorkDone = () => {
    const [workDone, setWorkDone] = useState([]);
    const toast = useRef(null);
    const [filters, setFilters] = useState({
        global: {value: null, matchMode: FilterMatchMode.CONTAINS},
    });
    const [globalFilterValue, setGlobalFilterValue] = useState('');


    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = {...filters};
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };
    const showSuccess = () => {
        toast.current.show({
            severity: 'success', summary: 'Success', detail: 'Work done details deleted successfully', life: 3000
        });
    }
    const showError = () => {
        toast.current.show({severity: 'error', summary: 'Error', detail: 'Something went wrong', life: 3000});
    }
    const cols = [
        {field: 'iddrivers', header: 'Id'},
        {field: 'VehicleNumber', header: 'Vehicle'},
        {field: 'DriverName', header: 'Driver'},
        {field: 'SiteName', header: 'Site'},
        {field: 'WorkDate', header: 'Date'},
        {field: 'StartTime', header: 'Start Time'},
        {field: 'EndTime', header: 'End Time'},
        {field: 'WorkingStatus', header: 'Status'},
        {field: 'DieselConsumption', header: 'Diesel (L)'},
        {field: 'RatePerHour', header: 'RPH'},
        {field: 'TotalPayableHours', header: 'working Hours'},
        {field: 'AmountToPay', header: 'Amount ₹'},
    ];
    const exportColumns = cols.map((col) => ({title: col.header, dataKey: col.field}));
    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default({
                    orientation: 'landscape', // Set the page orientation to landscape
                });
                doc.text('Work done', 15, 10); // Adjust the position of the text as needed
                doc.autoTable(exportColumns, workDone.map((driver) => {
                    const date3 = new Date(driver.WorkDate);
                    return {
                        ...driver,
                        WorkDate: date3.toLocaleDateString(),
                    };
                }));
                doc.save('Work done.pdf');
            });
        });
    };
    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(workDone);
            const workbook = {Sheets: {data: worksheet}, SheetNames: ['data']};
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx', type: 'array'
            });

            saveAsExcelFile(excelBuffer, 'Work done');
        });
    };
    const saveAsExcelFile = (buffer, fileName) => {
        import('file-saver').then((module) => {
            if (module && module.default) {
                let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
                let EXCEL_EXTENSION = '.xlsx';
                const data = new Blob([buffer], {
                    type: EXCEL_TYPE
                });

                module.default.saveAs(data, fileName + '_export_' + new Date().toDateString() + EXCEL_EXTENSION);
            }
        });
    };
    const deleteField = async (id) => {
        // alert(id)
        try {
            await axios.delete('http://localhost:8081/deleteWorkDone/' + Number(id))
                .then(res => {
                    console.log('res')
                    console.log(res)
                    showSuccess()
                })
                .catch(error => {
                    console.log('error')
                    console.log(error)
                    showError()
                })
            getWorkDone()
        } catch (e) {
            showError()
        }

    }
    const deleteBody = (rawData) => {
        return (<div className="flex justify-content-center">
            <BsTrash className={'deleteIcon'} onClick={() => {
                deleteField(rawData.idworkdone)

            }}/>
        </div>)
    }
    const workDate = (rawData) => {
        const date = new Date(rawData.WorkDate)
        return (<div className={'p-0 m-0 text-center'}>{date.toLocaleDateString()} </div>)
    }
    const getWorkDone = () => {
        axios.get('http://localhost:8081/getWorkDone')
            .then((response) => {
                setWorkDone(response.data)
                console.log(workDone)
            })
            .then(error => console.log(error))
    }
    const header = (<div className="row">
        <div className={'col-md-4 '}>
            <Button className={'mx-2'} type="button" icon={<BsFileEarmarkExcel/>} severity="success" rounded
                    onClick={exportExcel}
                    data-pr-tooltip="XLS"/>
            <Button className={'x-2'} type="button" icon={<BsFileEarmarkPdf/>} severity="warning" rounded
                    onClick={exportPdf}
                    data-pr-tooltip="PDF"/>
        </div>

        <h2 className={'col-md-4 text-center'}>Work Done Information</h2>
        <div className={'col-md-4 text-end'}>
            <InputText
                value={globalFilterValue}
                onChange={onGlobalFilterChange}
                placeholder={"Keyword Search"}
            />
        </div>
    </div>);
    useEffect(() => {
        getWorkDone()
    }, []);
    return (<div className={'container-fluid'}>
            <Header title={'work Done Report'}/>
            <Toast ref={toast}/>
            <div className={'card m-5'}>
                <DataTable value={workDone} removableSort tableStyle={{minWidth: '50rem'}} filters={filters}
                           header={header} emptyMessage="No customers found." rows={5} resizableColumns
                           stripedRows paginator rowsPerPageOptions={[5, 10, 25, 50]}
                           globalFilterFields={[
                               'VehicleNumber',
                               'DriverName',
                               'SiteName',
                               'WorkDate',
                               'StartTime',
                               'EndTime',
                               'WorkingStatus',
                               'DieselConsumption',
                               'RatePerHour',
                               'TotalPayableHours',
                               'AmountToPay',
                           ]}>
                    <Column field={'SiteName'} header={'Site'} sortable></Column>
                    <Column field={'DriverName'} header={'Driver'} sortable></Column>
                    <Column field={'VehicleNumber'} header={'Vehicle'} sortable></Column>
                    <Column field={'WorkingStatus'} header={'Status'} sortable></Column>
                    <Column field={'WorkDate'} header={'Date'} sortable body={workDate}></Column>
                    <Column field={'StartTime'} header={'Start Time'}></Column>
                    <Column field={'EndTime'} header={'End Time'}></Column>
                    <Column field={'DieselConsumption'} header={'Diesel'} sortable></Column>
                    <Column field={'RatePerHour'} header={'RPH'} sortable></Column>
                    <Column field={'TotalPayableHours'} header={'Hours'} sortable></Column>
                    <Column field={'AmountToPay'} header={'Amount ₹'} sortable></Column>
                    {/*<Column field={'Remark'} header={'Remark'} style={{width: '25%', height: "auto"}} sortable*/}
                    {/*  body={remarkBody}></Column>*/}
                    <Column header={'Delete'} body={deleteBody}></Column>
                </DataTable>
            </div>
        </div>

    );
};

export default WorkDone;
