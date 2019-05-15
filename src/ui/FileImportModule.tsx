import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {file} from "@babel/types";

import * as XLSX from 'xlsx';
import {Sheet} from "xlsx";
import {SheetView} from "./SheetView";

type IProps = {
    onData: (d: string[], m: number[]) => any,
    onProgress: (status: boolean) => any
}
;

type IState = {
    hasFileLoaded:boolean,
    currentSheet:Sheet,
    currentSheetName: string
};

export class FileImportModule extends React.Component<IProps, IState>{
    private fileLoader: FileReader;
    constructor(props: IProps)
    {
        super(props);
        this.state = {
            hasFileLoaded:false,
            currentSheet:null,
            currentSheetName:''
        }
    }

    private handleFileRead(e:FileReaderEventMap)
    {
        const content = this.fileLoader.result;
    }

    handleFile(files:FileList)
    {
        this.props.onProgress(true);
        //get one file now
        if(files && files.length>0)
        {
            const xlFile = files[0];

            //read file
            this.fileLoader = new FileReader();
            this.fileLoader.onload = (e:ProgressEvent)=>{
                const data = new Uint8Array(this.fileLoader.result as ArrayBuffer);
                const workbook = XLSX.read(data, {type:'array'});

                // parse sheet and show
                if(workbook && workbook.Workbook && workbook.Workbook.Sheets.length>0)
                {
                    //get that first sheet
                    const sheet = workbook.Sheets[workbook.SheetNames[0]];
                    console.log(sheet);
                    this.props.onProgress(true);
                    this.setState({
                        currentSheet:sheet,
                        hasFileLoaded:true,
                        currentSheetName: workbook.SheetNames[0]
                    })
                }
            };
            this.fileLoader.readAsArrayBuffer(xlFile);
        }
    }
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <div>
                {!this.state.hasFileLoaded?
                    <div className="file-import-container">
                    <input type='file' onChange={e =>{
                        this.handleFile(e.target.files);
                    }} onDrop={e => {}} />
                    <div>Drop your file here</div>
                </div>:
                    <SheetView  onProgress={(status:boolean)=>{
                        this.props.onProgress(status);
                    }} sheet={this.state.currentSheet} sheetName={this.state.currentSheetName} onData={(d:string[], m:number[])=>{
                        this.props.onData(d,m); return{};
                    }
                    }/>
                }
            </div>
        );
    }
}