import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { IQuestion } from '@/types/Questions'

type Props = {
  question: IQuestion
  index: number
  onEdit: (q: IQuestion) => void
  onDelete: (id: any) => void
}

export default function ItemQuestion({ question, index, onEdit, onDelete }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // States sửa câu hỏi
  const [editedContent, setEditedContent] = useState(question.content)
  const [editedImage, setEditedImage] = useState(question.image || '')

  // States cho từng đáp án, lưu nội dung, trạng thái đúng/sai, trạng thái loading, thông báo
  const [answers, setAnswers] = useState(
    question.answer.map((ans) => ({
      id: ans.id,
      content: ans.content,
      is_correct: ans.is_correct,
      isSaving: false,
      message: '',
    }))
  )

  const [isSavingQuestion, setIsSavingQuestion] = useState(false)
  const [questionMessage, setQuestionMessage] = useState('')

  const openModal = () => {
    setEditedContent(question.content)
    setEditedImage(question.image || '')
    setQuestionMessage('')
    setIsSavingQuestion(false)

    setAnswers(
      question.answer.map((ans) => ({
        id: ans.id,
        content: ans.content,
        is_correct: ans.is_correct,
        isSaving: false,
        message: '',
      }))
    )

    setIsModalOpen(true)
  }

  const handleEditClick = () => {
    onEdit(question)
    openModal()
  }

  const handleDelete = () => {
    onDelete(question.id)
  }

  const hasQuestionChanges = () =>
    editedContent.trim() !== question.content.trim() ||
    (editedImage.trim() || '') !== (question.image || '')

  const handleSaveQuestion = async () => {
    if (!hasQuestionChanges()) return
    if (!editedContent.trim()) {
      setQuestionMessage('Nội dung câu hỏi không được để trống')
      return
    }

    setIsSavingQuestion(true)
    setQuestionMessage('')

    const { error } = await supabase
      .from('question')
      .update({
        content: editedContent.trim(),
        image: editedImage.trim() || null,
      })
      .eq('id', question.id)

    if (error) {
      setQuestionMessage('Lỗi khi lưu: ' + error.message)
    } else {
      setQuestionMessage('Cập nhật câu hỏi thành công!')
      onEdit({ ...question, content: editedContent.trim(), image: editedImage.trim() || null })
    }
    setIsSavingQuestion(false)
  }

  const handleAnswerChange = (id: number|string, newContent: string) => {
    setAnswers((prev) =>
      prev.map((ans) => (ans.id === id ? { ...ans, content: newContent, message: '' } : ans))
    )
  }

  const handleAnswerToggleCorrect = (id: number|string) => {
    setAnswers((prev) =>
      prev.map((ans) => (ans.id === id ? { ...ans, is_correct: !ans.is_correct, message: '' } : ans))
    )
  }

  const handleSaveAnswer = async (id: number|string) => {
    const editedAns = answers.find((a) => a.id === id)
    if (!editedAns) return

    if (!editedAns.content.trim()) {
      setAnswers((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, message: 'Nội dung đáp án không được để trống' } : a
        )
      )
      return
    }

    setAnswers((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isSaving: true, message: '' } : a))
    )

    const { error } = await supabase
      .from('answer')
      .update({
        content: editedAns.content.trim(),
        is_correct: editedAns.is_correct,
      })
      .eq('id', id)

    if (error) {
      setAnswers((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, isSaving: false, message: 'Lỗi khi lưu: ' + error.message } : a
        )
      )
    } else {
      setAnswers((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, isSaving: false, message: 'Lưu thành công!' } : a
        )
      )

      onEdit({
        ...question,
        answer: question.answer.map((a) =>
          a.id === id ? { ...a, content: editedAns.content.trim(), is_correct: editedAns.is_correct } : a
        ),
      })

      setTimeout(() => {
        setAnswers((prev) =>
          prev.map((a) => (a.id === id ? { ...a, message: '' } : a))
        )
      }, 1000)
    }
  }

  return (
    <div className="border p-4 rounded shadow mb-4">
      <div className="flex justify-between items-start">
        <h2 className="font-semibold mb-2">
          Câu {index + 1}: {question.content}
        </h2>
        <div className="space-x-2">
          <button onClick={handleEditClick} className="text-blue-600">Sửa</button>
          <button onClick={handleDelete} className="text-red-600">Xoá</button>
        </div>
      </div>

      {question.image && (
        <img src={question.image} alt={`Câu hỏi ${index + 1}`} className="w-64 mb-2" />
      )}

      <ul className="list-disc pl-5 space-y-1">
        {question.answer.map((ans) => (
          <li key={ans.id} className={ans.is_correct ? 'text-green-600 font-semibold' : ''}>
            {ans.content}
          </li>
        ))}
      </ul>

      {/* Modal sửa câu hỏi + đáp án */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 overflow-auto p-4">
          <div className="bg-white p-6 rounded w-full max-w-lg max-h-full overflow-auto">
            <h2 className="text-lg font-semibold mb-4">Sửa câu hỏi</h2>

            <label className="block mb-2 font-medium">Nội dung câu hỏi</label>
            <input
              type="text"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-4"
              disabled={isSavingQuestion}
            />

            <label className="block mb-2 font-medium">Link ảnh (nếu có)</label>
            <input
              type="text"
              value={editedImage}
              onChange={(e) => setEditedImage(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-4"
              disabled={isSavingQuestion}
            />

            {questionMessage && (
              <p className={`mb-4 ${questionMessage.includes('Lỗi') ? 'text-red-600' : 'text-green-600'}`}>
                {questionMessage}
              </p>
            )}

            <div className="flex justify-end space-x-2 mb-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded"
                disabled={isSavingQuestion}
              >
                Đóng
              </button>

              {hasQuestionChanges() && (
                <button
                  onClick={handleSaveQuestion}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                  disabled={isSavingQuestion}
                >
                  {isSavingQuestion ? 'Đang lưu...' : 'Lưu'}
                </button>
              )}
            </div>

            <h3 className="text-md font-semibold mb-3">Sửa đáp án</h3>
            <div className="space-y-4 max-h-80 overflow-auto">
              {answers.map((ans) => (
                <div key={ans.id} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={ans.content}
                    onChange={(e) => handleAnswerChange(Number(ans.id), e.target.value)}
                    className="flex-grow border px-3 py-2 rounded"
                    disabled={ans.isSaving}
                  />
                  <label className="flex items-center space-x-1">
                    <input
                      type="checkbox"
                      checked={ans.is_correct}
                      onChange={() => handleAnswerToggleCorrect(Number(ans.id))}
                      disabled={ans.isSaving}
                    />
                    <span>Đúng</span>
                  </label>
                  <button
                    onClick={() => handleSaveAnswer(Number(ans.id))}
                    className="px-3 py-1 bg-green-600 text-white rounded"
                    disabled={ans.isSaving}
                  >
                    {ans.isSaving ? 'Đang lưu...' : 'Lưu'}
                  </button>
                  {ans.message && (
                    <span className={`ml-2 ${ans.message.includes('Lỗi') ? 'text-red-600' : 'text-green-600'}`}>
                      {ans.message}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
