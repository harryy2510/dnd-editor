import React from 'react'
import { useValidations } from '../../../utils'
import Validation, { ValidationProps } from './Validation'

const MultilineValidation: React.FC<ValidationProps> = (props) => {
    console.log(props)
    const { commonValidation } = useValidations()
    console.log(props)
    return <Validation {...props} validations={commonValidation}></Validation>
}

export default MultilineValidation
