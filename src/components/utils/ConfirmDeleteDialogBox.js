import React, {useRef} from "react";
import {ConfirmDialog, confirmDialog} from "primereact/confirmdialog";
import {Toast} from "primereact/toast";
import {Button} from "primereact/button";
import axios from "axios";
import {baseUrl} from "./baseUrl";

export default function ConfirmDeleteDialogBox({id, from,refresh}) {
    const toast = useRef(null);

    const accept =  () => {

         axios.delete(baseUrl + from + '/' + Number(id))
            .then(res => {
                console.log('res');
                console.log(res);
                toast.current.show({
                    severity: "info",
                    summary: "Confirmed",
                    detail: "You have accepted " + id,
                    life: 3000
                });
                refresh()
            })
            .catch(error => {
                console.log('error')
                console.log(error)
            })

    }

    const reject = () => {
        toast.current.show({
            severity: "warn",
            summary: "Rejected",
            detail: "You have rejected",
            life: 3000
        });
    };

    const confirm = () => {
        const dialog=confirmDialog({
            message: "Do you want to delete this record?",
            header: "Delete Confirmation",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            accept,
            reject
        });
        dialog.show();

    };

    return (
        <span key={id}>
            <Toast ref={toast}/>
            <ConfirmDialog/>
            <div className="card flex flex-wrap gap-2 justify-content-center">
                <Button onClick={confirm} icon="pi pi-times" label="Delete"></Button>
            </div>
        </span>
    );
}
