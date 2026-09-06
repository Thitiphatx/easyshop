export interface IModalBannerProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    getBannerList: () => void;
}
