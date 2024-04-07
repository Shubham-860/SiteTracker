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

const Sites = () => {
    const [sites, setSites] = useState([]);
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
            severity: 'success', summary: 'Success', detail: 'Site details deleted successfully', life: 3000
        });
    }
    const showError = () => {
        toast.current.show({severity: 'error', summary: 'Error', detail: 'Something went wrong', life: 3000});
    }

    const cols = [
        {field: 'EntryDate', header: 'Date'},
        {field: 'OwnerName', header: 'Owner Name'},
        {field: 'SiteName', header: 'Site Name'},
        {field: 'Contact', header: 'Contact'},
        {field: 'Email', header: 'Email'},
        {field: 'SiteAddress', header: 'Site Address'},
        {field: 'Remark', header: 'Remark'},
        {field: 'FixedAmount', header: 'Fixed Amount'},
        {field: 'PaidAmount', header: 'Paid Amount'}
    ];

    const exportColumns = cols.map((col) => ({title: col.header, dataKey: col.field}));

    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default({
                    orientation: 'landscape', // Set the page orientation to landscape
                });
                doc.text('Sites', 15, 10); // Adjust the position of the text as needed
                doc.autoTable(exportColumns, sites.map((driver) => {
                    const date3 = new Date(driver.EntryDate);
                    return {
                        ...driver,
                        EntryDate: date3.toLocaleDateString(),
                    };
                }));
                doc.save('Sites.pdf');
            });
        });
    };

    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(sites);
            const workbook = {Sheets: {data: worksheet}, SheetNames: ['data']};
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx', type: 'array'
            });

            saveAsExcelFile(excelBuffer, 'Site');
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
            await axios.delete(`${baseUrl}/deleteSite/` + Number(id))
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
        getAllPayment()
    }
    const deleteBody = (rawData) => {
        return (
            <div className="flex justify-content-center" key={rawData.idpayments}>
                <BsTrash className={'deleteIcon'} onClick={() => {
                    deleteField(rawData.siteid)
                }}/>

                {/*<ConfirmDeleteDialogBox from={'deleteDriver'} id={rawData.iddrivers} refresh={getDrivers}  />*/}

            </div>)
    }
    const date = (rawData) => {
        const date = new Date(rawData.EntryDate)
        return (<div className={'p-0 m-0 text-center'}>{date.toLocaleDateString()} </div>)
    }
    const getAllPayment = () => {
        axios.get(`${baseUrl}/getSite`)
            .then((response) => {
                setSites(response.data)
                console.log(sites)
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

        <h2 className={'col-md-4 text-center'}>Sites Information</h2>
        <div className={'col-md-4 text-end'}>
            <InputText
                value={globalFilterValue}
                onChange={onGlobalFilterChange}
                placeholder={"Keyword Search"}
            />
        </div>
    </div>);

    useEffect(() => {
        getAllPayment()
    });

    return (<div className={'container-fluid'}>
            <Header title={'Site Information'}/>
            <Toast ref={toast}/>
            <div className={'card m-5'}>
                <DataTable value={sites} removableSort tableStyle={{minWidth: '50rem'}} filters={filters}
                           header={header} emptyMessage="No customers found." rows={5} resizableColumns
                           stripedRows paginator rowsPerPageOptions={[5, 10, 25, 50]}
                           globalFilterFields={['date', 'amount', 'from', 'to', 'subject', 'type', 'uid']}>
                    <Column field={'EntryDate'} header={'Date'} sortable body={date}></Column>
                    <Column field={'OwnerName'} header={'Owner Name'} sortable></Column>
                    <Column field={'SiteName'} header={'Site Name'} sortable></Column>
                    <Column field={'Contact'} header={'Contact'} sortable></Column>
                    <Column field={'Email'} header={'Email'} sortable></Column>
                    <Column field={'SiteAddress'} header={'Address'} sortable style={{ maxWidth: '20rem' }}></Column>
                    <Column field={'FixedAmount'} header={'Fixed '} sortable></Column>
                    <Column field={'PaidAmount'} header={'Paid '} sortable></Column>
                    {/*<Column field={'Remark'} header={'Remark'} style={{width: '25%', height: "auto"}} sortable*/}
                    {/*  body={remarkBody}></Column>*/}
                    <Column header={'Delete'} body={deleteBody}></Column>
                </DataTable>
            </div>
        </div>

    );
};

export default Sites;
