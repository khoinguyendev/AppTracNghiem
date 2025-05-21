import { Key } from "react";

export type IQuestion={
    id:Key,
    content:string;
    image:string|null;
    answer:IAnswer[]
}

export type IAnswer={
    id:Key,
    content:string;
    is_correct:boolean
}