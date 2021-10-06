import React, { Component } from "react";

import { API, Auth, Storage } from 'aws-amplify';
import { Row, Form, Container, Button, Col } from 'react-bootstrap';

Storage.configure({ level: 'private' });


class FileUpload extends Component {
    constructor() {
        super();
        this.state = { fileUrl: '', file: '', fileName: '', fileDesc: '', user: {}, dlBtnDisabled: true }
      }

   async componentDidMount () {
        let user = await Auth.currentAuthenticatedUser();
        this.setState({ user: user })
    }

    handleChange = (e) => {
        const file = e.target.files[0]
        this.setState({
            fileUrl: URL.createObjectURL(file),
            file,
            fileName: file.name,
            dlBtnDisabled: false
        });
    }

    async insertIntoDb() {
        
        let timeStr = new Date().toUTCString()

        let fileData = {
            userId: this.state.user.attributes.sub,
            userName :this.state.user.attributes.email,
            fileName: this.state.fileName,
            insTs:timeStr ,
            updTs: timeStr,
            fileDesc: this.state.fileDesc
        }

        const myInit = {
            headers: {
                Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
            },
            body:fileData
        };

        API.post("pouch-api", "/userdata", myInit)
            .then(data =>  {
                console.log("data from backend", data)
                window.location.reload();
            })
            .catch(err => {
                console.log("err", err)
            });

    }

    handleTextAreaChange (event) {
        this.setState({ fileDesc: event.target.value});
    }

    async saveFile()  {
        let result = await Storage.put(this.state.fileName, this.state.file);
        console.log("Sorage ->>", result)

        result = await this.insertIntoDb()
        console.log("db insert ->>", result)
        this.setState({ dlBtnDisabled: true })
        
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
                            <Button variant="danger" className="btnUploadContainer" disabled={this.state.dlBtnDisabled} onClick={this.saveFile.bind(this)}>Upload</Button>
                        </Col>
                    </Row>
                    <Row >
                        <Col md={{ span: 8, offset: 2 }}>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label>File Description</Form.Label>
                                <Form.Control as="textarea" rows={3} onChange={this.handleTextAreaChange.bind(this)}/>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Container>
        )
    }
}

export default FileUpload