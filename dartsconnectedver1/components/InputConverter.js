import React from 'react';
import inputs from './InputMap';
   
export default convertInput = (input) => {
    value = {
        Number: '',
        Type: '',
    }
    types = ['Single','Double','Triple']
    for(i=0;i<inputs.length;i++){
        if(inputs[i].includes(input)){
            if(i >= 20){
                value.number = 'Bull';
                value.Type = types[i-20];
            }
            value.Number = i + 1;
            value.Type = Types[this.inputs[i].indexOf(input)];
        }
    }
    alert("stage 1: " + value.number)
    return value;
}


