import { SummaryType } from '@/app/utils/interface'

export interface IModalBannerProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    getBannerList: () => void;
}

export interface IDashboardSectionProps {
    type?: SummaryType
}
