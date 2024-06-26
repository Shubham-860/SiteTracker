import React, {useEffect, useRef, useState} from 'react';
import './style.css'
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import axios from "axios";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {BsFileEarmarkExcel, BsFileEarmarkPdf, BsTrash} from "react-icons/bs";
import {Button} from 'primereact/button';
import {InputText} from 'primereact/inputtext';
import {FilterMatchMode} from 'primereact/api';
import {Toast} from 'primereact/toast';
import Header from "../../utils/Header";
import {baseUrl} from "../../utils/baseUrl";

const Vehicles = () => {
    const [Vehicles, setVehicles] = useState([]);
    const toast = useRef(null);
    const [filters, setFilters] = useState({
        global: {value: null, matchMode: FilterMatchMode.CONTAINS},
    });
    const [globalFilterValue, setGlobalFilterValue] = useState('');


    const showSuccess = () => {
        toast.current.show({
            severity: 'success', summary: 'Success', detail: 'Vehicle details deleted successfully', life: 3000
        });
    }
    const showError = () => {
        toast.current.show({severity: 'error', summary: 'Error', detail: 'Something went wrong', life: 3000});
    }
    const cols = [
        {field: 'idvehicles', header: 'Id'},
        {field: 'VehicleNumber', header: 'Number'},
        {field: 'VehicleType', header: 'Type'},
        {field: 'VehicleChassisNumber', header: 'Chassis Number'},
        {field: 'VehiclePurchaseDate', header: ' PurchaseDate'},
        {field: 'VehicleAVG', header: 'AVG'}
    ];
    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = {...filters};
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };
    const exportColumns = cols.map((col) => ({title: col.header, dataKey: col.field}));
    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);
                doc.text("Vehicles list", 15, 0)
                doc.autoTable(exportColumns, Vehicles.map(driver => {
                    const date = new Date(driver.VehiclePurchaseDate)
                    return {...driver, VehiclePurchaseDate: date.toLocaleDateString()}
                }));
                doc.save('Vehicles.pdf');
            });
        });
    };
    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(Vehicles.map(driver => {
                const date = new Date(driver.VehiclePurchaseDate)
                return {...driver, VehiclePurchaseDate: date.toLocaleDateString()}
            }));
            const workbook = {Sheets: {data: worksheet}, SheetNames: ['data']};
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx', type: 'array'
            });

            saveAsExcelFile(excelBuffer, 'Vehicles');
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
            await axios.delete(`${baseUrl}/deleteVehicles/` + Number(id))
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
            getDrivers()
        } catch (e) {
            showError()
        }

    }
    const deleteBody = (rawData) => {
        return (<div className="flex justify-content-center">
            <BsTrash className={'deleteIcon'} onClick={() => {
                deleteField(rawData.idvehicles)

            }}/>
        </div>)
    }
    const joinDate = (rawData) => {
        const date = new Date(rawData.VehiclePurchaseDate)
        return (<div className={'p-0 m-0'}>{date.toLocaleDateString()} </div>)
    }
    const getDrivers = () => {
        axios.get(`${baseUrl}/getVehicles`)
            .then((response) => {
                setVehicles(response.data)
                console.log(Vehicles)
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
        getDrivers()
    }, []);

    return (<div className={'container-fluid'}>
        <Header title={'Vehicles Report'}/>
        <Toast ref={toast}/>
        <div className={'card m-5'}>
            <DataTable value={Vehicles} removableSort tableStyle={{minWidth: '50rem'}} filters={filters}
                       header={header} emptyMessage="No customers found." rows={5} resizableColumns
                       stripedRows paginator rowsPerPageOptions={[5, 10, 25, 50]}
                       globalFilterFields={['VehicleNumber', 'VehicleType', 'VehicleChassisNumber', 'VehicleAVG', 'VehiclePurchaseDate']}>
                <Column field={'idvehicles'} header={'id'} sortable></Column>
                <Column field={'VehicleNumber'} header={'Number'} sortable></Column>
                <Column field={'VehicleType'} header={'Type'} sortable></Column>
                <Column field={'VehicleChassisNumber'} header={'Chassis Number'} sortable></Column>
                <Column field={'VehicleAVG'} header={'AVG'} sortable></Column>
                <Column field={'VehiclePurchaseDate'} header={'Purchase Date'} sortable body={joinDate}></Column>
                <Column header={'Delete'} body={deleteBody}></Column>
            </DataTable>
        </div>
    </div>);
};

export default Vehicles;
