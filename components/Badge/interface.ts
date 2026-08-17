import { ColorVariant } from "@/app/interface";
import { HTMLAttributes } from "react";

export interface IBadgeProps extends HTMLAttributes<HTMLDivElement> {
    color?: ColorVariant
}