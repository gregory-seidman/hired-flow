import React from "react";
import { ColDef, CellParams } from "@material-ui/data-grid";
import { Contact } from "../models";

// https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript
function textWidth(text: string) {
    const div = document.createElement("div");
    div.className = "MuiDataGrid-root MuiDataGrid-colCell";
    div.style.whiteSpace = "no-wrap";
    div.style.left = "-1000px";
    div.style.top = "-1000px";
    div.style.visibility = "hidden";
    div.style.position = "absolute";
    div.innerText = "XXXX" + text;
    document.body.appendChild(div);
    const width = div.clientWidth;
    document.body.removeChild(div);
    return width;
}

const ContactCell: React.FC<Contact> =
    ({ name, email, phone, recruitingAgency }) => (
        <React.Fragment>
            <div>{name}</div>
            {recruitingAgency && <div>{recruitingAgency}</div>}
            {email && <div><a href={"mailto:" + email}>{email}</a></div>}
            {phone && <div><a href={"tel:" + phone.replace(/[^0-9a-zA-Z]/g, "")}>{phone}</a></div>}
        </React.Fragment>
);

export const columnDefs: { [fieldName: string]: ColDef } = {
    "company": {
        field: "company",
        headerName: "Company",
        sortable: true
    },
    "jobTitle": {
        field: "jobTitle",
        headerName: "Position",
        sortable: true
    },
    "notes": {
        field: "notes",
        headerName: "Notes",
        sortable: true
    },
    "contact": {
        field: "contact",
        headerName: "Point of Contact",
        sortable: false,
        renderCell: (params: CellParams) =>
            <ContactCell {...(params.getValue("contact") as Contact)} />
    },
    "status": {
        field: "status",
        headerName: "Status",
        sortable: true
    },
    "_lastInteractionDate": {
        field: "_lastInteractionDate",
        headerName: "Last Contact",
        sortable: true,
        type: "date"
    },
    "_nextInteractionDate": {
        field: "_nextInteractionDate",
        headerName: "Expected Contact",
        sortable: true,
        type: "date"
    }
};

type ColumnMapper = (field: string) => ColDef;

function columnBuilder(fieldNames: { [field: string]: string }): ColumnMapper {
    return (field: string) => {
        const colDef: ColDef = columnDefs[field] || {
            field,
            sortable: true
        };
        if (fieldNames[field]) {
            colDef.headerName = fieldNames[field];
        } else if (!colDef.headerName) {
            colDef.headerName = field.replace(/^details\./, "");
        }
        colDef.description = colDef.headerName;
        colDef.width = textWidth(colDef.headerName);
        return colDef;
    };
}

export default columnBuilder;

