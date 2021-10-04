import React, { Component } from "react";
import { API } from 'aws-amplify';
import { Storage } from 'aws-amplify';
import { withRouter } from "react-router-dom";
import DataGrid from 'react-data-grid';


class FileRetrieve extends Component {
    state = {
        files: [], folders: {}
    }

    componentDidMount() {
        API.get("pouch-api", "/userdata")
        .then(data => console.log("data from backend",data))
        .catch(err=>{
            console.log("err", err)
        });
        
        
            Storage.list('', { level: 'private' }) // for listing ALL files without prefix, pass '' instead
        .then(result => { 
            this.processStorageList(result)
        })
        .catch(err => console.log(err));


    }

    processStorageList(result) {
        let files = []
        let folders = new Set()
        result.forEach(res => {
            if (res.size) {
                res.lastModified = res.lastModified.toUTCString()
                files.push(res)
                // sometimes files declare a folder with a / within then
                let possibleFolder = res.key.split('/').slice(0, -1).join('/')
                if (possibleFolder) folders.add(possibleFolder)
            } else {
                folders.add(res.key)
            }
        })
        this.setState({ files, folders })
    }
    handleClick = (row) => {
        console.log(row)
        this.props.history.push("file?key="+row.key+"&lastUpdatedAt="+row.lastModified+"&uploadedBy=");
    }

    render() {
        const columns = [
            { key: 'key', name: 'File Name' },
            { key: 'lastModified', name: 'Last Modified' },
            { key: '', name: 'Uploaded By' },
            { key: '', name: 'Uploadedd On' },
            { key: 'size', name: 'size' },
            { key: 'eTag', name: 'etag' },
        ];

        return this.state.files == [] ? (<div>no data here</div>) : (<div>
            <DataGrid className="table rdg-light" columns={columns} rows={this.state.files} onRowClick={this.handleClick} />;
        </div>

        )
    }
}

export default withRouter(FileRetrieve)