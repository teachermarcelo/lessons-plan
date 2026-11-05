import React, { useState } from 'react';
import { Volume2, RotateCcw, Shuffle, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { FlashcardItem } from '../types/fluent';

interface FlashcardPlayerProps {
  cards: FlashcardItem[];
  lessonTitle: string;
}

export const FlashcardPlayer: React.FC<FlashcardPlayerProps> = ({ cards, lessonTitle }) => {
  const [deck, setDeck] = useState<FlashcardItem[]>(cards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studiedCount, setStudiedCount] = useState<number[]>([]);

  if (!deck || deck.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-900 rounded-2xl border border-slate-800 text-slate-400">
        Nenhum cartão de vocabulário cadastrado para esta lição ainda.
      </div>
    );
  }

  const currentCard = deck[currentIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!studiedCount.includes(currentIndex)) {
      setStudiedCount([...studiedCount, currentIndex]);
    }
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % deck.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + deck.length) % deck.length);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setStudiedCount([]);
  };

  const speakTerm = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-4">
      {/* Controles Superiores */}
      <div className="flex items-center justify-between text-xs text-slate-400 mb-4 px-1">
        <span className="font-bold text-purple-400">
          Cartão {currentIndex + 1} de {deck.length}
        </span>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleShuffle}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all text-xs font-semibold"
            title="Embaralhar cartas"
          >
            <Shuffle className="w-3.5 h-3.5 text-purple-400" />
            <span>Embaralhar</span>
          </button>
          <button
            onClick={() => {
              setIsFlipped(false);
              setCurrentIndex(0);
            }}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all"
            title="Recomeçar baralho"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Barra de Progresso */}
      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-6">
        <div
          className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / deck.length) * 100}%` }}
        />
      </div>

      {/* Cartão com Efeito Flip 3D */}
      <div
        onClick={handleFlip}
        className="w-full h-72 sm:h-80 cursor-pointer perspective-1000 select-none group"
      >
        <div
          className={`relative w-full h-full duration-500 transform-style-3d transition-transform rounded-3xl shadow-2xl ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* FRENTE DO CARTÃO */}
          <div className="absolute inset-0 backface-hidden w-full h-full rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/60 border-2 border-purple-500/40 p-8 flex flex-col justify-between items-center text-center shadow-xl">
            <div className="w-full flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-purple-400 font-bold">FRENTE • TERMO</span>
              <button
                onClick={(e) => speakTerm(e, currentCard.front)}
                className="p-2.5 rounded-full bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white transition-all shadow-md"
                title="Ouvir pronúncia nativa em inglês"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
                {currentCard.front}
              </h3>
              {currentCard.ipa && (
                <span className="inline-block text-sm font-mono text-purple-300 bg-purple-950/80 px-3 py-1 rounded-full border border-purple-500/30">
                  {currentCard.ipa}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-400 flex items-center space-x-1">
              <span>Clique no cartão para virar e ver o significado</span>
            </p>
          </div>

          {/* VERSO DO CARTÃO */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 w-full h-full rounded-3xl bg-gradient-to-br from-purple-950 via-slate-900 to-slate-900 border-2 border-indigo-500/40 p-8 flex flex-col justify-between items-center text-center shadow-xl">
            <div className="w-full flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-indigo-400 font-bold">VERSO • DEFINIÇÃO E USO</span>
              <button
                onClick={(e) => speakTerm(e, currentCard.back)}
                className="p-2.5 rounded-full bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white transition-all shadow-md"
                title="Ouvir definição"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <div className="max-w-md">
              <p className="text-base sm:text-lg text-slate-100 font-semibold leading-relaxed mb-4">
                {currentCard.back}
              </p>
              {currentCard.example && (
                <p className="text-xs sm:text-sm text-purple-300 italic bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                  "{currentCard.example}"
                </p>
              )}
            </div>

            <p className="text-xs text-slate-400">Clique para virar de volta</p>
          </div>
        </div>
      </div>

      {/* Botões de Navegação */}
      <div className="flex items-center justify-between mt-6 px-2">
        <button
          onClick={handlePrev}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 flex items-center space-x-1.5 text-xs font-semibold transition-all active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Anterior</span>
        </button>

        <span className="text-[11px] text-slate-400 hidden sm:inline">
          Toque no cartão para virar • Ícone de áudio para ouvir pronúncia
        </span>

        <button
          onClick={handleNext}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white flex items-center space-x-1.5 text-xs font-bold transition-all shadow-md shadow-purple-600/30 active:scale-95"
        >
          <span>Próximo Cartão</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
