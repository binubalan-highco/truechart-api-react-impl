import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {number} from "prop-types";
import ITrueChart = TrueChartAPI.ITrueChart;
import TChartType = TrueChartAPI.TChartType;
import IDataSource = TrueChartAPI.IDataSource;
import {DataImportModule} from "./dataImportModule";
import {Button} from "semantic-ui-react";

type Props = {
    dimensionName: string,
    measureName: string,
    dimensions: string[],
    measure: number[],
    chartType: TChartType
}

type InstanceState = {
    elementId: string,
    dimensions: string[],
    measure: number[],
    charType:TChartType,
    isImportOn:boolean
};

export class TrueChartModule extends React.Component<Props, InstanceState>{

    private TC_API:ITrueChartCoreAPI = (window as any)['TrueChartCore_API'];
    private tc: ITrueChart;
    private data:IDataSource;
    constructor(props:Props){
        super(props);
        this.state = {
            elementId: Math.random()+'',
            dimensions:this.props.dimensions,
            measure:this.props.measure,
            charType:"structure",
            isImportOn:false
        };

        // Initialize true chart core
        this.TC_API.ConfigManager.setConfig({
            documentLocation: 'localhost',
            documentName: 'Training_Name',
            documentTitle: 'Training_Title',
            getServerId: sourceObject => sourceObject.element.id,
            user: {username: 'Me'}
        });
    }

    componentDidMount(): void {
        // element on ref
        // const element = ReactDOM.findDOMNode(this).parentElement;
        const element = document.getElementById(this.state.elementId+"");
        this.tc = this.TC_API.createTrueChart(element);

        //data onboard
        this.data = this.tc.DataManager.addDataSource("react-data-source");

        this.data.addDimension({
            name: this.props.dimensionName,
            type: 'text'
        }, this.props.dimensions);

        this.data.addMeasure({
            name: this.props.measureName,
            type: 'number'
        }, this.props.measure);


        //now show the chart
        this.tc.show();

        //layout change
        let layoutManager = this.tc.LayoutManager;

        //get layout promise
        const layout = layoutManager.Layout;
        layout.then(layoutDefinition => {
            //on init true chart instance
            //update chart type
            layoutManager.updateFirstCellType(this.props.chartType)
        })

        this.handleSelect = this.handleSelect.bind(this);
    }

    componentWillUpdate(nextProps: Readonly<Props>, nextState: Readonly<InstanceState>, nextContext: any): void {
        //layout change
        let layoutManager = this.tc.LayoutManager;

        //get layout promise
        const layout = layoutManager.Layout;
        layout.then(layoutDefinition => {
            //on init true chart instance
            //update chart type
            layoutManager.updateFirstCellType(this.state.charType)
        });

        let vId = this.data.listMeasures()[0].id;
        this.data.changeData({[vId]:nextState.measure});

    }

    handleSelect(event:React.FormEvent<HTMLSelectElement>){
        console.log(event.currentTarget.value);
        this.setState({
            charType:event.currentTarget.value as TChartType
        })
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} |
                React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <div>
                <div id={this.state.elementId} className='truechartcore'></div>
                <select onChange={e => this.handleSelect(e)}>
                    <option value="structure">Structure</option>
                    <option value="table">Table</option>
                    <option value="time">Time</option>
                    <option value="multiple">Multiple</option>
                    <option value="grid">Grid</option>
                </select>
                <button onClick={e=>{
                    const dimen2 = ["Biz 1", "Biz 2", "Biz 3", "Biz 4", "Biz 5"];
                    const measure2 = [1200, 8845, 2155, 6542, 9975];
                    this.setState({
                        dimensions:dimen2,
                        measure: measure2
                    })
                }}>Second set of data</button>
                {!this.state.isImportOn?<Button onClick={e=>{
                    this.setState({isImportOn:!this.state.isImportOn})
                }}>Add data</Button>:<DataImportModule onAccept={(data)=>{
                    //add to chart
                    this.data.addDataRow([data.currentDimension, data.currentMeasure]);
                    return {};
                }} onCancel={()=>{ this.setState({isImportOn:false}); return {}; }} />}


            </div>

        );
    }

}