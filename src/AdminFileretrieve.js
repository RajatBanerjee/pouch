import React, { Component } from "react";
import { API, Auth } from 'aws-amplify';
import { Storage } from 'aws-amplify';
import { withRouter } from "react-router-dom";
import DataGrid from 'react-data-grid';


class FileRetrieve extends Component {
    state = {
        files: [], folders: {}, user: {}, isAdmin:false
    }

    async componentDidMount() {
        let user = await Auth.currentAuthenticatedUser();
        let groups = user.signInUserSession.accessToken.payload["cognito:groups"]
        if (groups.length >0) {
            if (groups[0] == "admin") {
                var isAdmin = true
            }
        }
        

        this.setState({ user, isAdmin }, () => {
            this.getFiles()
        })
    }

    async getFiles() {


        const myInit = {
            headers: {
                Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
            },
        };
        var query = "?id=" + this.state.user.attributes.sub
        if (this.state.isAdmin) {
            query = ""
        }

        try {
            var dbData = await API.get("pouch-api", "/userdata" + query, myInit)
            console.log("db data ==>", dbData)
        } catch (err) {
            console.error(err)
        }

        var result = []
        /**** get s3 files */
        if (this.state.isAdmin) {
            try {
                result = await API.get("pouch-api", "/admin", myInit)
               result =  this.toCamel(result.Contents)
               console.log("result ==>", result)
            } catch (err) {
                console.error(err)
            }
        }
        else {

            try {
                result = await Storage.list('', { level: 'private' }) // for listing ALL files without prefix, pass '' instead
                console.log("result ==>", result)
            } catch (err) {
                console.error(err)
            }
        }

        result.map(r => {
            let f = dbData.find((d) => { return  r.key.indexOf(d.fileName) >0 })
            r.id = f.id
            r.fileName = f.fileName
            r.uploadedOn = f.insTs
            r.uploadedBy = f.userName

            return r
        })
        this.processStorageList(result)
    }


    toCamel = (o) => {
        var that = this
        var newO, origKey, newKey, value
        if (o instanceof Array) {
          return o.map(function(value) {
              if (typeof value === "object") {
                value = that.toCamel(value)
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
                value = that.toCamel(value)
              }
              newO[newKey] = value
            }
          }
        }
        return newO
      }

    processStorageList(result) {
        let files = []
        let folders = new Set()
        result.forEach(res => {
            if (res.size) {
                res.lastModified = typeof(res.lastModified) =='function?' ? res.lastModified.toUTCString(): res.lastModified
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
        this.props.history.push("file?id=" + row.id);
    }

    render() {
        const columns = [
            { key: 'id', name: 'Id' },
            { key: 'fileName', name: 'File Name' },
            { key: 'lastModified', name: 'Last Modified' },
            { key: 'uploadedBy', name: 'Uploaded By' },
            { key: 'uploadedOn', name: 'Uploadedd On' },
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