import * as React from 'react';

/**
 * react component - DataImportModule properties
 * @property {(data:DIState)=>{]} onAccept
 * @property {()=>{}} onCancel
 */
type DIProps = {
    onAccept: (data: DIState) => {},
    onCancel: () => {}
};

/**
 * react component - DataImportModule states
 * @property {string} currentDimension
 * @property {number} currentMeasure
 */
type DIState = {
    currentDimension: string,
    currentMeasure: number
};

/**
 * @class DataImportModule
 * @extends React.Component
 *
 */
export class DataImportModule extends React.Component<DIProps, DIState> {
    constructor(props: DIProps) {
        super(props);

        this.state = {
            currentDimension: '',
            currentMeasure: 0
        };
    }

    /**
     * react component DataImportModule's render method
     * @return {any}
     */
    render() {
        return (
            <div className="DIBase">
            <input
                placeholder="Dimension"
                type="text"
                onChange={(e) => {
                    this.setState({currentDimension: e.currentTarget.value});
                }}
            /><br/>
            <input
                placeholder="measure"
                type="number"
                onChange={(e) => {
                    this.setState({
                        currentMeasure: Number(e.currentTarget.value)
                    });
                }}
            />
            <br/>
            <button onClick={(e) => this.props.onCancel()}>Cancel</button>
            <button
                onClick={(e) => this.props.onAccept({
                        currentDimension: this.state.currentDimension,
                        currentMeasure: this.state.currentMeasure
                    })
                }
            >Accept
            </button>
        </div>
        );
    }
}
