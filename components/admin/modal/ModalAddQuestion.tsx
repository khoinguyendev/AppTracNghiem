'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type Props = {
  examId: string
  onClose: () => void
  onQuestionAdded: () => void
}

export default function ModalAddQuestion({ examId, onClose, onQuestionAdded }: Props) {
  const [content, setContent] = useState('')
  const [image, setImage] = useState('')
  const [answers, setAnswers] = useState([
    { content: '', is_correct: false },
    { content: '', is_correct: false },
  ]) // mặc định 3 đáp án

  const handleAnswerChange = (index: number, field: 'content' | 'is_correct', value: string | boolean) => {
    setAnswers(prev =>
      prev.map((a, i) => (i === index ? { ...a, [field]: value } : a))
    )
  }

  const addAnswer = () => {
   
      setAnswers([...answers, { content: '', is_correct: false }])
  }

  const removeAnswer = (index: number) => {
    if (answers.length > 2) {
      setAnswers(answers.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = async () => {
    if (!content.trim()) {
      alert('Vui lòng nhập nội dung câu hỏi')
      return
    }

    if (answers.length < 2) {
      alert('Cần ít nhất 2 đáp án')
      return
    }

    if (answers.some(a => !a.content.trim())) {
      alert('Vui lòng nhập đầy đủ nội dung các đáp án')
      return
    }

    // ít nhất 1 đáp án đúng
    if (!answers.some(a => a.is_correct)) {
      alert('Cần chọn ít nhất 1 đáp án đúng')
      return
    }

    const { data: questionData, error: questionError } = await supabase
      .from('question')
      .insert({
        exam_id: examId,
        content,
        image: image || null,
      })
      .select()
      .single()

    if (questionError || !questionData) {
      alert('Lỗi khi thêm câu hỏi: ' + questionError?.message)
      return
    }

    const answersToInsert = answers.map(a => ({
      content: a.content,
      is_correct: a.is_correct,
      question_id: questionData.id,
    }))

    const { error: answerError } = await supabase.from('answer').insert(answersToInsert)

    if (answerError) {
      alert('Lỗi khi thêm câu trả lời: ' + answerError.message)
      return
    }

    onQuestionAdded()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-xl max-h-[90vh] overflow-auto">
        <h2 className="text-lg font-bold mb-4">Thêm câu hỏi mới</h2>

        <input
          type="text"
          placeholder="Nội dung câu hỏi"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border px-3 py-2 mb-4 rounded"
        />

        <input
          type="text"
          placeholder="Link ảnh (nếu có)"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full border px-3 py-2 mb-4 rounded"
        />

        <div className="space-y-3 mb-4">
          {answers.map((a, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                placeholder={`Đáp án ${i + 1}`}
                value={a.content}
                onChange={(e) => handleAnswerChange(i, 'content', e.target.value)}
                className="flex-1 border px-3 py-2 rounded"
              />
              <label className="flex items-center gap-1 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={a.is_correct}
                  onChange={(e) => handleAnswerChange(i, 'is_correct', e.target.checked)}
                />
                Đúng
              </label>
              {answers.length > 3 && (
                <button
                  onClick={() => removeAnswer(i)}
                  className="text-red-600 px-2 py-1 rounded hover:bg-red-100"
                  type="button"
                  aria-label={`Xóa đáp án ${i + 1}`}
                >
                  &times;
                </button>
              )}
            </div>
          ))}
        </div>

        
          <button
            onClick={addAnswer}
            className="mb-4 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            type="button"
          >
            + Thêm đáp án
          </button>
        

        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded" type="button">
            Hủy
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded" type="button">
            Lưu
          </button>
        </div>
      </div>
    </div>
  )
}
