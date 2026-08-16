import { createFormHook } from '@tanstack/react-form'
import { fieldContext, formContext } from './context'
import { TextField } from './TextField/TextField'
import { SelectField } from './SelectField/SelectField'
import { CheckboxField } from './CheckboxField/CheckboxField'
import { SubmitButton } from './SubmitButton/SubmitButton'

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    SelectField,
    CheckboxField,
  },
  formComponents: {
    SubmitButton,
  },
})