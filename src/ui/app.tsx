import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Dimmer, Loader} from 'semantic-ui-react';
import TChartType = TrueChartAPI.TChartType;
import {FileImportModule} from './FileImportModule';
import {TrueChartModule} from './TrueChartModule';

/**
 * react component App state
 * @typedef {Object} AppState
 * @property {string} title
 * @property {TChartType} charType
 * @property {string[]} dimension
 * @property {number[]} measure
 * @property {boolean} hasImported
 * @property {boolean} progress
 */
interface IAppState {
    charType: TChartType;
    dimensions: string[];
    hasImported: boolean;
    measures: number[];
    progress: boolean;
    title: string;
}

/**
 * React component - App class
 * @extends React.Component
 */
export class App extends React.Component<{}, IAppState> {

    /**
     * static init method to render react to html element
     * @param element
     */
    public static init(element: HTMLElement) {
        ReactDOM.render(<App/>, element);
    }

    /**
     * constructor
     * @param props
     */
    constructor(props: {}) {
        super(props);
        this.state = {
            charType: 'structure',
            dimensions: [],
            hasImported: false,
            measures: [],
            progress: false,
            title: 'React app 1',
        };

    }

    /**
     * render method of App react component
     * @return
     */
    public render() {
        return (
            <div className="app">
                <h2>trueChart - Excel file import BI</h2>
                {
                    this.state.progress ?
                    <Dimmer active={true} inverted={true}>
                        <Loader inverted={true}>Loading</Loader>
                    </Dimmer>
                    : null
                }
                { !this.state.hasImported ?
                    <FileImportModule
                        onProgress={(state: boolean) =>{
                                this.setState({
                                    progress: state,
                                });
                                return {};
                            }
                        }
                        onData={(d: string[], m: number[])=>{
                                this.setState({
                                    dimensions: d,
                                    hasImported: true,
                                    measures: m,
                                });
                                return {};
                        }}
                    />
                    :
                    <TrueChartModule
                        dimensionName="Dimension"
                        measureName="Measure"
                        dimensions={this.state.dimensions}
                        measure={this.state.measures}
                        chartType={this.state.charType}
                    />
                }
            </div>
        );
    }
}
