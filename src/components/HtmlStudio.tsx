import React, { useState } from 'react';
import { 
  Sparkles, 
  Code, 
  Eye, 
  Layout, 
  Save, 
  FileDown, 
  Plus, 
  Trash2, 
  Wand2, 
  Check, 
  RefreshCw, 
  BookOpen, 
  FileCode,
  Layers,
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Lesson, CEFRLevelId, DepartmentType } from '../types/fluent';
import { generateLessonPDF } from '../lib/pdfGenerator';

interface HtmlStudioProps {
  initialLesson?: Lesson | null;
  onSaveLesson: (lesson: Lesson) => void;
  onPublishLesson: (lesson: Lesson) => void;
  onBackToDashboard: () => void;
}

export const HtmlStudio: React.FC<HtmlStudioProps> = ({
  initialLesson,
  onSaveLesson,
  onPublishLesson,
  onBackToDashboard,
}) => {
  const [studioMode, setStudioMode] = useState<'visual' | 'code' | 'preview'>('visual');
  const [previewTab, setPreviewTab] = useState<'teacher' | 'student'>('teacher');
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [savedNotice, setSavedNotice] = useState(false);

  // Lesson state
  const [lessonData, setLessonData] = useState<Lesson>(
    initialLesson || {
      id: `les-custom-${Date.now()}`,
      title: 'Novo Plano de Aula Comunicativo',
      slug: `novo-plano-de-aula-${Date.now()}`,
      cefr_level: 'B1',
      department: 'CEFR',
      category: 'Geral',
      age_group: 'Adultos & Adolescentes',
      duration_minutes: 60,
      difficulty: 'Intermediate',
      learning_objectives: ['Dominar estruturas comunicativas em contextos reais do dia a dia'],
      language_focus: 'Padrões gramaticais e colocações naturais',
      skills_covered: ['Speaking', 'Listening', 'Vocabulary'],
      tags: ['Personalizado', 'Comunicativo', 'Interativo'],
      summary: 'Plano de aula interativo focado na autonomia da fala e precisão comunicativa.',
      is_published: true,
      published_at: new Date().toISOString(),
      view_count: 0,
      download_count: 0,
      teacher_version: {
        warmup: 'Ative o conhecimento prévio dos alunos com uma pergunta estimulante (5 min).',
        lead_in: 'Apresente a situação-problema ou cenário real (10 min).',
        presentation: 'Apresente Meaning, Form e Pronunciation (MFP) da estrutura alvo (15 min).',
        controlled_practice: 'Exercícios guiados de preenchimento ou transformação de frases (10 min).',
        communicative_practice: 'Role-play em duplas ou dinâmica colaborativa de tomada de decisão (15 min).',
        wrap_up: 'Feedback coletivo e correção de erros anônimos no quadro (5 min).',
        homework: 'Redigir um parágrafo reflexivo utilizando o vocabulário alvo.',
        teaching_tips: ['Maximize o tempo de fala do aluno (STT)', 'Anote os desvios discretamente para o wrap-up'],
        materials_needed: ['Ficha de Atividades do Aluno', 'Imagens de Apoio'],
      },
      student_version: {
        reading_text: 'Leia o texto de diálogo e observe como os interlocutores expressam seus pontos de vista.',
        vocab_activities: 'Relacione as palavras em destaque com suas respectivas definições.',
        grammar_exercises: 'Complete as lacunas utilizando a forma verbal ou modal adequado.',
        speaking_prompts: ['Converse com sua dupla e apresente seu ponto de vista sobre o tema proposto.'],
        homework: 'Escreva um parágrafo usando pelo menos 3 novas palavras aprendidas hoje.',
      },
      vocabulary_list: [
        {
          term: 'Perspective',
          ipa: '/pɚˈspek.tɪv/',
          definition: 'A particular attitude toward or way of regarding something; a point of view.',
          example: 'We must examine the situation from an international perspective.',
          translation_pt: 'Perspectiva, ponto de vista',
        },
      ],
      grammar_lab: {
        topic: 'Estrutura Gramatical Alvo',
        rule_explanation: 'Regras e fórmulas para uso espontâneo e correto na conversação.',
        formula: 'Subject + Modal + Base Verb',
        common_mistakes: ['Evitar a tradução literal palavra por palavra do português.'],
        examples: ['You should clarify the details before signing.'],
      },
      quizzes: [
        {
          id: 'q-1',
          prompt: 'Qual opção soa mais natural e polida no ambiente profissional?',
          question_type: 'multiple_choice',
          options: ['I want you give me discount.', 'Could you provide a breakdown of the rates?', 'You must make cheaper.'],
          correct_answer: 'Could you provide a breakdown of the rates?',
          explanation: '"Could you provide..." demonstra tato e diplomacia no inglês formal.',
        },
      ],
      flashcards: [
        {
          id: 'fc-1',
          front: 'Perspective',
          ipa: '/pɚˈspek.tɪv/',
          back: 'A particular point of view or way of assessing a situation.',
          example: 'She shared a fresh perspective on product innovation.',
        },
      ],
      custom_html: '',
      custom_css: '',
    }
  );

  // Formulário do Assistente de IA
  const [aiForm, setAiForm] = useState({
    cefr_level: 'B2',
    topic: 'Atendimento ao Cliente e Desescalonamento de Conflitos',
    department: 'Business English',
    age_group: 'Adultos',
    duration_minutes: 60,
    target_grammar: 'Condicionais e voz passiva polida para mediar reclamações',
    vocabulary_focus: 'empathize, acknowledge, rectify, compromise, resolution, procedure',
    learning_objectives: 'Acalmar clientes insatisfeitos com linguagem diplomática e empatia',
    skills: ['Speaking', 'Listening', 'Diplomatic Vocabulary'],
  });

  const handleGenerateAiLesson = async () => {
    setIsGeneratingAi(true);
    setAiError(null);
    try {
      const res = await fetch('/api/gemini/generate-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aiForm),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Falha ao gerar o plano de aula com a IA Gemini');
      }

      const generated = data.lesson;
      setLessonData((prev) => ({
        ...prev,
        title: generated.title || prev.title,
        slug: (generated.title || 'lesson').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        cefr_level: (generated.cefr_level as CEFRLevelId) || prev.cefr_level,
        department: (generated.department as DepartmentType) || prev.department,
        duration_minutes: generated.duration_minutes || prev.duration_minutes,
        summary: generated.summary || prev.summary,
        learning_objectives: generated.learning_objectives || prev.learning_objectives,
        language_focus: generated.language_focus || prev.language_focus,
        teacher_version: {
          ...prev.teacher_version,
          ...(generated.teacher_version || {}),
        },
        student_version: {
          ...prev.student_version,
          ...(generated.student_version || {}),
        },
        vocabulary_list: generated.vocabulary_list || prev.vocabulary_list,
        grammar_lab: generated.grammar_lab || prev.grammar_lab,
        quizzes: (generated.quiz || []).map((q: any, i: number) => ({
          id: `q-ai-${i}`,
          prompt: q.prompt,
          question_type: q.question_type || 'multiple_choice',
          options: q.options || [],
          correct_answer: q.correct_answer,
          explanation: q.explanation,
        })),
        flashcards: (generated.flashcards || []).map((f: any, i: number) => ({
          id: `fc-ai-${i}`,
          front: f.front,
          ipa: f.ipa || '',
          back: f.back,
          example: f.example || '',
        })),
      }));

      setAiModalOpen(false);
      setStudioMode('visual');
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || 'Erro ao comunicar com o servidor da IA Gemini');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleSave = () => {
    onSaveLesson(lessonData);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleExportPDF = () => {
    const doc = generateLessonPDF(lessonData, 'COMPLETE_PACK');
    doc.save(`${lessonData.slug}-pacote-completo.pdf`);
  };

  const applyTemplate = (level: CEFRLevelId, dept: DepartmentType) => {
    setLessonData((prev) => ({
      ...prev,
      cefr_level: level,
      department: dept,
      title: `${level} • Plano de Aula: ${dept}`,
      slug: `${level.toLowerCase()}-${dept.toLowerCase().replace(/\s+/g, '-')}-modelo`,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Barra de Controle Superior */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBackToDashboard}
            className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 transition-all"
          >
            ← Voltar para Biblioteca
          </button>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
            <h2 className="font-extrabold text-base tracking-tight text-white">
              ESTÚDIO HTML & CONSTRUTOR DE AULAS
            </h2>
          </div>
        </div>

        {/* Alternador de Modo Central */}
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setStudioMode('visual')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 transition-all ${
              studioMode === 'visual'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Construtor Visual</span>
          </button>

          <button
            onClick={() => setStudioMode('code')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 transition-all ${
              studioMode === 'code'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Código HTML & CSS</span>
          </button>

          <button
            onClick={() => setStudioMode('preview')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 transition-all ${
              studioMode === 'preview'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Prévia em Tempo Real</span>
          </button>
        </div>

        {/* Botões de Ação na Direita */}
        <div className="flex items-center space-x-2">
          {/* Assistente IA */}
          <button
            onClick={() => setAiModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-purple-600/30 transition-all active:scale-95"
          >
            <Wand2 className="w-3.5 h-3.5 text-purple-200" />
            <span>Criar com IA (Gemini)</span>
          </button>

          {/* Exportar PDF */}
          <button
            onClick={handleExportPDF}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all text-xs"
            title="Baixar PDF A4 do Plano Completo"
          >
            <FileDown className="w-4 h-4 text-purple-400" />
          </button>

          {/* Salvar */}
          <button
            onClick={handleSave}
            className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1.5 transition-all active:scale-95 shadow-md shadow-emerald-600/20"
          >
            {savedNotice ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{savedNotice ? 'Salvo!' : 'Salvar Aula'}</span>
          </button>
        </div>
      </div>

      {/* Corpo Principal do Estúdio */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        
        {/* MODO 1: CONSTRUTOR VISUAL */}
        {studioMode === 'visual' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Coluna Esquerda: Metadados */}
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="text-sm font-extrabold text-purple-400 uppercase tracking-wider">
                  Identificação da Aula
                </h3>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Título do Plano de Aula</label>
                  <input
                    type="text"
                    value={lessonData.title}
                    onChange={(e) => setLessonData({ ...lessonData, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Nível CEFR</label>
                    <select
                      value={lessonData.cefr_level}
                      onChange={(e) => setLessonData({ ...lessonData, cefr_level: e.target.value as CEFRLevelId })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    >
                      {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((lvl) => (
                        <option key={lvl} value={lvl}>
                          Nível {lvl}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Departamento</label>
                    <select
                      value={lessonData.department}
                      onChange={(e) => setLessonData({ ...lessonData, department: e.target.value as DepartmentType })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="CEFR">CEFR Padrão</option>
                      <option value="Business English">Business English</option>
                      <option value="English for Kids">Inglês para Crianças (Kids)</option>
                      <option value="Grammar Lab">Laboratório de Gramática</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Duração (minutos)</label>
                    <input
                      type="number"
                      value={lessonData.duration_minutes}
                      onChange={(e) => setLessonData({ ...lessonData, duration_minutes: parseInt(e.target.value) || 60 })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Público / Faixa Etária</label>
                    <input
                      type="text"
                      value={lessonData.age_group}
                      onChange={(e) => setLessonData({ ...lessonData, age_group: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Resumo Pedagógico</label>
                  <textarea
                    rows={3}
                    value={lessonData.summary}
                    onChange={(e) => setLessonData({ ...lessonData, summary: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Foco Linguístico / Gramática</label>
                  <input
                    type="text"
                    value={lessonData.language_focus}
                    onChange={(e) => setLessonData({ ...lessonData, language_focus: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Modelos Prontos em 1 Clique */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Inserir Estrutura Pré-Formatada
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => applyTemplate('A1', 'English for Kids')}
                    className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left"
                  >
                    <span className="font-bold text-emerald-400 block">A1 Kids TPR</span>
                    <span className="text-[10px] text-slate-400">Fonética & Cantigas</span>
                  </button>
                  <button
                    onClick={() => applyTemplate('B2', 'Business English')}
                    className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left"
                  >
                    <span className="font-bold text-violet-400 block">B2 Business</span>
                    <span className="text-[10px] text-slate-400">Negociação & Reuniões</span>
                  </button>
                  <button
                    onClick={() => applyTemplate('B1', 'CEFR')}
                    className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left"
                  >
                    <span className="font-bold text-blue-400 block">B1 Conversação</span>
                    <span className="text-[10px] text-slate-400">Tempos Verbais</span>
                  </button>
                  <button
                    onClick={() => applyTemplate('C1', 'CEFR')}
                    className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left"
                  >
                    <span className="font-bold text-pink-400 block">C1 Retórica</span>
                    <span className="text-[10px] text-slate-400">Inversões & Clefts</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Colunas Direitas: Etapas do Professor & Ficha do Aluno */}
            <div className="lg:col-span-2 space-y-6">
              {/* Etapas CELTA do Professor */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-extrabold text-purple-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <BookOpen className="w-4 h-4" />
                    <span>Etapas Pedagógicas do Professor (CELTA / DELTA)</span>
                  </h3>
                  <span className="text-[11px] text-slate-400">Minutagem & Roteiro</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-purple-300 font-bold block mb-1">
                      Etapa 1: Warm-up & Quebra-gelo (5 min)
                    </label>
                    <textarea
                      rows={2}
                      value={lessonData.teacher_version.warmup}
                      onChange={(e) =>
                        setLessonData({
                          ...lessonData,
                          teacher_version: { ...lessonData.teacher_version, warmup: e.target.value },
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="text-purple-300 font-bold block mb-1">
                      Etapa 2: Contextualização / Lead-in (10 min)
                    </label>
                    <textarea
                      rows={2}
                      value={lessonData.teacher_version.lead_in}
                      onChange={(e) =>
                        setLessonData({
                          ...lessonData,
                          teacher_version: { ...lessonData.teacher_version, lead_in: e.target.value },
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="text-purple-300 font-bold block mb-1">
                      Etapa 3: Apresentação da Linguagem (Meaning, Form, Pronunciation) (15 min)
                    </label>
                    <textarea
                      rows={3}
                      value={lessonData.teacher_version.presentation}
                      onChange={(e) =>
                        setLessonData({
                          ...lessonData,
                          teacher_version: { ...lessonData.teacher_version, presentation: e.target.value },
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="text-purple-300 font-bold block mb-1">
                      Etapa 4: Prática Controlada (10 min)
                    </label>
                    <textarea
                      rows={2}
                      value={lessonData.teacher_version.controlled_practice}
                      onChange={(e) =>
                        setLessonData({
                          ...lessonData,
                          teacher_version: { ...lessonData.teacher_version, controlled_practice: e.target.value },
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="text-purple-300 font-bold block mb-1">
                      Etapa 5: Produção Livre & Conversação (15 min)
                    </label>
                    <textarea
                      rows={3}
                      value={lessonData.teacher_version.communicative_practice}
                      onChange={(e) =>
                        setLessonData({
                          ...lessonData,
                          teacher_version: { ...lessonData.teacher_version, communicative_practice: e.target.value },
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="text-purple-300 font-bold block mb-1">
                      Etapa 6: Encerramento & Feedback Corretivo (5 min)
                    </label>
                    <textarea
                      rows={2}
                      value={lessonData.teacher_version.wrap_up}
                      onChange={(e) =>
                        setLessonData({
                          ...lessonData,
                          teacher_version: { ...lessonData.teacher_version, wrap_up: e.target.value },
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Material do Aluno */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-extrabold text-indigo-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <Layers className="w-4 h-4" />
                    <span>Conteúdo da Ficha do Aluno</span>
                  </h3>
                  <span className="text-[11px] text-slate-400">Impresso no PDF do aluno</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-indigo-300 font-bold block mb-1">Texto de Leitura & Discussão</label>
                    <textarea
                      rows={3}
                      value={lessonData.student_version.reading_text}
                      onChange={(e) =>
                        setLessonData({
                          ...lessonData,
                          student_version: { ...lessonData.student_version, reading_text: e.target.value },
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-indigo-300 font-bold block mb-1">Exercícios Gramaticais & Lacunas</label>
                    <textarea
                      rows={3}
                      value={lessonData.student_version.grammar_exercises}
                      onChange={(e) =>
                        setLessonData({
                          ...lessonData,
                          student_version: { ...lessonData.student_version, grammar_exercises: e.target.value },
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODO 2: EDITOR DE CÓDIGO HTML */}
        {studioMode === 'code' && (
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-purple-400 uppercase tracking-wider">
                  Editor de Código HTML & CSS
                </h3>
                <p className="text-xs text-slate-400">
                  Insira tags HTML personalizadas, tabelas estilizadas ou componentes sob medida.
                </p>
              </div>
            </div>

            <textarea
              rows={18}
              value={lessonData.custom_html || ''}
              onChange={(e) => setLessonData({ ...lessonData, custom_html: e.target.value })}
              placeholder="<!-- Digite ou cole seu HTML aqui. Classes Tailwind são suportadas diretamente -->"
              className="w-full font-mono text-xs bg-slate-950 border border-slate-800 rounded-xl p-4 text-emerald-300 focus:outline-none focus:border-purple-500 leading-relaxed"
            />
          </div>
        )}

        {/* MODO 3: PRÉVIA EM TEMPO REAL */}
        {studioMode === 'preview' && (
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black px-3 py-1 rounded-full bg-purple-600/20 text-purple-300 border border-purple-500/30">
                  {lessonData.cefr_level}
                </span>
                <h3 className="text-xl font-bold text-white">{lessonData.title}</h3>
              </div>

              <div className="flex items-center space-x-2 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setPreviewTab('teacher')}
                  className={`px-3 py-1 rounded-lg font-bold ${
                    previewTab === 'teacher' ? 'bg-purple-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Visão do Professor
                </button>
                <button
                  onClick={() => setPreviewTab('student')}
                  className={`px-3 py-1 rounded-lg font-bold ${
                    previewTab === 'student' ? 'bg-purple-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Visão do Aluno
                </button>
              </div>
            </div>

            {lessonData.custom_html ? (
              <div
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: lessonData.custom_html }}
              />
            ) : previewTab === 'teacher' ? (
              <div className="space-y-4 text-xs sm:text-sm">
                <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30">
                  <h4 className="font-bold text-purple-300 mb-1">Warm-up (Aquecimento):</h4>
                  <p className="text-slate-200">{lessonData.teacher_version.warmup}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <h4 className="font-bold text-purple-300 mb-1">Apresentação:</h4>
                  <p className="text-slate-200">{lessonData.teacher_version.presentation}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <h4 className="font-bold text-purple-300 mb-1">Produção Livre:</h4>
                  <p className="text-slate-200">{lessonData.teacher_version.communicative_practice}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs sm:text-sm">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <h4 className="font-bold text-indigo-300 mb-1">Texto de Leitura:</h4>
                  <p className="text-slate-200">{lessonData.student_version.reading_text}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <h4 className="font-bold text-indigo-300 mb-1">Exercícios Gramaticais:</h4>
                  <p className="text-slate-200">{lessonData.student_version.grammar_exercises}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL DO ASSISTENTE DE IA (GEMINI 3.8 FLASH) */}
      {aiModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
                  <Wand2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">Criador de Aulas com Inteligência Artificial</h3>
                  <p className="text-[11px] text-purple-400 font-mono">Gemini 3.8 Flash • Metodologia CELTA</p>
                </div>
              </div>
              <button
                onClick={() => setAiModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            {aiError && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-300">
                {aiError}
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Tema da Aula / Objetivo Comunicativo</label>
                <input
                  type="text"
                  value={aiForm.topic}
                  onChange={(e) => setAiForm({ ...aiForm, topic: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Nível CEFR</label>
                  <select
                    value={aiForm.cefr_level}
                    onChange={(e) => setAiForm({ ...aiForm, cefr_level: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white focus:outline-none"
                  >
                    {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((lvl) => (
                      <option key={lvl} value={lvl}>
                        Nível {lvl}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Departamento</label>
                  <select
                    value={aiForm.department}
                    onChange={(e) => setAiForm({ ...aiForm, department: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white focus:outline-none"
                  >
                    <option value="Business English">Business English</option>
                    <option value="CEFR">CEFR Padrão</option>
                    <option value="English for Kids">Inglês para Crianças (Kids)</option>
                    <option value="Grammar Lab">Laboratório de Gramática</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Gramática Alvo</label>
                <input
                  type="text"
                  value={aiForm.target_grammar}
                  onChange={(e) => setAiForm({ ...aiForm, target_grammar: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Vocabulário Chave (separado por vírgula)</label>
                <input
                  type="text"
                  value={aiForm.vocabulary_focus}
                  onChange={(e) => setAiForm({ ...aiForm, vocabulary_focus: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-3">
              <button
                onClick={() => setAiModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancelar
              </button>

              <button
                onClick={handleGenerateAiLesson}
                disabled={isGeneratingAi}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-purple-600/30 transition-all"
              >
                {isGeneratingAi ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Escrevendo Plano com IA...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Gerar Plano de Aula Completo</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
