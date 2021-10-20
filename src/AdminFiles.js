import React, { useState } from "react";
import { API, Auth, Storage } from 'aws-amplify';
import { withRouter } from "react-router-dom";
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/FileDownload';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import DialogTitle from '@mui/material/DialogTitle';
import Title from './Title';

function AdminFiles(props) {
    const [isAdmin] = useState(props.isAdmin);
    const [user, setUser] = useState({});
    const [rows, setFiles] = useState([]);
    const [open, setOpen] = useState(false);
    const [dataToBeDeleted, setDataToBeDeleted] = useState({});



    React.useEffect(() => {
        if (isAdmin === false) {
            props.history.push('/')
        }
        setUser(user)
        getFiles()
    }, []);

    const handleClose = () => {
        setOpen(false);
    };

    const handleDeleteClick = async () =>{
        const myInit = {
            headers: {
                Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
            },
        };
        try {

            var dbData = await API.del("pouch-api", "/admin/?filename=" + dataToBeDeleted.row.filePath, myInit)
            
        } catch (err) {
            console.error(err)
        }

        try{
            var dbData = await API.del("pouch-api", "/userdata/" + dataToBeDeleted.row.id, myInit)
        }catch (err) {
            console.error(err)
        }

        alert('File was deleted')
        window.location.reload();
    }

    const deleteFile = React.useCallback(
        (data) => async () => {
            setDataToBeDeleted(data)
            setOpen(true);
        },
        [],
    );

    const downloadFile = React.useCallback(
        (data) => async () => {

            const myInit = {
                headers: {
                    Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
                },
            };

            var fileUrl = await API.get("pouch-api", "/admin/signedurl?filename="+data.row.filePath, myInit)
            downloadSignedFile(fileUrl, data.row.fileName);
        }, []);

    const columns = React.useMemo(
        () => [
            { field: 'id', headerName: 'Id', width: 100 },
            {
                field: 'userName',
                headerName: 'User',
                sortable: false,
                width: 200
            },
            { field: 'fileName', headerName: 'File Name', width: 200 },
            { field: 'filePath', hide:true },
            { field: 'insTs', headerName: 'Uploaded', width: 200 },
            { field: 'updTs', headerName: 'Last Updated', width: 200 },
            { field: 'fileSize', headerName: 'Size', width: 200 },
            {
                field: 'actions',
                type: 'actions',
                width: 80,
                getActions: (params) => [
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={deleteFile(params)} />,
                    <GridActionsCellItem
                        icon={<DownloadIcon />}
                        label="Download"
                        onClick={downloadFile(params)}
                    />,
                ],
            },
        ],
        [deleteFile, downloadFile],
    );


    const getFiles = async () => {
        var myInit = {
            headers: {
              Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
            },
          };

        try {
            var dbData = await API.get("pouch-api", "/userdata" , myInit)
            console.log("db data ==>", dbData)
        } catch (err) {
            console.error(err)
        }


            try {
                myInit = {
                    headers: {
                      Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
                    },
                  };
                var result = await API.get("pouch-api", "/admin", myInit)
                console.log("result ==>", result)
                if (result.Contents.length >0 ){
                    result = toCamel(result.Contents)
                }
            } catch (err) {
                console.error(err)
            }

            console.log("db data ==>", dbData)

            if (dbData != null) {
                dbData.map(d => {
                  let f = result.find((r) => { return r.key.indexOf(d.fileName) > 0 || d.fileName == r.key })
                  d.fileSize = f.size
                  return d
                })
              
              setFiles(dbData)
            }
    }

    const toCamel = (o) => {
        var that = this
        var newO, origKey, newKey, value
        if (o instanceof Array) {
            return o.map(function (value) {
                if (typeof value === "object") {
                    value = toCamel(value)
                }
                return value
            })
        } else {
            newO = {}
            for (origKey in o) {
                if (o.hasOwnProperty(origKey)) {
                    newKey = (origKey.charAt(0).toLowerCase() + origKey.slice(1) || origKey).toString()
                    value = o[origKey]
                    if (value instanceof Array || (value !== null && value.constructor === Object)) {
                        value = toCamel(value)
                    }
                    newO[newKey] = value
                }
            }
        }
        return newO
    }

    const downloadSignedFile = (url, fileName) =>{
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName || 'download';
        const clickHandler = () => {
            setTimeout(() => {
                URL.revokeObjectURL(url);
                a.removeEventListener('click', clickHandler);
            }, 150);
        };
        a.addEventListener('click', clickHandler, false);
        a.click();
    }
    
    const downloadBlob = (blob, filename) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename || 'download';
        const clickHandler = () => {
            setTimeout(() => {
                URL.revokeObjectURL(url);
                a.removeEventListener('click', clickHandler);
            }, 150);
        };
        a.addEventListener('click', clickHandler, false);
        a.click();
        return a;
    }

    return (
        <React.Fragment>
            <Title>Your Files</Title>
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    disableSelectionOnClick
                />
            </div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Delete File</DialogTitle>
                <DialogContent>
                    {/*  */}
                    <Box sx={{ width: 500, height: 100, }}>
                        Are you sure you want to delete this file
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" color="error"onClick={handleDeleteClick}>Delete</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}


export default withRouter(AdminFiles)