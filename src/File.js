import React, { Component } from "react";
import { MDBForm, MDBContainer, MDBCol, MDBRow, MDBBtn, MDBModal, MDBCard } from 'mdb-react-ui-kit';

import { API, Storage, Auth } from 'aws-amplify';
import { withRouter } from "react-router-dom";

class File extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: {
                id: 0,
                userId: "",
                userName: "",
                fileName: "",
                insTs: "",
                updTs: "",
                fileDesc: "",
                uploadedBy: "",
                uploadedOn: "",
                lastUpdated: "",
                Size: "",
                fileUrl: "",
            }, isadmin: false,
            showModal: false
        };
    }


    async getFiles() {
        const search = this.props.location.search;
        const id = new URLSearchParams(search).get("id");
       
        const myInit = {
            headers: {
                Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
            },
        };

        try {
            var dbData = await API.get("pouch-api", "/userdata/" + id, myInit)
            console.log("db data ==>", dbData)
            console.log("user in file=>", this.state.user)
            this.setState({
                file: {
                    id: dbData.id,
                    userId: this.state.user.attributes.sub,
                    fileName: dbData.fileName,
                    userName: dbData.userName,
                    uploadedBy: this.state.user.attributes.given_name + ' ' + this.state.user.attributes.family_name,
                    insTs: dbData.insTs,
                    updTs: dbData.updTs,
                    fileDesc: dbData.fileDesc
                }
            })

            if( this.state.isAdmin) {
                var fileUrl = await API.get("pouch-api", "/admin/signedurl?filename="+dbData.filePath, myInit)
                this.setState({ fileUrl: fileUrl })
            }else{
                try {
                    var fileUrl = await Storage.get(dbData.fileName, { level: 'private', download: false }) // for listing ALL files without prefix, pass '' instead
                    this.setState({ fileUrl: fileUrl })
                    console.log("File url ==>", decodeURI(fileUrl))
                } catch (err) {
                    console.log(err)
                }
            }

        } catch (err) {
            console.error(err)
        }

    }
    async componentDidMount() {
        const search = this.props.location.search;
        const id = new URLSearchParams(search).get("id");
        const lastUpdated = new URLSearchParams(search).get("lastUpdatedAt");

        let user = await Auth.currentAuthenticatedUser();


        let groups = user.signInUserSession.accessToken.payload["cognito:groups"]
        if (groups.length > 0) {
            if (groups[0] == "admin") {
                var isAdmin = true
            }
        }


        this.setState({ user, isAdmin }, () => {
            this.getFiles()
        })

    }


    async handleDelete() {
        const myInit = {
            headers: {
                Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
            },
        };

        if (this.state.isAdmin) {
            try {

                var dbData = await API.del("pouch-api", "/admin/?filename" + this.state.file.id, myInit)
                alert('File was deleted')
                this.props.history.push("/");
            } catch (err) {
                console.error(err)
            }
        }
        else {
            try {
                await Storage.remove(this.state.file.fileName, { level: 'private' })


                this.setState({ showModal: false })

                const myInit = {
                    headers: {
                        Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
                    },
                };
            }catch (err) {
                console.error(err)
            }
        }
                try {
                    var dbData = await API.del("pouch-api", "/userdata/" + this.state.file.id, myInit)
                    alert('File was deleted')
                    this.props.history.push("/");
                } catch (err) {
                    console.error(err)
                }

    }

    showDeleteModal() {
        this.setState({ showModal: true })

    }

    handleClose() {
        this.setState({ showModal: false })
    }

    render() {

        return this.state.name == "" ? (
            <div> no file selected</div>
        ) : (
null
        );
    }
}

export default withRouter(File)
{/* <MDBContainer>
<MDBRow className="justify-content-md-center">
    <MDBCol md={{ span: 8, offset: 0 }}>
        <MDBCard md={6}>
           
            <MDBCard.Body>
                <MDBCard.Title>File details</MDBCard.Title>

                <MDBForm className="mb-6" >


                    <MDBForm.Group as={MDBRow} className="mb-3" >
                        <MDBForm.Label column sm={2}>
                            id
                        </MDBForm.Label>
                        <MDBCol sm={10}>
                            <MDBForm.Label>{this.state.file.id}</MDBForm.Label>
                        </MDBCol>
                    </MDBForm.Group>


                    <MDBForm.Group as={MDBRow} className="mb-3" >
                        <MDBForm.Label column sm={2}>
                            file
                        </MDBForm.Label>
                        <MDBCol sm={10}>
                            <MDBForm.Label>{this.state.file.fileName}</MDBForm.Label>
                        </MDBCol>
                    </MDBForm.Group>

                    <MDBForm.Group as={MDBRow} className="mb-3">
                        <MDBForm.Label column sm="2">
                            Uploaded By
                        </MDBForm.Label>
                        <MDBCol sm="10">
                            <MDBForm.Label>{this.state.file.userName}</MDBForm.Label>
                        </MDBCol>
                    </MDBForm.Group>

                    <MDBForm.Group as={MDBRow} className="mb-3">
                        <MDBForm.Label column sm="2">
                            Uploaded By
                        </MDBForm.Label>
                        <MDBCol sm="10">
                            <MDBForm.Label>{this.state.file.uploadedBy}</MDBForm.Label>
                        </MDBCol>
                    </MDBForm.Group>

                    <MDBForm.Group as={MDBRow} className="mb-3">
                        <MDBForm.Label column sm="2">
                            uploaded on
                        </MDBForm.Label>
                        <MDBCol sm="10">
                            <MDBForm.Label>{this.state.file.insTs}</MDBForm.Label>
                        </MDBCol>
                    </MDBForm.Group>

                    <MDBForm.Group as={MDBRow} className="mb-3">
                        <MDBForm.Label column sm="2">
                            Up On
                        </MDBForm.Label>
                        <MDBCol sm="10">
                            <MDBForm.Label>{this.state.file.updTs}</MDBForm.Label>
                        </MDBCol>
                    </MDBForm.Group>
                    <MDBForm.Group as={MDBRow} className="mb-3">
                        <MDBForm.Label column sm="2">
                            Last modified On
                        </MDBForm.Label>
                        <MDBCol sm="10">
                            <MDBForm.Label>{this.state.file.lastUpdated}</MDBForm.Label>
                        </MDBCol>
                    </MDBForm.Group>
                    <MDBForm.Group as={MDBRow} className="mb-3">
                        <MDBForm.Label column sm="2">
                            Size
                        </MDBForm.Label>
                        <MDBCol sm="10">
                            <MDBForm.Label>{this.state.file.size}</MDBForm.Label>
                        </MDBCol>
                    </MDBForm.Group>
                    <MDBForm.Group as={MDBRow} className="mb-3">
                        <MDBForm.Label column sm="2">
                            Description
                        </MDBForm.Label>
                        <MDBCol sm="10">
                            <MDBForm.Label>{this.state.file.fileDesc}</MDBForm.Label>
                        </MDBCol>
                    </MDBForm.Group>
                    <MDBForm.Group as={MDBRow} className="mb-3" controlId="formHorizontalEmail">
                        <MDBCol sm={8}>
                            <MDBBtn href={this.state.fileUrl} className="btn btn-success">Download</MDBBtn>
                        </MDBCol>
                        <MDBCol sm={2}>
                            <MDBBtn onClick={this.showDeleteModal.bind(this)} className="btn btn-danger">Delete</MDBBtn>
                        </MDBCol>
                    </MDBForm.Group>

                </MDBForm>
            </MDBCard.Body>
        </MDBCard>
    </MDBCol>
</MDBRow>
<MDBModal show={this.state.showModal} onHide={this.handleClose.bind(this)}>
    <MDBModal.Header closeButton>
        <MDBModal.Title>Delete File</MDBModal.Title>
    </MDBModal.Header>
    <MDBModal.Body>Are you sure you want to delete this File
        <p>{this.state.name}</p>
    </MDBModal.Body>
    <MDBModal.Footer>
        <MDBBtn variant="secondary" onClick={this.handleClose.bind(this)}>
            No
        </MDBBtn>
        <MDBBtn className="btn btn-danger" onClick={this.handleDelete.bind(this)}>
            Yes
        </MDBBtn>
    </MDBModal.Footer>
</MDBModal>
</MDBContainer> */}