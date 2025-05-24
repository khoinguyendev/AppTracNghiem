"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

const ReviewQuestionList = () => {
  const [questions, setQuestions] = useState<any[]>([])
  const [answers, setAnswers] = useState<{ [questionId: number]: number | null }>({})
  const [showAnswers, setShowAnswers] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    const { data, error } = await supabase
      .from("review_questions")
      .select("*,question(*,answer(*))")

    if (error) {
      console.error("Lỗi lấy câu hỏi:", error.message)
    } else {
      setQuestions(data || [])
      setAnswers({})
      setShowAnswers(false)
      setCorrectCount(0)
    }
  }

  const handleSelectAnswer = (questionId: number, answerId: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerId }))
  }

  const handleSubmit = () => {
    const correct = questions.reduce((count, q) => {
      const selected = answers[q.question.id]
      const correctAnswer = q.question.answer.find((a: any) => a.is_correct)?.id
      return selected === correctAnswer ? count + 1 : count
    }, 0)

    setCorrectCount(correct)
    setShowAnswers(true)
    setOpenModal(true)
  }

  const handleReset = () => {
    setAnswers({})
    setShowAnswers(false)
    setCorrectCount(0)
    setOpenModal(false)
  }

  const handleDeleteQuestion = async (questionId: number, reviewId: number) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa câu hỏi này?")
    if (!confirmDelete) return

    const { error } = await supabase
      .from("review_questions")
      .delete()
      .eq("id", reviewId)

    if (error) {
      console.error("Lỗi khi xóa câu hỏi:", error.message)
      return
    }

    setQuestions((prev) => prev.filter((q) => q.id !== reviewId))
    const updatedAnswers = { ...answers }
    delete updatedAnswers[questionId]
    setAnswers(updatedAnswers)
  }

  const answeredCount = Object.keys(answers).length

  return (
    <div className="flex justify-center px-4 py-6">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-right text-sm text-gray-600 font-medium">
          Đã trả lời: {answeredCount} / {questions.length}
        </div>

        {questions.map((q, index) => (
          <div key={q.id} className="border p-4 rounded-lg shadow-sm relative">
            {/* Nút xóa */}
            <button
              className="absolute top-2 right-2 text-sm text-red-500 hover:text-red-700"
              onClick={() => handleDeleteQuestion(q.question.id, q.id)}
            >
              Xóa
            </button>

            <div className="font-semibold mb-2">
              Câu {index + 1}: {q.question.content}
            </div>
            {q.question.image && (
              <img
                src={q.question.image}
                alt={`Question ${index + 1}`}
                className="mb-4 w-full max-w-xs mx-auto"
              />
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {q.question.answer.map((a: any) => {
                const selected = answers[q.question.id] === a.id
                const isCorrect = a.is_correct

                return (
                  <Button
                    key={a.id}
                    variant="outline"
                    onClick={() => handleSelectAnswer(q.question.id, a.id)}
                    className={cn(
                      "text-sm",
                      selected && "ring-2 ring-blue-500",
                      showAnswers &&
                        (isCorrect
                          ? "bg-green-100 text-green-800"
                          : selected
                          ? "bg-red-100 text-red-800"
                          : "")
                    )}
                  >
                    {a.content}
                  </Button>
                )
              })}
            </div>
          </div>
        ))}

        <div className="flex flex-wrap gap-2 justify-end">
          <Button onClick={() => setShowAnswers(true)} variant="secondary">
            Xem đáp án
          </Button>
          <Button onClick={handleReset} variant="outline">
            Làm lại
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Nộp bài
          </Button>
        </div>

        {/* MODAL KẾT QUẢ */}
        <Dialog open={openModal} onOpenChange={setOpenModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Kết quả bài làm</DialogTitle>
            </DialogHeader>
            <div className="text-center text-lg font-medium">
              Bạn trả lời đúng{" "}
              <span className="text-green-600">{correctCount}</span> /{" "}
              {questions.length} câu hỏi.
            </div>
            <DialogFooter>
              <Button onClick={() => setOpenModal(false)}>Đóng</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default ReviewQuestionList
