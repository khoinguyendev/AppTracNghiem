import ProtectedRoute from "@/components/ProtectedRoute";
import QuizInterface from "@/components/quiz-interface";

export default function Home() {
  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-50">
        <QuizInterface />
      </main>
    </ProtectedRoute>

  );
}
