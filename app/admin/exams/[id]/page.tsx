'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import ItemQuestion from '@/components/admin/ItemQuestion'
import { IQuestion } from '@/types/Questions'
import ModalAddQuestion from '@/components/admin/modal/ModalAddQuestion'

export default function ExamDetailPage() {
    const { id } = useParams()
    const [questions, setQuestions] = useState<IQuestion[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)

    // 🔧 Đưa fetchExam ra ngoài
    const fetchExam = async () => {
        setLoading(true)

        const { data, error } = await supabase
            .from('question')
            .select('id, content, image, answer(id, content, is_correct)')
            .eq('exam_id', id)

        if (!error && data) {
            setQuestions(data as IQuestion[])
        } else {
            console.error('Lỗi:', error?.message)
        }

        setLoading(false)
    }

    useEffect(() => {
        if (id) fetchExam()
    }, [id])

    const handleEdit = (q: IQuestion) => {
        const newQuestions = questions.map(item =>
            item.id === q.id ? q : item
        );
        setQuestions(newQuestions);

    }

    const handleDelete = async (id: string) => {
        const { error } = await supabase.from('question').delete().eq('id', id)
        if (!error) {
            setQuestions((prev) => prev.filter((q) => q.id !== id))
        } else {
            console.error('Lỗi xóa:', error.message)
        }
    }

    if (loading) return <div className="p-4">Đang tải...</div>

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Chi tiết đề thi (ID: {id})</h1>

            <button
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => setShowModal(true)}
            >
                + Thêm câu hỏi
            </button>

            {showModal && (
                <ModalAddQuestion
                    examId={id as string}
                    onClose={() => setShowModal(false)}
                    onQuestionAdded={fetchExam}
                />
            )}

            {questions.length === 0 ? (
                <p>Không có câu hỏi nào.</p>
            ) : (
                <div className="space-y-6">
                    {questions.map((q, index) => (
                        <ItemQuestion
                            key={q.id}
                            question={q}
                            index={index}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
