import React, { Component } from "react";
import { Storage } from 'aws-amplify';
import { Row, Form, Container, Button, Col } from 'react-bootstrap';

Storage.configure({ level: 'private' });


class FileUpload extends Component {
    state = { fileUrl: '', file: '', fileName: '', dlBtnDisabled: true }



    handleChange = e => {
        const file = e.target.files[0]
        this.setState({
            fileUrl: URL.createObjectURL(file),
            file,
            fileName: file.name,
            dlBtnDisabled: false
        });
    }

    saveFile = () => {
        Storage.put(this.state.fileName, this.state.file)
            .then(() => {
                console.log("sccess")
                this.setState({ dlBtnDisabled: true })
            })
            .catch(err => {
                console.error('error uploading file', err)
            })
    }

    render() {
        return (
            <Container className="uploadContainer">
                <Form>
                    <Row md={2}>
                        <Col md={{ span: 8, offset: 2 }}>
                            <Form.Group controlId="formFile" className="mb-3">
                                <Form.Control type="file" onChange={this.handleChange}></Form.Control>

                            </Form.Group>
                        </Col>
                        <Col md={{ span: 2, offset: 0 }}>
                            <Button  variant="danger" className="btnUploadContainer" disabled={this.state.dlBtnDisabled}>Upload</Button>
                        </Col>
                    </Row>
                    <Row >
                    <Col md={{ span: 8, offset: 2 }}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>File Description</Form.Label>
                            <Form.Control as="textarea" rows={3} />
                        </Form.Group>
</Col>
                    </Row>
                </Form>
            </Container>
        )
    }
}

export default FileUpload