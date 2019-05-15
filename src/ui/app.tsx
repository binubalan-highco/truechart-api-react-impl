import * as React from "react";
import * as ReactDOM from 'react-dom';
import {TrueChartModule} from './TrueChartModule';
import TChartType = TrueChartAPI.TChartType;
import {FileImportModule} from "./FileImportModule";
import {Dimmer, Loader} from "semantic-ui-react";

type Props = {
    dimensionName: string,
    measureName: string
}


type AppState = {
    title:string,
    charType:TChartType,
    dimensions:string[],
    measures:number[],
    hasImported:boolean,
    progress:boolean
}

export class App extends React.Component<{}, AppState>{
    public static init(element: HTMLElement){
        ReactDOM.render(<App />, element);
    }

    constructor(props:{}){
        super(props);
        this.state = {
            title:"React app 1",
            charType:"structure",
            dimensions:[],
            measures:[],
            hasImported:false,
            progress:false
        };

    }

    public render() {
        const dimen1 = ["Munich", "Kochi", "Mumbai", "Delhi", "Berlin"];
        const measure1 = [5500, 2600, 7000, 1200, 8000];
        return (
            <div className="app">
                <h2>trueChart - Excel file import BI</h2>
                    {this.state.progress?
                        <Dimmer active inverted>
                            <Loader inverted>Loading</Loader>
                        </Dimmer>
                        :null
                    }
                    {!this.state.hasImported?
                        <FileImportModule onProgress={(status)=>{
                            this.setState({
                                progress:status
                            })
                        }} onData={(d:string[], m:number[])=>{
                            this.setState({
                                dimensions:d,
                                measures:m,
                                hasImported:true
                            })
                            return{};
                        }
                        }/>
                        :
                        <TrueChartModule dimensionName="Dimension" measureName="Measure" dimensions={this.state.dimensions} measure={this.state.measures} chartType={this.state.charType}/>
                    }


                {/*<TrueChartModule dimensionName="Dimension" measureName="Measure" dimensions={dimen1} measure={measure1} chartType={this.state.charType}/>*/}
            </div>
        );
    }
}