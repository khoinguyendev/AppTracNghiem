"use client"

import { useState, useEffect, Key, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ChevronLeft, ChevronRight, Clock, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { supabase } from "@/lib/supabaseClient"
import { IQuestion } from "@/types/Questions"
import ListExam from "./list-exam"
import { IExam } from "@/types/Exam"
import { toast } from 'sonner'
import { useUser } from "@/context/UserContext"


type UserAnswer = {
  questionId: Key;
  value: string | null;
  correct: boolean | null;
};
export default function QuizInterface() {
  const { user } = useUser()
  const [questions, setQuestions] = useState<IQuestion[]>([])
  const [exam, setExam] = useState<IExam | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([])
  // const [timeLeft, setTimeLeft] = useState(15 * 60) // 15 phút tính bằng giây
  const [isFinished, setIsFinished] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [isLoadingAdd, setIsLoadingAdd] = useState(false)
  const [score, setScore] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [load, setLoad] = useState(false);


  // Xử lý khi người dùng chọn đáp án
  const handleAnswerChange = (value: string, correct: boolean) => {
    const old = userAnswers[currentQuestionIndex];
    userAnswers[currentQuestionIndex] = {
      ...old,
      value: value,
      correct: correct
    }
    setLoad((pre) => !pre)

  };

  // Chuyển đến câu hỏi tiếp theo
  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);

    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);

    }
  };


  // Xử lý khi hoàn thành bài thi
  const handleFinish = () => {
    setIsFinished(true)

    // Tính điểm
    let correctCount = 0
    userAnswers.forEach((answer) => {
      if (answer.correct) {
        correctCount++
      }
    })

    setScore(correctCount)
    setShowResults(true)
  }

  // Xử lý khi người dùng muốn làm lại bài
  const handleRetry = () => {
    const newAnser = questions.map((item: any) => ({
      questionId: item.id,
      value: null,
      correct: null,
    }))
    setUserAnswers(newAnser)
    setCurrentQuestionIndex(0)
    setIsFinished(false)
    setShowResults(false)
  }
  const handleAddToReview = async () => {
    if (!user?.id || !currentQuestion?.id) {
      toast.error("Thiếu thông tin người dùng hoặc câu hỏi")
      return
    }
    setIsLoadingAdd(true)
    // 1. Kiểm tra xem đã có trong review chưa
    const { data: existing, error: checkError } = await supabase
      .from('review_questions')
      .select('id')
      .eq('user_id', user.id)
      .eq('question_id', currentQuestion.id)
      .single() // vì mỗi user chỉ nên có 1 bản ghi cho 1 câu hỏi


    if (existing) {
      toast.info("Câu hỏi đã có trong gợi nhớ!")
      setIsLoadingAdd(false)
      return
    }

    // 2. Nếu chưa có, thì thêm vào
    const { error: insertError } = await supabase.from('review_questions').insert({
      user_id: user.id,
      question_id: currentQuestion.id,
    })

    if (insertError) {
      toast.error("Lỗi khi thêm câu hỏi: " + insertError.message)
    } else {
      toast.success("Đã thêm vào gợi nhớ!")
    }

    setIsLoadingAdd(false)
  }

  // Xử lý khi chọn đề thi khác
  const handleSelectQuizSet = async (exam: IExam) => {
    setExam(exam);
    setIsLoading(true);
    const { data, error } = await supabase.from("exam").select("*,question(*,answer(*))").eq("id", exam.id);

    if (error) {
      console.error("Lỗi khi tải exam:", error.message);
    } else {
      setQuestions(data[0].question);
      const newAnser = data[0].question.map((item: any) => ({
        questionId: item.id,
        value: null,
        correct: null,
      }))
      setUserAnswers(newAnser);
      setCurrentQuestionIndex(0);
      setScore(0);
      setIsFinished(false);
      setShowResults(false);
    }
    setIsLoading(false);
  }
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

  }, [currentQuestionIndex]);
  const handleShowAnswer = () => {
    setShowAnswer(true);
  }
  if (isLoading) return <div>Đang tải dữ liệu chờ tí</div>
  // Tính phần trăm tiến độ
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100
  // Lấy câu hỏi hiện tại
  const currentQuestion = questions[currentQuestionIndex]
  // Lấy câu trả lời của người dùng cho câu hỏi hiện tại
  const currentAnswer = userAnswers[currentQuestionIndex]?.value || "";

  return (
    <div className="flex  overflow-hidden" >
      {/* Sidebar */}
      <div
        className={cn(
          "bg-white border-r border-gray-200 flex-shrink-0 transition-all duration-300 ease-in-out z-20",
          sidebarOpen ? "w-64" : "w-0 overflow-hidden",
          isMobile ? "fixed inset-y-14 left-0 transform" : "",
          isMobile && !sidebarOpen ? "-translate-x-full" : "translate-x-0",
        )}
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-bold text-lg">Danh sách đề thi</h2>

          {isMobile && (
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
        <div className="p-2 overflow-y-auto h-100vh">
          <ListExam handleSelectQuizSet={handleSelectQuizSet} />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden" >
        {/* Quiz header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center" >
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? "Đóng sidebar" : "Mở sidebar"}
          >
            {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </Button>
          <h1 className="text-xl font-bold">{exam && exam.title}</h1>
        </div>
        {exam ? <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          <div className="max-w-4xl mx-auto space-y-6" >
            {/* Thanh tiến trình và thời gian */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1 mr-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>
                    Câu {currentQuestionIndex + 1}/{questions.length}
                  </span>
                  <span>{Math.round(progressPercentage)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
              {/* <div className="flex items-center bg-orange-100 text-orange-800 px-3 py-1 rounded-full">
                <Clock className="h-4 w-4 mr-1" />
              </div> */}
            </div>

            {/* Câu hỏi hiện tại */}
            <Card className="shadow-lg" >
              <CardHeader  >
                <CardTitle className="text-xl">
                  Câu {currentQuestionIndex + 1}:{" "}
                  {currentQuestion?.content.startsWith("https") ? (
                    <img
                      src={currentQuestion.content}
                      alt={`Câu ${currentQuestionIndex + 1}`}
                      className="max-w-full max-h-[200px] rounded-md border object-cover"
                    />
                  ) : (
                    currentQuestion?.content
                  )}
                </CardTitle>
                {currentQuestion?.image && (
                  <div className="mt-4">
                    <img
                      src={currentQuestion.image}
                      alt={`Ảnh minh họa câu ${currentQuestionIndex + 1}`}
                      className="max-w-full max-h-[500px] rounded-md border object-cover"
                    />
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <RadioGroup value={currentAnswer} onValueChange={() => handleAnswerChange} className="space-y-3">
                  {currentQuestion?.answer.map((option, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-2 border rounded-lg p-4 transition-colors ${currentAnswer === option.content ? "bg-blue-50 border-blue-300" : "hover:bg-gray-50"
                        }`}
                      onClick={() => handleAnswerChange(option.content, option.is_correct)}
                    >
                      <RadioGroupItem value={option.content} id={`option-${index}`} className="text-blue-600" />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer font-medium">
                        {option.content}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
              <CardFooter className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
                <Button
                  variant="outline"
                  onClick={goToPreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="w-full md:w-auto"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Câu trước
                </Button>

                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto justify-end">
                  <Button onClick={handleShowAnswer} className="w-full sm:w-auto order-2">
                    Xem đáp án
                  </Button>
                  <Button onClick={handleAddToReview} className="w-full sm:w-auto order-3">
                    {isLoadingAdd ? "Đang thêm..." : "Thêm vào gợi nhớ"}

                  </Button>
                  {currentQuestionIndex < questions.length - 1 ? (
                    <Button onClick={goToNextQuestion} className="w-full sm:w-auto order-1">
                      Câu tiếp theo <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleFinish}
                      className="bg-green-600 hover:bg-green-700 w-full sm:w-auto order-1"
                    >
                      Nộp bài
                    </Button>
                  )}
                </div>
              </CardFooter>

            </Card>

            {/* Danh sách câu hỏi */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Danh sách câu hỏi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {questions?.map((_, index) => (
                    <Button
                      key={index}
                      variant={
                        index === currentQuestionIndex
                          ? "default"

                          : "secondary"
                      }
                      className={`h-10 w-10 p-0  border-blue-500`}
                      onClick={() => setCurrentQuestionIndex(index)}
                    >
                      {index + 1}
                    </Button>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleFinish} className="w-full bg-green-600 hover:bg-green-700">
                  Nộp bài
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div> : "Chọn đề"}
        {/* Quiz content */}

      </div>

      {/* Dialog hiển thị kết quả */}
      {userAnswers.length > 0 && showResults && <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Kết quả bài làm</DialogTitle>
            <DialogDescription>Bạn đã hoàn thành bài trắc nghiệm!</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="text-center mb-4">
              <div className="text-5xl font-bold text-blue-600 mb-2">
                {score}/{questions.length}
              </div>
              <p className="text-gray-500">Điểm số của bạn</p>
            </div>
            <div className="space-y-2">
              {questions.map((question, index) => (
                <div key={index} className="flex items-center text-sm">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${userAnswers[index]?.correct
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                      }`}
                  >
                    {userAnswers[index]?.correct ? "✓" : "✗"}
                  </div>
                  <span className="truncate">
                    Câu {index + 1}: {userAnswers[index]?.value || "Chưa trả lời"}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleRetry} className="w-full">
              Làm lại
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>}

      {showAnswer && <Dialog open={showAnswer} onOpenChange={setShowAnswer}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-auto">
          <DialogHeader >
            <DialogTitle >Đáp án</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="text-center mb-4">
              <div className="text-lg font-bold text-blue-600 mb-2">
                Câu {currentQuestionIndex + 1}:{" "}
                  {currentQuestion?.content.startsWith("https") ? (
                    <img
                      src={currentQuestion.content}
                      alt={`Câu ${currentQuestionIndex + 1}`}
                      className="max-w-full max-h-[200px] rounded-md border object-cover"
                    />
                  ) : (
                    currentQuestion?.content
                  )}

              </div>
              {currentQuestion?.image && (
                <div className="mt-4">
                  <img
                    src={currentQuestion.image}
                    alt={`Ảnh minh họa câu ${currentQuestionIndex + 1}`}
                    className="max-w-full max-h-[500px] rounded-md border object-cover"
                  />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <p className="text-gray-500">Đáp án đúng</p>
              {currentQuestion.answer
                .filter((item) => item.is_correct)
                .map((item, index) => (
                  <p key={index} className="text-green-600">
                    {item.content}
                  </p>
                ))}
            </div>

          </div>

        </DialogContent>
      </Dialog>}
    </div>
  )
}
