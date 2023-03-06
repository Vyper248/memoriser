import React from 'react';
import StyledLabelledInput from './LabelledInput.style';

type LabelledInputProps = {
    label: string;
    value: string;
    onChange: (e: React.FormEvent<HTMLInputElement>)=>void;
    name?: string;
    autofocus?:boolean;
    labelWidth?: string;
    inputID?:string;
}

const LabelledInput = ({label, value, onChange, name='', autofocus=false, labelWidth='auto', inputID=''}: LabelledInputProps) => {
    return (
        <StyledLabelledInput labelWidth={labelWidth}>
            <label>{label}</label>
            <input value={value} onChange={onChange} name={name} autoFocus={autofocus} id={inputID} aria-label={name}/>
        </StyledLabelledInput>
    );
}

export default LabelledInput;