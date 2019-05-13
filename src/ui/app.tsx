import * as React from "react";
import * as ReactDOM from 'react-dom';
import {TrueChartModule} from './TrueChartModule';
import TChartType = TrueChartAPI.TChartType;

type Props = {
    dimensionName: string,
    measureName: string
}


type AppState = {
    title:string,
    charType:TChartType
}

export class App extends React.Component<{}, AppState>{
    public static init(element: HTMLElement){
        ReactDOM.render(<App />, element);
    }

    constructor(props:{}){
        super(props);
        this.state = {
            title:"React app 1",
            charType:"structure"
        };

    }

    public render() {
        const dimen1 = ["Munich", "Kochi", "Mumbai", "Delhi", "Berlin"];
        const measure1 = [5500, 2600, 7000, 1200, 8000];
        return (
            <div className="app">
                <h4>Truechart module</h4>
                <TrueChartModule dimensionName="Dimension" measureName="Measure" dimensions={dimen1} measure={measure1} chartType={this.state.charType}/>
                <TrueChartModule dimensionName="Dimension" measureName="Measure" dimensions={dimen1} measure={measure1} chartType={this.state.charType}/>
            </div>
        );
    }
}