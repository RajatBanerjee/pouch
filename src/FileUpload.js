import React, { useState } from 'react';
import { API, Auth, Storage } from 'aws-amplify';
import Dropzone from "react-dropzone";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import DialogTitle from '@mui/material/DialogTitle';

const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
};

const activeStyle = {
    borderColor: '#2196f3'
};

const acceptStyle = {
    borderColor: '#00e676'
};

const rejectStyle = {
    borderColor: '#ff1744'
};

Storage.configure({ level: 'private' });


// const insertIntoDb = () => {
//     let folderName = await(await Auth.currentCredentials()).identityId

//     let timeStr = new Date().toUTCString()

//     let fileData = {
//         userId: this.state.user.attributes.sub,
//         userName: this.state.user.attributes.email,
//         fileName: this.state.fileName,
//         insTs: timeStr,
//         updTs: timeStr,
//         fileDesc: this.state.fileDesc,
//         filePath: `${folderName}/${this.state.fileName}`,
//     }

//     const myInit = {
//         headers: {
//             Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
//         },
//         body: fileData
//     };

//     API.post("pouch-api", "/userdata", myInit)
//         .then(data => {
//             console.log("data from backend", data)
//             window.location.reload();
//         })
//         .catch(err => {
//             console.log("err", err)
//         });

// }

// const handleTextAreaChange = (event) => {
//     this.setState({ fileDesc: event.target.value });
// }



export default function StyledDropzone(props) {
    const [file, setFile] = useState({});
    const [open, setOpen] = useState(false);

    const handleDrop = (acceptedFiles) => {
        setOpen(true)
        setFile(acceptedFiles)
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleUpload = async () => {

    let result = await Storage.put(file.fileName, file);
    console.log("Sorage ->>", result)

    // result = await this.insertIntoDb()
    // console.log("db insert ->>", result)
    // this.setState({ dlBtnDisabled: true })

    }

    return (
        <div className="container">
            <Dropzone onDrop={handleDrop}>
                {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps({ className: "dropzone" })}>
                        <input {...getInputProps()} />
                        <p>Drag'n'drop files, or click to select files</p>
                    </div>
                )}
            </Dropzone>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Upload File</DialogTitle>
                <DialogContent>
                    {/*  */}
                    <Box sx={{width: 500, height: 100,}}>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Description"
                        fullWidth
                        variant="standard"
                    />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" color="error" onClick={handleClose}>Cancel</Button>
                    <Button variant="outlined" onClick={handleUpload}>Upload</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}