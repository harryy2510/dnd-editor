import React from 'react'
import { useValidations } from '../../../utils'
import Validation, { ValidationProps } from './Validation'

const InputValidation: React.FC<ValidationProps> = (props) => {
    const { validations } = useValidations()
    return <Validation {...props} validations={validations}></Validation>
}

export default InputValidation
