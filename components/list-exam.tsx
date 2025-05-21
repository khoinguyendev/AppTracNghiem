import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { supabase } from "../lib/supabaseClient"; // Đảm bảo bạn đã tạo file này
import { cn } from "@/lib/utils"; // Hàm tiện ích nếu bạn dùng tailwind + classnames
import { IExam } from "@/types/Exam";

export default function ListExam({handleSelectQuizSet}:{handleSelectQuizSet:any}) {
    const [quizSets, setQuizSets] = useState<IExam[]>([]);
    const [selectedQuizSet, setSelectedQuizSet] = useState<IExam>();
    const [isLoaing, setIsloading] = useState(true);
    useEffect(() => {
        const fetchExams = async () => {
            setIsloading(true);
            const { data, error } = await supabase.from("exam").select("*");

            if (error) {
                console.error("Lỗi khi tải exam:", error.message);
            } else {
                setQuizSets(data);
            }
            setIsloading(false);
        };

        fetchExams();
    }, []);

    const handleSelect = (quizSet: IExam) => {
        setSelectedQuizSet(quizSet);
        handleSelectQuizSet(quizSet);
    };
    if (isLoaing) return null;
    return (
        <>
            {quizSets.map((quizSet) => (
                <Button
                    key={quizSet.id}
                    variant={selectedQuizSet?.id === quizSet.id ? "default" : "ghost"}
                    className={cn(
                        "w-full justify-start text-left mb-1 font-normal",
                        selectedQuizSet?.id === quizSet.id ? "bg-blue-600 text-white" : ""
                    )}
                    onClick={() => handleSelect(quizSet)}
                >
                    {quizSet.title}
                </Button>
            ))}
        </>
    );
}
