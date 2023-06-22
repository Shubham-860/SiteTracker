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

const Diesel = () => {
    const [dieselPurchase, setDieselPurchase] = useState([]);
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
            severity: 'success', summary: 'Success', detail: 'Deleted successfully', life: 3000
        });
    }
    const showError = () => {
        toast.current.show({severity: 'error', summary: 'Error', detail: 'Something went wrong', life: 3000});
    }

    const cols = [
        {field: 'date', header: 'Date'},
        {field: 'PumpName', header: 'Name'},
        {field: 'PumpAddress', header: 'Address'},
        {field: 'Remark', header: 'Remark'},
        {field: 'Rate', header: 'Rate'},
        {field: 'Quantity', header: 'Quantity'},
        {field: 'Total', header: 'Total'},
        {field: 'uid', header: 'Transaction ID'}
    ];

    const exportColumns = cols.map((col) => ({title: col.header, dataKey: col.field}));

    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);
                doc.text("Drivers list", 15, 0)
                doc.autoTable(exportColumns, dieselPurchase.map(driver => {
                    const date = new Date(driver.date)
                    return {...driver, date: date.toLocaleDateString()}
                }));
                doc.save('Diesel Purchase.pdf');
            });
        });
    };

    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(dieselPurchase);
            const workbook = {Sheets: {data: worksheet}, SheetNames: ['data']};
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx', type: 'array'
            });

            saveAsExcelFile(excelBuffer, 'DieselPurchase');
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
    const deleteField = async (iddieselPurchase) => {
        // alert(id)
        try {
            await axios.delete('http://localhost:8081/deleteFuelPurchase/' + Number(iddieselPurchase))
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
        getDieselPurchase()
    }
    const deleteBody = (rawData) => {
        return (
            <div className="flex justify-content-center" key={rawData.iddieselPurchase}>
                <BsTrash className={'deleteIcon'} onClick={() => {
                    deleteField(rawData.iddieselPurchase)

                }}/>

                {/*<ConfirmDeleteDialogBox from={'deleteDriver'} id={rawData.iddrivers} refresh={getDrivers}  />*/}

            </div>)
    }
    const date = (rawData) => {
        const date = new Date(rawData.date)
        return (<div className={'p-0 m-0 text-center'}>{date.toLocaleDateString()} </div>)
    }
    const getDieselPurchase = () => {
        axios.get('http://localhost:8081/getDieselPurchase')
            .then((response) => {
                setDieselPurchase(response.data)
                console.log(dieselPurchase)
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

        <h2 className={'col-md-4 text-center'}>Diesel Purchase Information</h2>
        <div className={'col-md-4 text-end'}>
            <InputText
                value={globalFilterValue}
                onChange={onGlobalFilterChange}
                placeholder={"Keyword Search"}
            />
        </div>
    </div>);

    useEffect(() => {
        getDieselPurchase()
    }, []);

    return (<div className={'container-fluid'}>
            <Header title={'Diesel Purchase'}/>
            <Toast ref={toast}/>
            <div className={'card m-5'}>
                <DataTable value={dieselPurchase} removableSort tableStyle={{minWidth: '50rem'}} filters={filters}
                           header={header} emptyMessage="No customers found." rows={5} resizableColumns
                           stripedRows paginator rowsPerPageOptions={[5, 10, 25, 50]}
                           globalFilterFields={[
                               'date',
                               'PumpName',
                               'PumpAddress',
                               'Remark',
                               'Rate',
                               'Quantity',
                               'Total',
                               'uid',
                           ]}>
                    <Column field={'date'} header={'Date'} sortable body={date}></Column>
                    <Column field={'PumpName'} header={'PumpName'} sortable></Column>
                    <Column field={'PumpAddress'} header={'PumpAddress'} sortable></Column>
                    <Column field={'Remark'} header={'Remark'} sortable></Column>
                    <Column field={'Rate'} header={'Rate'} sortable></Column>
                    <Column field={'Quantity'} header={'Quantity'} sortable></Column>
                    <Column field={'Total'} header={'Total'} sortable></Column>
                    <Column field={'uid'} header={'Transaction ID'} sortable></Column>
                    {/*<Column field={'Remark'} header={'Remark'} style={{width: '25%', height: "auto"}} sortable*/}
                    {/*  body={remarkBody}></Column>*/}
                    <Column header={'Delete'} body={deleteBody}></Column>
                </DataTable>
            </div>
        </div>

    );
};

export default Diesel;
