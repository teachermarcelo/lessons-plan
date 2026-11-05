import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, XCircle, RotateCcw, Award, HelpCircle } from 'lucide-react';
import { QuizQuestion } from '../types/fluent';

interface QuizRunnerProps {
  questions: QuizQuestion[];
  lessonTitle: string;
}

export const QuizRunner: React.FC<QuizRunnerProps> = ({ questions, lessonTitle }) => {
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showExplanations, setShowExplanations] = useState(false);

  if (!questions || questions.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-900 rounded-2xl border border-slate-800 text-slate-400">
        Nenhum quiz ou teste interativo configurado para esta lição ainda.
      </div>
    );
  }

  const handleSelectOption = (qIndex: number, option: string) => {
    if (submitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [qIndex]: option,
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      const ans = userAnswers[idx];
      if (ans && ans.trim().toLowerCase() === q.correct_answer.trim().toLowerCase()) {
        correct++;
      }
    });
    return correct;
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setShowExplanations(true);
    const score = calculateScore();
    const percent = Math.round((score / questions.length) * 100);
    if (percent >= 70) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleReset = () => {
    setUserAnswers({});
    setSubmitted(false);
    setShowExplanations(false);
  };

  const score = calculateScore();
  const percent = Math.round((score / questions.length) * 100);

  return (
    <div className="max-w-2xl mx-auto py-2">
      {/* Cabeçalho do Quiz */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
            Verificação de Aprendizado & Fixação
          </span>
          <h4 className="text-lg font-extrabold text-white">{lessonTitle} — Quiz Interativo</h4>
          <p className="text-xs text-slate-400">{questions.length} Questões • Correção Automática com Explicações</p>
        </div>

        {submitted && (
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <span className="text-xs text-slate-400">Pontuação:</span>
              <div className="text-xl font-black text-white">
                {score} / {questions.length} ({percent}%)
              </div>
            </div>
            <button
              onClick={handleReset}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all"
              title="Refazer Exercício"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Lista de Questões */}
      <div className="space-y-6">
        {questions.map((q, qIndex) => {
          const selectedAnswer = userAnswers[qIndex];
          const isCorrect =
            submitted &&
            selectedAnswer &&
            selectedAnswer.trim().toLowerCase() === q.correct_answer.trim().toLowerCase();
          const isWrong = submitted && !isCorrect;

          return (
            <div
              key={q.id || qIndex}
              className={`p-6 rounded-2xl border transition-all ${
                submitted
                  ? isCorrect
                    ? 'bg-emerald-950/20 border-emerald-500/40'
                    : 'bg-rose-950/20 border-rose-500/40'
                  : 'bg-slate-900/90 border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 rounded-full bg-purple-600/30 text-purple-300 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {qIndex + 1}
                  </span>
                  <p className="text-sm sm:text-base font-semibold text-white leading-snug">
                    {q.prompt}
                  </p>
                </div>

                {submitted && (
                  <div>
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                    )}
                  </div>
                )}
              </div>

              {/* Opções de Resposta */}
              {q.options && q.options.length > 0 ? (
                <div className="space-y-2 ml-9">
                  {q.options.map((opt, oIndex) => {
                    const isSelected = selectedAnswer === opt;
                    const isAnswerTarget = opt.trim().toLowerCase() === q.correct_answer.trim().toLowerCase();

                    let optionStyle = 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700';

                    if (submitted) {
                      if (isAnswerTarget) {
                        optionStyle = 'bg-emerald-950/50 border-emerald-500 text-emerald-200 font-medium';
                      } else if (isSelected && !isAnswerTarget) {
                        optionStyle = 'bg-rose-950/50 border-rose-500 text-rose-200 line-through';
                      } else {
                        optionStyle = 'bg-slate-950/50 border-slate-900 text-slate-500 opacity-60';
                      }
                    } else if (isSelected) {
                      optionStyle = 'bg-purple-600/30 border-purple-500 text-white font-semibold';
                    }

                    return (
                      <button
                        key={oIndex}
                        onClick={() => handleSelectOption(qIndex, opt)}
                        disabled={submitted}
                        className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between ${optionStyle}`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="w-5 h-5 rounded-md bg-slate-800/80 text-slate-400 font-mono text-xs flex items-center justify-center">
                            {String.fromCharCode(65 + oIndex)}
                          </span>
                          <span>{opt}</span>
                        </div>
                        {submitted && isAnswerTarget && (
                          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                            Correto
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="ml-9">
                  <input
                    type="text"
                    disabled={submitted}
                    value={selectedAnswer || ''}
                    onChange={(e) => handleSelectOption(qIndex, e.target.value)}
                    placeholder="Digite sua resposta aqui..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                  {submitted && (
                    <p className="mt-2 text-xs text-emerald-400 font-medium">
                      Resposta Correta: {q.correct_answer}
                    </p>
                  )}
                </div>
              )}

              {/* Explicação Pedagógica */}
              {showExplanations && q.explanation && (
                <div className="mt-4 ml-9 p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 text-xs text-purple-200 flex items-start space-x-2">
                  <HelpCircle className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-purple-300">Explicação do Professor: </span>
                    <span>{q.explanation}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Ação Inferior */}
      <div className="mt-8 flex items-center justify-end space-x-4">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={Object.keys(userAnswers).length === 0}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all flex items-center space-x-2 active:scale-95"
          >
            <Award className="w-4 h-4 text-purple-200" />
            <span>Confirmar Respostas & Calcular Nota</span>
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition-all flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Refazer Exercício</span>
          </button>
        )}
      </div>
    </div>
  );
};
