import { ITopDonate } from "../../actions/topup/interface";

export interface IRankingCardProps {
    topDonateInfo: ITopDonate
    direction?: 'left' | 'right'
}