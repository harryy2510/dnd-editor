import React from 'react'
import { useValidations } from '../../../utils'
import Validation, { ValidationProps } from './Validation'

const InputValidation: React.FC<ValidationProps> = (props) => {
    const { inputValidation } = useValidations()
    return <Validation {...props} validations={inputValidation}></Validation>
}

export default InputValidation
