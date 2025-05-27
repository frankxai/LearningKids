import { useState } from "react";
import { useLocation } from "wouter";
import { Header } from "@/components/header";
import { BottomNavigation } from "@/components/bottom-navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useAppState } from "@/hooks/use-app-state";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
}

export default function Quiz() {
  const [, setLocation] = useLocation();
  const { selectedAge, showCelebration } = useAppState();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: "Welcher Buchstabe kommt nach A?",
      options: ["B", "C", "D", "Z"],
      correctAnswer: 0,
      explanation: "B kommt nach A im deutschen Alphabet!",
      category: "Alphabet"
    },
    {
      id: 2,
      question: "Wie viele Finger hast du an einer Hand?",
      options: ["3", "4", "5", "6"],
      correctAnswer: 2,
      explanation: "Du hast 5 Finger an jeder Hand!",
      category: "Zahlen"
    },
    {
      id: 3,
      question: "Welche Farbe entsteht wenn man Rot und Gelb mischt?",
      options: ["Grün", "Orange", "Blau", "Lila"],
      correctAnswer: 1,
      explanation: "Rot und Gelb ergeben Orange!",
      category: "Farben"
    },
    {
      id: 4,
      question: "Was sagst du, wenn du etwas möchtest?",
      options: ["Danke", "Bitte", "Tschüss", "Hallo"],
      correctAnswer: 1,
      explanation: "Bitte ist das Zauberwort!",
      category: "Soziales"
    },
    {
      id: 5,
      question: "Bei welcher Ampelfarbe darfst du über die Straße gehen?",
      options: ["Rot", "Gelb", "Grün", "Blau"],
      correctAnswer: 2,
      explanation: "Bei Grün darfst du sicher über die Straße!",
      category: "Sicherheit"
    }
  ];

  const currentQ = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  const handleAnswerSelect = (answerIndex: number) => {
    if (answered) return;
    
    setSelectedAnswer(answerIndex);
    setAnswered(true);
    
    if (answerIndex === currentQ.correctAnswer) {
      setScore(score + 1);
      showCelebration();
    }
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setAnswered(false);
  };

  const getScoreMessage = () => {
    const percentage = (score / quizQuestions.length) * 100;
    if (percentage >= 80) return "Fantastisch! Du bist ein Lern-Champion! 🏆";
    if (percentage >= 60) return "Super gemacht! Du lernst sehr gut! 🌟";
    if (percentage >= 40) return "Gut! Übe weiter, du wirst immer besser! 💪";
    return "Das war ein guter Anfang! Versuche es nochmal! 🌈";
  };

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-skyblue via-teal to-mint">
        <Header onOpenParentalDashboard={() => {}} />
        
        <main className="container mx-auto px-4 py-8">
          <Card className="bg-white rounded-3xl shadow-xl max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <i className="fas fa-trophy text-6xl text-sunny mb-4"></i>
                <h2 className="text-4xl font-fredoka text-darkgray mb-4">
                  Quiz Beendet!
                </h2>
                <p className="text-2xl text-coral mb-6">
                  {score} von {quizQuestions.length} richtig!
                </p>
                <p className="text-xl text-darkgray mb-8">
                  {getScoreMessage()}
                </p>
              </div>

              <div className="space-y-4">
                <Button
                  size="lg"
                  className="bg-coral hover:bg-coral/90 text-white text-xl px-8 py-4 rounded-2xl mr-4"
                  onClick={handleRestart}
                >
                  <i className="fas fa-redo mr-2"></i>
                  Nochmal versuchen
                </Button>
                <Button
                  size="lg"
                  className="bg-teal hover:bg-teal/90 text-white text-xl px-8 py-4 rounded-2xl"
                  onClick={() => setLocation('/')}
                >
                  <i className="fas fa-home mr-2"></i>
                  Zurück zur Startseite
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>

        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-skyblue via-teal to-mint">
      <Header onOpenParentalDashboard={() => {}} />
      
      <main className="container mx-auto px-4 py-8">
        <Card className="bg-white rounded-3xl shadow-xl max-w-2xl mx-auto">
          <CardContent className="p-8">
            {/* Progress Header */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <Badge className="bg-coral text-white text-lg px-4 py-2">
                  {currentQ.category}
                </Badge>
                <span className="text-darkgray font-fredoka text-lg">
                  {currentQuestion + 1} / {quizQuestions.length}
                </span>
              </div>
              <Progress value={progress} className="h-3 bg-gray-200" />
            </div>

            {/* Question */}
            <div className="mb-8">
              <h2 className="text-3xl font-fredoka text-darkgray mb-6 text-center">
                {currentQ.question}
              </h2>
              
              <div className="space-y-4">
                {currentQ.options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={answered}
                    className={`w-full p-6 text-xl text-left rounded-2xl transition-all ${
                      answered
                        ? index === currentQ.correctAnswer
                          ? "bg-mint text-white"
                          : index === selectedAnswer
                          ? "bg-coral text-white"
                          : "bg-gray-100 text-darkgray"
                        : "bg-gray-50 hover:bg-gray-100 text-darkgray hover:scale-105"
                    }`}
                  >
                    <span className="mr-4 font-bold">
                      {String.fromCharCode(65 + index)}
                    </span>
                    {option}
                    {answered && index === currentQ.correctAnswer && (
                      <i className="fas fa-check ml-2 text-white"></i>
                    )}
                    {answered && index === selectedAnswer && index !== currentQ.correctAnswer && (
                      <i className="fas fa-times ml-2 text-white"></i>
                    )}
                  </Button>
                ))}
              </div>
            </div>

            {/* Explanation */}
            {answered && (
              <div className="mb-6 p-4 bg-mint/20 rounded-2xl">
                <p className="text-darkgray text-lg text-center">
                  <i className="fas fa-lightbulb text-sunny mr-2"></i>
                  {currentQ.explanation}
                </p>
              </div>
            )}

            {/* Next Button */}
            {answered && (
              <div className="text-center">
                <Button
                  onClick={handleNext}
                  size="lg"
                  className="bg-teal hover:bg-teal/90 text-white text-xl px-8 py-4 rounded-2xl"
                >
                  {currentQuestion < quizQuestions.length - 1 ? (
                    <>
                      <i className="fas fa-arrow-right mr-2"></i>
                      Nächste Frage
                    </>
                  ) : (
                    <>
                      <i className="fas fa-flag-checkered mr-2"></i>
                      Quiz beenden
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <BottomNavigation />
    </div>
  );
}