import { ISetupServer, ISetupTopup, ISetupWebshop } from '@/app/actions/setup/interface'

export interface IKeyGateStepProps {
    onVerified: (key: string) => void
}

export interface IWebshopStepProps {
    data: ISetupWebshop
    onNext: (values: ISetupWebshop) => void
}

export interface IServerStepProps {
    data: ISetupServer
    onBack: () => void
    onNext: (values: ISetupServer) => void
}

export interface ITopupStepProps {
    data: ISetupTopup
    onBack: () => void
    onNext: (values: ISetupTopup) => void
}

export interface IAdminStepProps {
    onBack: () => void
    onFinish: (adminUsername: string) => Promise<void>
    isSubmitting: boolean
}

export interface IStepperProps {
    currentStep: number
}