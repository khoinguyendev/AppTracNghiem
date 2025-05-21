'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { IExam } from '@/types/Exam'
import Link from 'next/link'

const ListExam = () => {
  const [exams, setExams] = useState<IExam[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchExams = async () => {
      const { data, error } = await supabase.from('exam').select('*')

      if (error) {
        console.error('Lỗi lấy đề thi:', error.message)
      } else {
        setExams(data)
      }

      setLoading(false)
    }

    fetchExams()
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Danh sách đề thi</h1>

      {loading ? (
        <p>Đang tải...</p>
      ) : exams.length === 0 ? (
        <p>Không có đề thi nào.</p>
      ) : (
        <table className="min-w-full table-auto border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-2 border">ID</th>
              <th className="text-left p-2 border">Tiêu đề</th>
              <th className="text-left p-2 border">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((exam) => (
              <tr key={exam.id}>
                <td className="p-2 border">{exam.id}</td>
                <td className="p-2 border">{exam.title}</td>
                <td className="p-2 border">  <Link href={`/admin/exams/${exam.id}`}>
                  <span className="text-black">Xem câu hỏi</span>
                </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default ListExam
