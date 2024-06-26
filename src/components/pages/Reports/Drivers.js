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
import {baseUrl} from "../../utils/baseUrl";

const Drivers = () => {
    const [drivers, setDrivers] = useState([]);
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
            severity: 'success', summary: 'Success', detail: 'Driver details deleted successfully', life: 3000
        });
    }
    const showError = () => {
        toast.current.show({severity: 'error', summary: 'Error', detail: 'Something went wrong', life: 3000});
    }

    const cols = [
        {field: 'iddrivers', header: 'Id'},
        {field: 'DriverName', header: 'Name'},
        {field: 'DriverContact', header: 'Contact'},
        {field: 'DriverAddress', header: 'Address'},
        {field: 'DrivingLicense', header: 'Driving License'},
        {field: 'JoinDate', header: 'Joining Date'},
        {field: 'RatePerHour', header: 'Rate Per Hour'}
    ];

    const exportColumns = cols.map((col) => ({title: col.header, dataKey: col.field}));

    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);
                doc.text("Drivers list", 15, 0)
                doc.autoTable(exportColumns, drivers.map(driver => {
                    const date = new Date(driver.JoinDate)
                    return {...driver, JoinDate: date.toLocaleDateString()}
                }));
                doc.save('drivers.pdf');
            });
        });
    };

    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(drivers);
            const workbook = {Sheets: {data: worksheet}, SheetNames: ['data']};
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx', type: 'array'
            });

            saveAsExcelFile(excelBuffer, 'drivers');
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
            await axios.delete(`${baseUrl}/deleteDriver/` + Number(id))
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

        } catch (e) {
            showError()
        }
        getDrivers()
    }
    const deleteBody = (rawData) => {
        return (
            <div className="flex justify-content-center" key={rawData.iddrivers}>
                <BsTrash className={'deleteIcon'} onClick={() => {
                    deleteField(rawData.iddrivers)

                }}/>

                {/*<ConfirmDeleteDialogBox from={'deleteDriver'} id={rawData.iddrivers} refresh={getDrivers}  />*/}

            </div>)
    }
    const joinDate = (rawData) => {
        const date = new Date(rawData.JoinDate)
        return (<div className={'p-0 m-0 text-center'}>{date.toLocaleDateString()} </div>)
    }
    const getDrivers = () => {
        axios.get(`${baseUrl}/getDrivers`)
            .then((response) => {
                setDrivers(response.data)
                console.log(drivers)
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

        <h2 className={'col-md-4 text-center'}>Drivers Information</h2>
        <div className={'col-md-4 text-end'}>
            <InputText
                value={globalFilterValue}
                onChange={onGlobalFilterChange}
                placeholder={"Keyword Search"}
            />
        </div>
    </div>);

    useEffect(() => {
        getDrivers()
    }, []);

    return (<div className={'container-fluid'}>
            <Header title={'Drivers Report'}/>
            <Toast ref={toast}/>
            <div className={'card m-5'}>
                <DataTable value={drivers} removableSort tableStyle={{minWidth: '50rem'}} filters={filters}
                           header={header} emptyMessage="No customers found." rows={5} resizableColumns
                           stripedRows paginator rowsPerPageOptions={[5, 10, 25, 50]}
                           globalFilterFields={[
                               'DriverName',
                               'DriverContact',
                               'DriverAddress',
                               'JoinDate',
                           ]}>
                    <Column field={'DriverName'} header={'Name'} sortable></Column>
                    <Column field={'DriverContact'} header={'Contact'} sortable></Column>
                    <Column field={'DriverAddress'} header={'Address'} sortable></Column>
                    <Column field={'AadharCard'} header={'Card'} sortable></Column>
                    <Column field={'DrivingLicense'} header={'License'} sortable></Column>
                    <Column field={'JoinDate'} header={'Join Date'} sortable body={joinDate}></Column>
                    <Column field={'RatePerHour'} header={'RPH'} sortable></Column>
                    {/*<Column field={'Remark'} header={'Remark'} style={{width: '25%', height: "auto"}} sortable*/}
                    {/*  body={remarkBody}></Column>*/}
                    <Column header={'Delete'} body={deleteBody}></Column>
                </DataTable>
            </div>
        </div>

    );
};

export default Drivers;
