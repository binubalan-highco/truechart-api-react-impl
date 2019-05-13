import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {FormEventHandler} from "react";

type DIProps = {
    onAccept:(data:DIState)=>{},
    onCancel:()=>{}
};


type DIState = {
    currentDimension: string,
    currentMeasure: number
}

export class DataImportModule extends React.Component<DIProps, DIState>{
    constructor(props: DIProps){
        super(props);

        this.state = {
            currentDimension:'',
            currentMeasure: 0
        };
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (<div className='DIBase'>
            <input placeholder='Dimension' type='text' onChange={e=>{
                this.setState({currentDimension:e.currentTarget.value})
            }}/><br />
            <input placeholder='measure' type='number' onChange={e=>{
                this.setState({
                    currentMeasure: Number(e.currentTarget.value)
                })
            }} />
            <br />
            <button onClick={e=> this.props.onCancel()}>Cancel</button>
            <button onClick={e=> this.props.onAccept({currentDimension:this.state.currentDimension,
                currentMeasure:this.state.currentMeasure})}>Accept</button>
        </div>);
    }
}