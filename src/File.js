import React, { Component } from "react";
import { Form, Container, Col, Row, Button, Modal, Card } from 'react-bootstrap';
import { API, Storage, Auth } from 'aws-amplify';
import { withRouter } from "react-router-dom";

class File extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
            showModal: false
        };
    }

    async componentDidMount() {
        const search = this.props.location.search;
        const id = new URLSearchParams(search).get("id");
        const lastUpdated = new URLSearchParams(search).get("lastUpdatedAt");

        let user = await Auth.currentAuthenticatedUser();
        const myInit = {
            headers: {
                Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
            },
        };

        try {
            var dbData = await API.get("pouch-api", "/userdata/" + id, myInit)
            console.log("db data ==>", dbData)
            console.log("user in file=>", user)
            this.setState({
                id: dbData.id, 
                userId : user.attributes.sub,
                fileName: dbData. fileName,
                userName: dbData.userName,
                uploadedBy: user.attributes.given_name + ' ' + user.attributes.family_name ,
                insTs: dbData.insTs, 
                updTs: dbData.updTs, 
                fileDesc: dbData.fileDesc, })
        } catch (err) {
            console.error(err)
        }

        try {
            var fileUrl = await Storage.get(dbData.fileName, { level: 'private', download: false }) // for listing ALL files without prefix, pass '' instead
            this.setState({ fileUrl: fileUrl })

        } catch (err) {
            console.log(err)
        }
    }


    async handleDelete() {
        try {
            await Storage.remove(this.state.fileName, { level: 'private' })

           
            this.setState({ showModal: false })

            const myInit = {
                headers: {
                    Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
                },
            };
    
            try {
                var dbData = await API.del("pouch-api", "/userdata/" + this.state.id, myInit)
                alert('File was deleted')
                this.props.history.push("/");
            } catch (err) {
                console.error(err)
            }
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
        <Container>
            <Row className="justify-content-md-center">
                <Col md={{ span: 8, offset: 0 }}>
                    <Card md={6}>
                        {/* <i class="fas fa-file-image fa-5x"></i> */}
                        <Card.Body>
                            <Card.Title>File details</Card.Title>

                            <Form className="mb-6" >
                                

                            <Form.Group as={Row} className="mb-3" >
                                    <Form.Label column sm={2}>
                                        id
                                    </Form.Label>
                                    <Col sm={10}>
                                        <Form.Label>{this.state.id}</Form.Label>
                                    </Col>
                                </Form.Group>


                                <Form.Group as={Row} className="mb-3" >
                                    <Form.Label column sm={2}>
                                        file
                                    </Form.Label>
                                    <Col sm={10}>
                                        <Form.Label>{this.state.fileName}</Form.Label>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3" >
                                    <Form.Label column sm={2}>
                                        File Name
                                    </Form.Label>
                                    <Col sm={10}>
                                        <Form.Label>{this.state.fileName}</Form.Label>
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="2">
                                        Uploaded By
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Label>{this.state.userName}</Form.Label>
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="2">
                                        Uploaded By
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Label>{this.state.uploadedBy}</Form.Label>
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="2">
                                        uploaded on
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Label>{this.state.insTs}</Form.Label>
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="2">
                                        Up On
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Label>{this.state.updTs}</Form.Label>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="2">
                                        Last modified On
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Label>{this.state.lastUpdated}</Form.Label>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="2">
                                        Size
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Label>{this.state.size}</Form.Label>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="2">
                                        Description
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Label>{this.state.fileDesc}</Form.Label>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
                                    <Col sm={8}>
                                        <Button href={this.state.fileUrl} className="btn btn-success">Download</Button>
                                    </Col>
                                    <Col sm={2}>
                                        <Button onClick={this.showDeleteModal.bind(this)} className="btn btn-danger">Delete</Button>
                                    </Col>
                                </Form.Group>

                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Modal show={this.state.showModal} onHide={this.handleClose.bind(this)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete File</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this File
                    <p>{this.state.name}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose.bind(this)}>
                        No
                    </Button>
                    <Button className="btn btn-danger" onClick={this.handleDelete.bind(this)}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}
}

export default withRouter(File)