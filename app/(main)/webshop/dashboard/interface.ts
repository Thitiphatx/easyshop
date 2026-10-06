import { ISummaryData } from '@/app/actions/interface';
import { SummaryType } from '@/app/utils/interface'

export interface IModalBannerProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    getBannerList: () => void;
}

export interface IDashboardSectionProps {
    type?: SummaryType
}

export interface IStatCardProps {
    label: string
    data?: ISummaryData
    isLoading: boolean
    accentColor: string
}