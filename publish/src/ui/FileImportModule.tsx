import * as React from 'react';
import * as XLSX from 'xlsx';
import {SheetView} from './SheetView';

/**
 * react component - FileImportModule properties
 * @property {(data:DIState)=>{}} onData - callback for data
 * @property {()=>{}} onProgress - call back for progress events
 */
interface IProps {
    onData: (d: string[], m: number[]) => any;
    onProgress: (status: boolean) => any;
}

/**
 * react component - FileImportModule states
 * @property {boolean} hasFileLoaded
 * @property {XLSX.Sheet} currentSheet
 * @property {string} currentSheetName
 */
interface IState {
    hasFileLoaded: boolean;
    currentSheet: XLSX.Sheet;
    currentSheetName: string;
}

/**
 * @class FileImportModule
 * @extends React.Component
 *
 */
export class FileImportModule extends React.Component<IProps, IState> {
    private fileLoader: FileReader;

    constructor(props: IProps) {
        super(props);
        this.state = {
            currentSheet: null,
            currentSheetName: '',
            hasFileLoaded: false,
        };
    }

    /**
     * handle file from input
     * @param files
     */
    public handleFile(files: FileList) {
        this.props.onProgress(true);
        // get one file now
        if (files && files.length > 0) {
            const xlFile = files[0];

            // read file
            this.fileLoader = new FileReader();
            this.fileLoader.onload = (e: ProgressEvent) => {
                const data = new Uint8Array(this.fileLoader.result as ArrayBuffer);
                const workbook = XLSX.read(data, {type: 'array'});

                // parse sheet and show
                if (workbook && workbook.Workbook && workbook.Workbook.Sheets.length > 0) {
                    // get that first sheet
                    const sheet = workbook.Sheets[workbook.SheetNames[0]];
                    console.log(sheet);
                    this.props.onProgress(true);
                    this.setState({
                        currentSheet: sheet,
                        hasFileLoaded: true,
                        currentSheetName: workbook.SheetNames[0],
                    });
                }
            };
            this.fileLoader.readAsArrayBuffer(xlFile);
        }
    }

    /**
     * react component FileImportModule's render method
     * @return {any}
     */
    public render() {
        return (
            <div>
                {!this.state.hasFileLoaded ?
                    <div className="file-import-container">
                        <input
                            type="file"
                            onChange={(e) => {
                                this.handleFile(e.target.files);
                            }}
                            onDrop={(e) => {return;}}
                        />
                        <div>Drop your file here</div>
                    </div> :
                    <SheetView
                        onProgress={(status: boolean) => {
                            this.props.onProgress(status);
                        }}
                        sheet={this.state.currentSheet}
                        sheetName={this.state.currentSheetName}
                        onData={(d: string[], m: number[]) => {
                                this.props.onData(d, m);
                                return {};
                            }
                        }
                    />
                }
            </div>
        );
    }
}
