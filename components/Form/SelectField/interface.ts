export interface ISelectOption {
  label: string
  value: string
}

export interface ISelectFieldProps {
  label: string
  options: ISelectOption[]
  required?: boolean
  placeholder?: string
}