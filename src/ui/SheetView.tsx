import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Class} from "@babel/types";
import * as XLSX from 'xlsx';
import {Sheet} from "xlsx";
import {
    Button,
    Card,
    CardContent,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownProps,
    Grid,
    Table
} from 'semantic-ui-react';


type SVProps = {
    sheet: Sheet,
    sheetName: string,
    onData: (d: string[], m: number[]) => any,
    onProgress: (status: boolean) => any

}


type SVState = {
    title:string,
    sheetObject:any,
    columns:string[],
    headerColumnRow:any,
    selectedDimensionKey:string,
    selectedMeasurekey:string
}

export class SheetView extends React.Component<SVProps, SVState>{

    private colStart:string;
    private colEnd:string;
    private rowCount:number;

    constructor(props:SVProps)
    {
        super(props);

        const sheetObjectTemp = XLSX.utils.sheet_to_json(this.props.sheet);
        if(sheetObjectTemp && sheetObjectTemp.length>0)
        {
            this.state= {
                title: this.props.sheetName,
                columns: [],
                sheetObject:sheetObjectTemp,
                headerColumnRow:Object.keys(sheetObjectTemp[0]),
                selectedDimensionKey:'',
                selectedMeasurekey:''
            }
        }
    }

    componentDidMount(): void {
        this.props.onProgress(false);
    }

    componentWillMount(): void {
        // console.log(this.props.sheet);
        //
        // console.log(this.state.headerColumnRow)

        //extract rows and columns definition

        const sRef = this.props.sheet["!ref"];
        const strs = sRef.split(':');
        this.colStart = strs[0][0];
        this.colEnd = strs[1][0];
        this.rowCount = Number(strs[1].substr(1));
    }

    renderHeader(columnName:string, index:number){
        return (
            <Table.HeaderCell key={index}>{columnName}</Table.HeaderCell>
        );
    }

    renderTrow(row:any, index:number){
        return(
            <Table.Row key={index}>
                {this.state.headerColumnRow.map((columnKey:any, ind:number)=>(
                    <Table.Cell key={ind}>{row[columnKey+""]}</Table.Cell>
                ))}
            </Table.Row>
        );
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const selectOptions = this.state.headerColumnRow.map((v:string,i:number)=>{
              return {key: i, text:v, value:v};
        });
        return (
            <div className="contain">
                <strong>{this.props.sheetName} - {this.state.selectedDimensionKey}</strong> <br />

                <Card fluid className="halfCard">
                    <CardContent>
                        <Grid columns={3}>
                            <Grid.Row>
                                <Grid.Column>
                                    <Dropdown
                                        placeholder='Select Dimension'
                                        fluid
                                        selection
                                        options={selectOptions}
                                        value={this.state.selectedDimensionKey}
                                        onChange={(e,value)=>{
                                            this.setState({
                                                selectedDimensionKey:value.value as string
                                            })
                                        }}
                                    />
                                </Grid.Column>
                                <Grid.Column>
                                    <Dropdown
                                        placeholder='Select Measure'
                                        fluid
                                        selection
                                        options={selectOptions}
                                        value={this.state.selectedMeasurekey}
                                        onChange={(e,value)=>{
                                            this.setState({
                                                selectedMeasurekey:value.value as string
                                            })
                                        }}
                                    />
                                </Grid.Column>
                                <Grid.Column>
                                    <Button content='Next' icon='right arrow' labelPosition='right'
                                        onClick={e=>{
                                            //accumulate those selected columns
                                            const dimensionData = this.state.sheetObject.map((row:any, index:number)=>{
                                                return row[""+this.state.selectedDimensionKey];
                                            });

                                            const measureData = this.state.sheetObject.map((row:any, index:number)=>{
                                                const mes = row[""+this.state.selectedMeasurekey];
                                                return (!isNaN(mes)?mes:0);
                                            });

                                            this.props.onData(dimensionData,measureData);
                                        }}
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </CardContent>
                </Card>
                <Table celled striped>
                    <Table.Header>
                        <Table.Row>
                            {this.state.headerColumnRow.map((colKey:any, index:number)=>{
                                // console.log(colKey);
                                return this.renderHeader(colKey,index);
                            })}
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                    {this.state.sheetObject.map((row:any, index:number)=>{
                        return this.renderTrow(row,index);
                    })
                    }
                    </Table.Body>
                </Table>

            </div>
        );
    }
}