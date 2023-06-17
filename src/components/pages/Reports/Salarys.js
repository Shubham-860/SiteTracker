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

const Salarys = () => {
    const [salarys, setSalarys] = useState([]);
    const toast = useRef(null);
    const [filters, setFilters] = useState({
        global: {value: null, matchMode: FilterMatchMode.CONTAINS},
    });
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [expandedRows, setExpandedRows] = useState([]);



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
        {field: 'Month', header: 'Month'},
        {field: 'PayDay', header: 'Date'},
        {field: 'DriverName', header: 'Driver Name'},
        {field: 'AmountToPay', header: 'Amount To Pay'},
        {field: 'TotalHours', header: 'Total Hours'},
        {field: 'uid', header: 'Transaction ID'}
    ];

    const exportColumns = cols.map((col) => ({title: col.header, dataKey: col.field}));

    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);
                doc.text("Drivers Salary", 15, 0)
                doc.autoTable(exportColumns, salarys.map(driver => {
                    const date = new Date(driver.PayDay)
                    const date2 = new Date(driver.Month)
                    return {...driver, PayDay: date.toLocaleDateString(), Month: date2.toLocaleDateString()}
                }));
                doc.save('Drivers Salary.pdf');
            });
        });
    };

    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(salarys);
            const workbook = {Sheets: {data: worksheet}, SheetNames: ['data']};
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx', type: 'array'
            });

            saveAsExcelFile(excelBuffer, 'DriversSalary');
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
            await axios.delete('http://localhost:8081/getDriversSalary/' + Number(id))
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
            <div className="flex justify-content-center" key={rawData.iddrivers}>
                <BsTrash className={'deleteIcon'} onClick={() => {
                    deleteField(rawData.iddieselPurchase)

                }}/>

                {/*<ConfirmDeleteDialogBox from={'deleteDriver'} id={rawData.iddrivers} refresh={getDrivers}  />*/}

            </div>)
    }
    const date = (rawData) => {
        const date = new Date(rawData.PayDay)
        return (<div className={'p-0 m-0 text-center'}>{date.toLocaleDateString()} </div>)
    }
    const month = (rawData) => {
        const date = new Date(rawData.Month)
        return (<span className={'p-0 m-0'}>{date.toLocaleDateString()} </span>)
    }
    const getDieselPurchase = () => {
        axios.get('http://localhost:8081/getDriversSalary')
            .then((response) => {
                setSalarys(response.data)
                console.log(salarys)
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

        <h2 className={'col-md-4 text-center'}>Drivers Salary Information</h2>
        <div className={'col-md-4 text-end'}>
            <InputText
                value={globalFilterValue}
                onChange={onGlobalFilterChange}
                placeholder={"Keyword Search"}
            />
        </div>
    </div>);

    const headerTemplate = (data) => {
        return (
            <span className="vertical-align-middle ml-2 font-bold line-height-3">
          {month(data)}
            </span>
        );
    };

    useEffect(() => {
        getDieselPurchase()
    }, []);

    return (<div className={'container-fluid'}>
            <Header title={'Drivers Salary'}/>
            <Toast ref={toast}/>
            <div className={'card m-5'}>
                <DataTable value={salarys} removableSort tableStyle={{minWidth: '50rem'}} filters={filters}
                           header={header} emptyMessage="No customers found." rows={5} resizableColumns
                           stripedRows paginator rowsPerPageOptions={[5, 10, 25, 50]}
                           globalFilterFields={[
                               'DriverName',
                               'PayDay',
                               'Month',
                               'AmountToPay',
                               'TotalHours',
                               'uid',
                           ]}
                           rowGroupMode="subheader"
                           groupRowsBy="Month"
                           sortMode="single"
                           sortField="Month"
                           sortOrder={1}
                           expandableRowGroups
                           expandedRows={expandedRows}
                           onRowToggle={(e) => setExpandedRows(e.data)}
                           rowGroupHeaderTemplate={headerTemplate}
                >
                    <Column field={'Month'} header={'Month'} sortable body={month}></Column>
                    <Column field={'PayDay'} header={'Pay Day'} sortable body={date}></Column>
                    <Column field={'DriverName'} header={'Driver Name'} sortable ></Column>
                    <Column field={'Rate'} header={'Rate'} sortable></Column>
                    <Column field={'AmountToPay'} header={'Amount To Pay'} sortable></Column>
                    <Column field={'TotalHours'} header={'Total Hours'} sortable></Column>
                    <Column field={'uid'} header={'Transaction ID'} sortable></Column>
                    <Column header={'Delete'} body={deleteBody}></Column>
                </DataTable>
            </div>
        </div>

    );
};

export default Salarys;
