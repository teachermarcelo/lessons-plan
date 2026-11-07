import React, { useState } from 'react';
import { 
  Sparkles, 
  Code, 
  Eye, 
  EyeOff,
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
  ArrowRight,
  Lock,
  KeyRound,
  ShieldCheck,
  FolderDown,
  Presentation,
  Youtube,
  Play,
  RotateCcw,
  FileUp,
  Upload,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { InteractiveHtmlViewer } from './InteractiveHtmlViewer';
import { Lesson, CEFRLevelId, DepartmentType, UserProfile } from '../types/fluent';
import { generateLessonPDF } from '../lib/pdfGenerator';
import { 
  MASTER_ADMIN_EMAIL, 
  DEFAULT_ADMIN_PASSWORD, 
  getStoredAdminPassword, 
  setStoredAdminPassword,
  DEFAULT_ADMIN_USER 
} from '../lib/supabase';

interface HtmlStudioProps {
  currentUser: UserProfile | null;
  onAdminLoginSuccess?: (adminUser: UserProfile) => void;
  initialLesson?: Lesson | null;
  onSaveLesson: (lesson: Lesson) => void;
  onPublishLesson: (lesson: Lesson) => void;
  onBackToDashboard: () => void;
}

export const HtmlStudio: React.FC<HtmlStudioProps> = ({
  currentUser,
  onAdminLoginSuccess,
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

  // Admin lock authentication state
  const isMaster = (currentUser?.email === MASTER_ADMIN_EMAIL || currentUser?.role === 'ADMIN') &&
    (typeof window !== 'undefined' && sessionStorage.getItem('fluent_admin_session_unlocked') === 'true');
  const [adminEmailInput, setAdminEmailInput] = useState<string>(() => {
    return currentUser?.role === 'ADMIN' && currentUser?.email ? currentUser.email : '';
  });
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [adminAuthError, setAdminAuthError] = useState<string | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);

  const handleAdminAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPass = getStoredAdminPassword();
    if (adminEmailInput.trim().toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase() && adminPasswordInput === storedPass) {
      try {
        sessionStorage.setItem('fluent_admin_session_unlocked', 'true');
      } catch (err) {}
      if (onAdminLoginSuccess) {
        onAdminLoginSuccess({
          ...DEFAULT_ADMIN_USER,
          email: MASTER_ADMIN_EMAIL,
        });
      }
      setAdminAuthError(null);
    } else {
      setAdminAuthError('Credenciais inválidas. Verifique o e-mail ou a senha do Administrador.');
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPasswordInput.length < 4) {
      setAdminAuthError('A nova senha deve ter no mínimo 4 caracteres.');
      return;
    }
    setStoredAdminPassword(newPasswordInput);
    setResetSuccessMessage('Senha do Administrador atualizada com sucesso!');
    setShowResetModal(false);
    setAdminPasswordInput(newPasswordInput);
  };


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
      setLessonData((prev: Lesson) => ({
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
    setLessonData((prev: Lesson) => ({
      ...prev,
      cefr_level: level,
      department: dept,
      title: `${level} • Plano de Aula: ${dept}`,
      slug: `${level.toLowerCase()}-${dept.toLowerCase().replace(/\s+/g, '-')}-modelo`,
    }));
  };

  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [importedFileInfo, setImportedFileInfo] = useState<{
    filename: string;
    title: string;
    level: string;
    department: string;
    topic: string;
  } | null>(null);

  const parseAndApplyHtmlFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const rawHtml = event.target?.result as string;
        if (!rawHtml) return;

        const parser = new DOMParser();
        const doc = parser.parseFromString(rawHtml, 'text/html');

        // 1. Título
        let extractedTitle = '';
        const metaTitle = doc.querySelector('meta[name="title"]')?.getAttribute('content') ||
                          doc.querySelector('meta[property="og:title"]')?.getAttribute('content');
        const h1 = doc.querySelector('h1')?.textContent?.trim();
        const docTitle = doc.querySelector('title')?.textContent?.trim();
        const dataTitle = doc.querySelector('[data-title]')?.getAttribute('data-title');

        if (dataTitle) extractedTitle = dataTitle;
        else if (metaTitle) extractedTitle = metaTitle;
        else if (h1) extractedTitle = h1;
        else if (docTitle && !docTitle.toLowerCase().includes('document') && !docTitle.toLowerCase().includes('untitled')) {
          extractedTitle = docTitle;
        } else {
          extractedTitle = file.name.replace(/\.html?$/i, '').replace(/[-_]/g, ' ');
          extractedTitle = extractedTitle.charAt(0).toUpperCase() + extractedTitle.slice(1);
        }

        // 2. Nível CEFR (A1, A2, B1, B2, C1, C2)
        let extractedLevel: CEFRLevelId | null = null;
        const dataCefr = doc.querySelector('[data-cefr]')?.getAttribute('data-cefr') ||
                         doc.querySelector('[data-level]')?.getAttribute('data-level');
        const metaCefr = doc.querySelector('meta[name="cefr"]')?.getAttribute('content') ||
                         doc.querySelector('meta[name="level"]')?.getAttribute('content');
        
        const levelCandidate = dataCefr || metaCefr;
        if (levelCandidate && /^(A1|A2|B1|B2|C1|C2)$/i.test(levelCandidate.trim())) {
          extractedLevel = levelCandidate.trim().toUpperCase() as CEFRLevelId;
        } else {
          const fullText = (rawHtml + ' ' + (doc.body?.textContent || '')).slice(0, 3500);
          const match = fullText.match(/(?:n[íi]vel|level|cefr)\s*[:•\-]?\s*(A1|A2|B1|B2|C1|C2)\b/i) ||
                        extractedTitle.match(/\b(A1|A2|B1|B2|C1|C2)\b/i);
          if (match && match[1]) {
            extractedLevel = match[1].toUpperCase() as CEFRLevelId;
          }
        }

        // 3. Categoria / Departamento
        let extractedDept: DepartmentType = 'CEFR';
        const dataDept = doc.querySelector('[data-department]')?.getAttribute('data-department') ||
                         doc.querySelector('[data-category]')?.getAttribute('data-category') ||
                         doc.querySelector('meta[name="category"]')?.getAttribute('content') ||
                         doc.querySelector('meta[name="department"]')?.getAttribute('content');
        
        const combinedContent = (rawHtml + ' ' + extractedTitle + ' ' + (doc.body?.textContent || '')).toLowerCase();

        if (dataDept) {
          if (/business|corporat/i.test(dataDept)) extractedDept = 'Business English';
          else if (/kids|infantil|criança/i.test(dataDept)) extractedDept = 'English for Kids';
          else if (/grammar|gram[áa]tica/i.test(dataDept)) extractedDept = 'Grammar Lab';
          else extractedDept = 'CEFR';
        } else {
          if (/business|negotiat|corporate|procurement|client|meeting|pitch|reunião|empresarial|venda/i.test(combinedContent)) {
            extractedDept = 'Business English';
          } else if (/kids|children|infantil|criança|animal|zoo|coloring|jungle|toy|brinquedo/i.test(combinedContent)) {
            extractedDept = 'English for Kids';
          } else if (/grammar|gramática|past simple|present perfect|passive voice|relative clause|inversion|modal/i.test(combinedContent)) {
            extractedDept = 'Grammar Lab';
          } else {
            extractedDept = 'CEFR';
          }
        }

        // 4. Foco Linguístico / Tópico
        let extractedTopic = '';
        const dataTopic = doc.querySelector('[data-topic]')?.getAttribute('data-topic') ||
                          doc.querySelector('[data-focus]')?.getAttribute('data-focus') ||
                          doc.querySelector('meta[name="focus"]')?.getAttribute('content') ||
                          doc.querySelector('meta[name="topic"]')?.getAttribute('content');
        
        if (dataTopic) {
          extractedTopic = dataTopic;
        } else {
          const topicMatch = rawHtml.match(/(?:foco lingu[íi]stico|language focus|grammar focus|t[óo]pico|topic)\s*[:•\-]?\s*([^\n<]+)/i);
          if (topicMatch && topicMatch[1]) {
            extractedTopic = topicMatch[1].trim();
          } else {
            const h2 = doc.querySelector('h2')?.textContent?.trim();
            if (h2 && h2 !== extractedTitle) extractedTopic = h2;
            else extractedTopic = extractedTitle;
          }
        }

        // 5. Resumo / Descrição
        let extractedSummary = '';
        const metaDesc = doc.querySelector('meta[name="description"]')?.getAttribute('content') ||
                         doc.querySelector('meta[property="og:description"]')?.getAttribute('content');
        const pLead = doc.querySelector('p.lead')?.textContent?.trim() || doc.querySelector('p')?.textContent?.trim();
        if (metaDesc) extractedSummary = metaDesc;
        else if (pLead && pLead.length > 20) extractedSummary = pLead;
        else extractedSummary = `Aula interativa completa em HTML com materiais práticos e exercícios para professores de inglês.`;

        // 6. Links externos embutidos (Drive, Slides, YouTube)
        let extractedDrive = '';
        let extractedSlides = '';
        let extractedYoutube = '';

        const allLinks = Array.from(doc.querySelectorAll('a[href]'));
        for (const a of allLinks) {
          const href = a.getAttribute('href') || '';
          if (!extractedDrive && /drive\.google\.com/i.test(href)) {
            extractedDrive = href;
          }
          if (!extractedSlides && /(docs\.google\.com\/presentation|canva\.com)/i.test(href)) {
            extractedSlides = href;
          }
          if (!extractedYoutube && /(youtube\.com\/watch|youtu\.be)/i.test(href)) {
            extractedYoutube = href;
          }
        }

        // Atualizar os dados da aula
        setLessonData((prev: Lesson) => ({
          ...prev,
          title: extractedTitle || prev.title,
          slug: (extractedTitle || prev.title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          cefr_level: extractedLevel || prev.cefr_level,
          department: extractedDept,
          language_focus: extractedTopic || prev.language_focus,
          summary: extractedSummary || prev.summary,
          custom_html: rawHtml,
          drive_url: extractedDrive || prev.drive_url,
          slides_url: extractedSlides || prev.slides_url,
          youtube_url: extractedYoutube || prev.youtube_url,
        }));

        setImportedFileInfo({
          filename: file.name,
          title: extractedTitle || lessonData.title,
          level: extractedLevel || lessonData.cefr_level,
          department: extractedDept,
          topic: extractedTopic || 'Tópico Geral',
        });

        // Alternar automaticamente para modo de código para conferência
        setStudioMode('code');
      } catch (err) {
        console.error('Erro ao ler arquivo HTML:', err);
        alert('Não foi possível processar o arquivo. Verifique se é um arquivo .html ou .htm válido.');
      }
    };
    reader.readAsText(file);
  };

  const handleHtmlFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      parseAndApplyHtmlFile(file);
    }
    e.target.value = '';
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    const file = e.dataTransfer.files?.[0];
    if (file && (file.name.endsWith('.html') || file.name.endsWith('.htm'))) {
      parseAndApplyHtmlFile(file);
    }
  };

  // BARREIRA DE ACESSO: ESTÚDIO EXCLUSIVO PARA O ADMIN (gestorpaid@gmail.com)
  if (!isMaster) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-purple-600/20 text-purple-400 border border-purple-500/40 flex items-center justify-center mx-auto shadow-lg shadow-purple-600/25">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[10px] font-extrabold text-orange-400 uppercase tracking-widest block mb-1">
              ÁREA RESTRITA AO ADMINISTRADOR
            </span>
            <h2 className="text-2xl font-black text-white">Estúdio HTML & Criação</h2>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              O Estúdio HTML e o Construtor com IA são ferramentas restritas de criação pedagógica da plataforma.
            </p>
          </div>

          {adminAuthError && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-300">
              {adminAuthError}
            </div>
          )}

          {resetSuccessMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300">
              {resetSuccessMessage}
            </div>
          )}

          <form onSubmit={handleAdminAuthSubmit} className="space-y-4 text-xs text-left">
            <div>
              <label className="text-slate-400 block mb-1">E-mail de Acesso</label>
              <input
                type="email"
                required
                value={adminEmailInput}
                placeholder="email@administrador.com"
                onChange={(e) => setAdminEmailInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 font-mono text-xs"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Senha de Acesso</label>
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={adminPasswordInput}
                  onChange={(e) => setAdminPasswordInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-4 pr-10 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded-lg"
                  title={showLoginPassword ? 'Ocultar senha' : 'Ver senha digitada'}
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4 text-purple-400" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center space-x-2 transition-all active:scale-95 cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>Desbloquear Estúdio HTML</span>
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
            <button
              onClick={onBackToDashboard}
              className="text-slate-400 hover:text-white"
            >
              ← Voltar para a Biblioteca
            </button>
            <span className="text-[11px] text-slate-500">
              Acesso Restrito
            </span>
          </div>
        </div>

        {/* Modal interno para redefinir senha */}
        {showResetModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 text-left space-y-4">
              <h3 className="font-bold text-base text-white">Redefinir Senha do Admin</h3>
              <p className="text-xs text-slate-400">
                Altere a senha mestre de acesso interno do Administrador:
              </p>
              <form onSubmit={handleResetPassword} className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-300 block mb-1">Nova Senha</label>
                  <div className="relative">
                    <input
                      type={showResetPassword ? 'text' : 'password'}
                      required
                      placeholder="Mínimo 4 caracteres"
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3 pr-10 py-2.5 text-white font-mono text-xs focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowResetPassword(!showResetPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                      title={showResetPassword ? 'Ocultar senha' : 'Ver senha digitada'}
                    >
                      {showResetPassword ? <EyeOff className="w-3.5 h-3.5 text-purple-400" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowResetModal(false)}
                    className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold"
                  >
                    Salvar Nova Senha
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

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
          {/* Botão de Upload de Arquivo HTML */}
          <label className="px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 hover:text-white border border-purple-500/40 text-xs font-bold flex items-center space-x-1.5 cursor-pointer transition-all shadow-sm active:scale-95">
            <FileUp className="w-3.5 h-3.5 text-purple-400" />
            <span>Carregar Arquivo HTML</span>
            <input
              type="file"
              accept=".html,.htm"
              onChange={handleHtmlFileInput}
              className="hidden"
            />
          </label>

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
        
        {/* Banner de Feedback quando um Arquivo HTML é Importado */}
        {importedFileInfo && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-purple-950/70 to-indigo-950/70 border border-purple-500/40 text-xs flex items-center justify-between flex-wrap gap-3 animate-in fade-in">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-purple-600/30 text-purple-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <span className="font-extrabold text-white text-sm block">
                  Arquivo HTML lido com sucesso: <span className="text-purple-300 font-mono">{importedFileInfo.filename}</span>
                </span>
                <span className="text-slate-300 text-[11px] block mt-0.5">
                  Preenchimento automático: Nível <strong className="text-emerald-400 font-bold">{importedFileInfo.level}</strong> • Categoria <strong className="text-indigo-400 font-bold">{importedFileInfo.department}</strong> • Tópico: "{importedFileInfo.topic}" • Título: "{importedFileInfo.title}"
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setStudioMode('preview')}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-emerald-600/30 transition-all active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Testar Aula no Sandbox</span>
              </button>
              <button
                onClick={() => setImportedFileInfo(null)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                title="Fechar aviso"
              >
                ✕
              </button>
            </div>
          </div>
        )}
        
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

              {/* RECURSOS MULTIMÍDIA PARA O PROFESSOR */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3.5">
                <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
                  <FolderDown className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Recursos Extras (Drive, Slides, YouTube)
                  </h4>
                </div>
                <p className="text-[11px] text-slate-400">
                  Insira os links para que os professores acessem materiais em nuvem e vídeos com 1 clique na aula.
                </p>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 flex items-center space-x-1.5 mb-1">
                    <FolderDown className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Link do Google Drive (Pasta de Fichas/Áudios)</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/drive/folders/..."
                    value={lessonData.drive_url || ''}
                    onChange={(e) => setLessonData({ ...lessonData, drive_url: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 flex items-center space-x-1.5 mb-1">
                    <Presentation className="w-3.5 h-3.5 text-amber-400" />
                    <span>Link de Slides (Google Slides ou Canva)</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://docs.google.com/presentation/d/.../edit"
                    value={lessonData.slides_url || ''}
                    onChange={(e) => setLessonData({ ...lessonData, slides_url: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 flex items-center space-x-1.5 mb-1">
                    <Youtube className="w-3.5 h-3.5 text-rose-400" />
                    <span>Link do Vídeo no YouTube (Listening / Debate)</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={lessonData.youtube_url || ''}
                    onChange={(e) => setLessonData({ ...lessonData, youtube_url: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-purple-500"
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
            <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-sm font-extrabold text-purple-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <Code className="w-4 h-4" />
                  <span>Editor de Código HTML & Interatividades</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Insira qualquer código HTML, CSS ou JavaScript. O visualizador isola o código em sandbox sem quebrar a plataforma.
                </p>
              </div>

              {/* Botão de teste direto */}
              <button
                onClick={() => setStudioMode('preview')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-emerald-600/25 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Testar Aula no Visualizador Sandbox</span>
              </button>
            </div>

            {/* Área de Upload / Arrastar Arquivo HTML */}
            <div 
              onDragOver={(e) => { e.preventDefault(); setIsDraggingFile(true); }}
              onDragLeave={() => setIsDraggingFile(false)}
              onDrop={handleFileDrop}
              className={`p-4 rounded-2xl border-2 border-dashed transition-all flex items-center justify-between flex-wrap gap-4 ${
                isDraggingFile 
                  ? 'border-purple-400 bg-purple-950/40 text-purple-200 ring-2 ring-purple-500/30' 
                  : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center space-x-3.5">
                <div className="p-3 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 shrink-0">
                  <FileUp className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white flex items-center space-x-2">
                    <span>Importar Arquivo Completo em HTML (.html / .htm)</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      Auto-Preenchimento Inteligente
                    </span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Carregue qualquer arquivo de aula: a plataforma extrai <strong>Nível (A1 a C2)</strong>, <strong>Categoria</strong>, <strong>Tópico/Foco</strong> e carrega o código no sandbox de testes.
                  </p>
                </div>
              </div>

              <label className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center space-x-2 cursor-pointer transition-all shadow-md shadow-purple-600/25 active:scale-95">
                <Upload className="w-4 h-4" />
                <span>Escolher Arquivo do PC</span>
                <input
                  type="file"
                  accept=".html,.htm"
                  onChange={handleHtmlFileInput}
                  className="hidden"
                />
              </label>
            </div>

            {/* Modelos de Código Rápido */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center space-x-2 flex-wrap gap-2 text-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Modelos Rápidos:
              </span>
              <button
                type="button"
                onClick={() => setLessonData({
                  ...lessonData,
                  custom_html: `<div class="max-w-2xl mx-auto p-6 bg-slate-900 text-white rounded-2xl border border-purple-500/30 font-sans shadow-xl">
  <div class="flex items-center space-x-2 text-purple-400 mb-4">
    <span class="text-xs font-bold uppercase tracking-wider bg-purple-500/20 px-3 py-1 rounded-full">Interactive Quiz</span>
    <span class="text-xs text-slate-400">Verificação Instantânea</span>
  </div>
  <h2 class="text-xl font-extrabold mb-2">Diplomatic Language in Business English</h2>
  <p class="text-sm text-slate-300 mb-6">Choose the most diplomatic conditional concession formula:</p>
  
  <div class="space-y-3" id="quiz-options">
    <button onclick="checkAnswer(0)" class="w-full text-left p-4 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-sm transition-all option-btn">
      A) "We want a 15% discount or we cancel the contract."
    </button>
    <button onclick="checkAnswer(1)" class="w-full text-left p-4 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-sm transition-all option-btn">
      B) "Provided that delivery is accelerated, we would be positioned to consider your standard volume tier."
    </button>
    <button onclick="checkAnswer(2)" class="w-full text-left p-4 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-sm transition-all option-btn">
      C) "Give us free onboarding and maybe we sign."
    </button>
  </div>
  
  <div id="feedback" class="mt-4 p-4 rounded-xl text-sm hidden font-medium"></div>

  <script>
    function checkAnswer(index) {
      const fb = document.getElementById('feedback');
      const buttons = document.querySelectorAll('.option-btn');
      buttons.forEach(b => b.classList.remove('border-emerald-500', 'border-rose-500', 'bg-emerald-950/40', 'bg-rose-950/40'));
      fb.classList.remove('hidden', 'bg-emerald-900/40', 'text-emerald-300', 'border-emerald-500/40', 'bg-rose-900/40', 'text-rose-300', 'border-rose-500/40');
      
      if (index === 1) {
        buttons[1].classList.add('border-emerald-500', 'bg-emerald-950/40');
        fb.className = 'mt-4 p-4 rounded-xl text-sm font-semibold bg-emerald-900/40 text-emerald-300 border border-emerald-500/40 block';
        fb.innerHTML = '🎉 <strong>Correto!</strong> O uso de <em>"Provided that..."</em> com o condicional <em>"we would be positioned to consider..."</em> estabelece uma concessão diplomática firme e sem atrito.';
      } else {
        buttons[index].classList.add('border-rose-500', 'bg-rose-950/40');
        fb.className = 'mt-4 p-4 rounded-xl text-sm font-semibold bg-rose-900/40 text-rose-300 border border-rose-500/40 block';
        fb.innerHTML = '❌ <strong>Incorreto.</strong> Linguagem muito agressiva ou informal para negociação corporativa B2. Tente a opção B.';
      }
    }
  </script>
</div>`
                })}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 font-semibold"
              >
                + Quiz com Pontuação
              </button>

              <button
                type="button"
                onClick={() => setLessonData({
                  ...lessonData,
                  custom_html: `<div class="max-w-2xl mx-auto p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 font-sans shadow-xl">
  <div class="inline-block text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full mb-3">Gap-Fill Challenge</div>
  <h3 class="text-lg font-bold mb-2">Preencha as Lacunas com as Palavras Corretas</h3>
  <p class="text-xs text-slate-400 mb-6">Complete a frase de negociação usando: <strong>anchoring, concession</strong>.</p>
  
  <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm leading-relaxed mb-4">
    "Setting an ambitious opening offer allows the negotiator to establish clear 
    <input id="blank1" type="text" placeholder="..." class="bg-slate-800 border border-slate-700 px-2 py-1 rounded text-purple-300 font-mono text-center w-28 mx-1 focus:outline-none focus:border-purple-500"> 
    before making any conditional 
    <input id="blank2" type="text" placeholder="..." class="bg-slate-800 border border-slate-700 px-2 py-1 rounded text-purple-300 font-mono text-center w-28 mx-1 focus:outline-none focus:border-purple-500">."
  </div>

  <div class="flex items-center space-x-2">
    <button onclick="verifyBlanks()" class="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-md">
      Verificar Resposta
    </button>
    <button onclick="resetBlanks()" class="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold">
      Limpar
    </button>
  </div>

  <div id="blank-result" class="mt-4 p-3 rounded-xl text-xs hidden"></div>

  <script>
    function verifyBlanks() {
      const b1 = document.getElementById('blank1').value.trim().toLowerCase();
      const b2 = document.getElementById('blank2').value.trim().toLowerCase();
      const res = document.getElementById('blank-result');
      
      const correct1 = b1 === 'anchoring' || b1 === 'leverage';
      const correct2 = b2 === 'concession';
      
      res.classList.remove('hidden');
      if (correct1 && correct2) {
        res.className = 'mt-4 p-3 rounded-xl text-xs bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-bold block';
        res.innerHTML = '✅ Parabéns! Respostas corretas: anchoring e concession.';
      } else {
        res.className = 'mt-4 p-3 rounded-xl text-xs bg-rose-950/60 border border-rose-500/40 text-rose-300 font-bold block';
        res.innerHTML = '⚠️ Quase lá! Dica: a primeira lacuna é "anchoring" e a segunda é "concession".';
      }
    }
    function resetBlanks() {
      document.getElementById('blank1').value = '';
      document.getElementById('blank2').value = '';
      document.getElementById('blank-result').classList.add('hidden');
    }
  </script>
</div>`
                })}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 font-semibold"
              >
                + Lacunas com Verificação
              </button>
            </div>

            <textarea
              rows={18}
              value={lessonData.custom_html || ''}
              onChange={(e) => setLessonData({ ...lessonData, custom_html: e.target.value })}
              placeholder="<!-- Cole aqui qualquer código HTML/CSS/JS. Ex: botões interativos, jogos, Canva, Genially ou tabelas -->"
              className="w-full font-mono text-xs bg-slate-950 border border-slate-800 rounded-xl p-4 text-emerald-300 focus:outline-none focus:border-purple-500 leading-relaxed"
            />
          </div>
        )}

        {/* MODO 3: PRÉVIA E TESTE DA AULA NO VISUALIZADOR SANDBOX */}
        {studioMode === 'preview' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  Visualizador Seguro & Testador de Interatividades
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{lessonData.title}</h3>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setStudioMode('code')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1"
                >
                  <Code className="w-3.5 h-3.5 text-purple-400" />
                  <span>Editar Código</span>
                </button>
                <button
                  onClick={() => setStudioMode('visual')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1"
                >
                  <Layout className="w-3.5 h-3.5 text-blue-400" />
                  <span>Editar Metadados & Links</span>
                </button>
              </div>
            </div>

            {/* Visualizador Sandbox Interativo que não vaza estilos nem scripts */}
            <InteractiveHtmlViewer
              htmlCode={lessonData.custom_html || `<div class="p-8 text-center"><h2 class="text-xl font-bold text-white">${lessonData.title}</h2><p class="text-slate-400 mt-2">${lessonData.summary}</p><div class="mt-6 p-4 bg-slate-800 rounded-xl text-left"><h4 class="font-bold text-purple-300">Warm-up:</h4><p class="text-slate-300 text-sm mt-1">${lessonData.teacher_version.warmup}</p></div></div>`}
              title={`Prévia: ${lessonData.title}`}
              heightClass="h-[620px]"
            />
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
