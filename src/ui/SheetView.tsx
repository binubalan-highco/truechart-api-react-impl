import * as React from 'react';
import * as XLSX from 'xlsx';
import {Sheet} from 'xlsx';
import {
    Button,
    Card,
    CardContent,
    Dropdown,
    Grid,
    Table
} from 'semantic-ui-react';

/**
 * react component - SheetView properties
 * @property {Sheet} sheet
 * @property {string} sheetName
 * @property {(d: string[], m: number[]) => any} onData
 * @property {(status: boolean) => any} onProgress
 */
type SVProps = {
    sheet: Sheet,
    sheetName: string,
    onData: (d: string[], m: number[]) => any,
    onProgress: (status: boolean) => any

};

/**
 * react component - SheetView states
 * @property {string} title
 * @property {any} sheetObject
 * @property {string[]} columns
 * @property {any} headerColumnRow
 * @property {string} selectedDimensionKey
 * @property {string} selectedMeasurekey
 */
type SVState = {
    title: string,
    sheetObject: any,
    columns: string[],
    headerColumnRow: any,
    selectedDimensionKey: string,
    selectedMeasurekey: string
};

/**
 * @class SheetView
 * @extends React.Component
 *
 */
export class SheetView extends React.Component<SVProps, SVState> {

    constructor(props: SVProps) {
        super(props);

        const sheetObjectTemp = XLSX.utils.sheet_to_json(this.props.sheet);
        if (sheetObjectTemp && sheetObjectTemp.length > 0) {
            this.state = {
                title: this.props.sheetName,
                columns: [],
                sheetObject: sheetObjectTemp,
                headerColumnRow: Object.keys(sheetObjectTemp[0]),
                selectedDimensionKey: '',
                selectedMeasurekey: ''
            };
        }
    }

    /**
     * react lifecycle method componentDidMount
     */
    componentDidMount(): void {
        this.props.onProgress(false);
    }

    /**
     * method to render table header
     * @param columnName
     * @param index
     * @return {any}
     */
    renderHeader(columnName: string, index: number) {
        return (
            <Table.HeaderCell key={index}>{columnName}</Table.HeaderCell>
        );
    }

    /**
     * render each data row in the table
     * @param row - contains single row object from sheet
     * @param index - index of row in it's array
     * @return {any} - return react component
     */
    renderTrow(row: any, index: number) {
        return (
            <Table.Row key={index}>
                {this.state.headerColumnRow.map((columnKey: any, ind: number) => (
                    <Table.Cell key={ind}>{row[columnKey + '']}</Table.Cell>
                ))}
            </Table.Row>
        );
    }

    /**
     * render method of react component
     * @return {any}
     */
    render() {
        const selectOptions = this.state.headerColumnRow.map((v: string, i: number) => {
            return {key: i, text: v, value: v};
        });
        return (
            <div className="contain">
                <strong>{this.props.sheetName} - {this.state.selectedDimensionKey}</strong> <br/>

                <Card fluid className="halfCard">
                    <CardContent>
                        <Grid columns={3}>
                            <Grid.Row>
                                <Grid.Column>
                                    <Dropdown
                                        placeholder="Select Dimension"
                                        fluid
                                        selection
                                        options={selectOptions}
                                        value={this.state.selectedDimensionKey}
                                        onChange={(e, value) => {
                                            this.setState({
                                                selectedDimensionKey: value.value as string
                                            });
                                        }}
                                    />
                                </Grid.Column>
                                <Grid.Column>
                                    <Dropdown
                                        placeholder="Select Measure"
                                        fluid
                                        selection
                                        options={selectOptions}
                                        value={this.state.selectedMeasurekey}
                                        onChange={(e, value) => {
                                            this.setState({
                                                selectedMeasurekey: value.value as string
                                            });
                                        }}
                                    />
                                </Grid.Column>
                                <Grid.Column>
                                    <Button
                                        content="Next"
                                        icon="right arrow"
                                        labelPosition="right"
                                        onClick={(e) => {
                                                //accumulate those selected columns
                                                const dimensionData = this.state.sheetObject.map((row: any) => {
                                                    return row['' + this.state.selectedDimensionKey];
                                                });

                                                const measureData = this.state.sheetObject.map((row: any) => {
                                                    const mes = row['' + this.state.selectedMeasurekey];
                                                    return (!isNaN(mes) ? mes : 0);
                                                });

                                                this.props.onData(dimensionData, measureData);
                                            }
                                        }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </CardContent>
                </Card>
                <Table celled striped>
                    <Table.Header>
                        <Table.Row>
                            {this.state.headerColumnRow.map((colKey: any, index: number) => {
                                // console.log(colKey);
                                return this.renderHeader(colKey, index);
                            })}
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {this.state.sheetObject.map((row: any, index: number) => {
                            return this.renderTrow(row, index);
                        })
                        }
                    </Table.Body>
                </Table>

            </div>
        );
    }
}
