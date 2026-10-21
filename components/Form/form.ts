import { createFormHook, AppFieldExtendedReactFormApi } from '@tanstack/react-form'
import { fieldContext, formContext } from './context'
import { TextField } from './TextField/TextField'
import { TextareaField } from './TextareaField/TextareaField'
import { SelectField } from './SelectField/SelectField'
import { SubmitButton } from './SubmitButton/SubmitButton'
import { ResetButton } from './ResetButton/ResetButton'
import { FileField } from './FileField/FileField'
import { ImageSelectField } from './ImageSelectField/ImageSelectField'
import { DatePickerField } from './DatePickerField/DatePickerField'
import { CheckBoxField } from './CheckBoxField/CheckBoxField'

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    TextareaField,
    FileField,
    SelectField,
    CheckBoxField,
    ImageSelectField,
    DatePickerField,
  },
  formComponents: {
    SubmitButton,
    ResetButton
  },
})

export type AppFormApi<TFormData = any> = AppFieldExtendedReactFormApi<
  TFormData,
  any, any, any, any, any, any, any, any, any, any, any, any, any
>
