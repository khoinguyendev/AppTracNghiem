export type IQuestion={
    id:number,
    content:string;
    image:string|null;
    answer:IAnswer[]
}

export type IAnswer={
    id:number,
    content:string;
    is_correct:boolean
}

export type IUserAnswer = {
    questionId: number;
    value: string | null;
    correct: boolean | null;
  };