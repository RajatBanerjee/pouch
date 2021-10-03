import React, { Component } from "react";
import { Storage } from 'aws-amplify';
import { withRouter } from "react-router-dom";
import DataGrid from 'react-data-grid';


class FileRetrieve extends Component {
    state = {
        files: [{
            key: "Dracula.itermcolors.txt",
            eTag: "\"6ba556563f8b8b89cc54a4e7df8ed34d\"",
            lastModified: "2021-10-03T02:47:28.000Z",
            size: 5183
        }, {
            key: "UCP_Colleges_Welcome.xlsx",
            eTag: "\"9e4b7c482fb17dda1c331044c42631b1\"",
            lastModified: "2021-10-03T02:47:38.000Z",
            size: 108813
        },
        {
            key: "Dracula.itermcolors.txt",
            eTag: "\"6ba556563f8b8b89cc54a4e7df8ed34d\"",
            lastModified: "2021-10-03T02:47:28.000Z",
            size: 5183
        }], folders: {}
    }

    componentDidMount() {
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