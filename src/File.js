import React, { Component } from "react";
import { Form, Container, Col, Row, Button, Modal, Card } from 'react-bootstrap';
import { Storage } from 'aws-amplify';
import { withRouter } from "react-router-dom";

class File extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            name: "", 
            uploadedBy:"",
            uploadedOn:"",
            lastUpdated: "",
            Size:"",
            fileUrl: "", 
            showModal: false };
    }

    componentDidMount() {
        const search = this.props.location.search;
        const name = new URLSearchParams(search).get("key");
        const lastUpdated = new URLSearchParams(search).get("lastUpdatedAt");

        Storage.get(name, { level: 'private', download: false }) // for listing ALL files without prefix, pass '' instead
            .then(fileUrl => {
                console.log(fileUrl)
                this.setState({ name, fileUrl, lastUpdated })
            })
            .catch(err => console.log(err));
    }

    showDeleteModal() {
        this.setState({ showModal: true })

    }

    handleDelete() {
        Storage.remove(this.state.name, { level: 'private' })
            .then(() => {
                alert('File was deleted')
                this.setState({ showModal: false })
            }).catch(err => {
                console.error(err)
            });

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
                                            File Name
                                        </Form.Label>
                                        <Col sm={10}>
                                            <Form.Label>{this.state.name}</Form.Label>
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
                                            Uploaded On
                                        </Form.Label>
                                        <Col sm="10">
                                            <Form.Label>{this.state.uploadedOn}</Form.Label>
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