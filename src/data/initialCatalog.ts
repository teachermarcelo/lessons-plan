import { Lesson, CEFRLevelInfo } from '../types/fluent';

export const CEFR_LEVELS: CEFRLevelInfo[] = [
  {
    id: 'A1',
    name: 'Beginner',
    description: 'Can understand and use familiar everyday expressions and very basic phrases.',
    order_index: 1,
    color_badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    accent_gradient: 'from-emerald-500 to-teal-700',
  },
  {
    id: 'A2',
    name: 'Elementary',
    description: 'Can understand sentences and frequently used expressions related to areas of immediate relevance.',
    order_index: 2,
    color_badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    accent_gradient: 'from-cyan-500 to-blue-700',
  },
  {
    id: 'B1',
    name: 'Intermediate',
    description: 'Can understand the main points of clear standard input on familiar matters regularly encountered.',
    order_index: 3,
    color_badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    accent_gradient: 'from-blue-500 to-indigo-700',
  },
  {
    id: 'B2',
    name: 'Upper Intermediate',
    description: 'Can understand the main ideas of complex text and interact with a degree of fluency with native speakers.',
    order_index: 4,
    color_badge: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
    accent_gradient: 'from-violet-500 to-purple-800',
  },
  {
    id: 'C1',
    name: 'Advanced',
    description: 'Can understand a wide range of demanding clauses and recognize implicit meaning in academic & professional settings.',
    order_index: 5,
    color_badge: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    accent_gradient: 'from-pink-500 to-rose-700',
  },
  {
    id: 'C2',
    name: 'Proficiency',
    description: 'Can understand with ease virtually everything heard or read; can express themselves spontaneously and precisely.',
    order_index: 6,
    color_badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    accent_gradient: 'from-amber-500 to-orange-700',
  },
];

export const INITIAL_LESSONS: Lesson[] = [
  {
    id: 'les-b2-negotiations',
    title: 'Strategic Negotiations: Bargaining & Concession Anchoring',
    slug: 'strategic-negotiations-bargaining-concessions',
    cefr_level: 'B2',
    department: 'Business English',
    category: 'Negotiations',
    age_group: 'Adults',
    duration_minutes: 60,
    difficulty: 'Upper Intermediate',
    learning_objectives: [
      'Master tactical diplomatic language for conditional bargaining',
      'Use anchoring phrases to introduce proposals without alienating counterparts',
      'Structure win-win compromises using mixed modal phrases',
    ],
    language_focus: 'Conditional bargaining (If you can..., we might consider...; Provided that...; On condition that...)',
    skills_covered: ['Speaking', 'Listening', 'Strategic Vocabulary', 'Role-Play'],
    tags: ['Business English', 'B2', 'Corporate', 'Negotiation', 'Role-play'],
    summary: 'A complete corporate lesson preparing professionals to bargain confidently, introduce conditional offers, and protect margins during client negotiations.',
    cover_image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    is_published: true,
    published_at: '2026-11-01T10:00:00Z',
    view_count: 342,
    download_count: 189,
    drive_url: 'https://drive.google.com/drive/folders/fluent-immersion-b2-negotiations',
    slides_url: 'https://docs.google.com/presentation/d/e/2PACX-1vS-fluent-b2-negotiations-deck/pub',
    youtube_url: 'https://www.youtube.com/watch?v=r0XgqS87r0A',
    custom_html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 24px; border-radius: 18px; max-width: 680px; margin: 0 auto; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
  <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #334155; padding-bottom:12px; margin-bottom:20px;">
    <div>
      <span style="font-size:11px; font-weight:800; color:#a855f7; text-transform:uppercase; letter-spacing:1px;">FLUENT IMMERSION • B2 Business English</span>
      <h2 style="margin:4px 0 0; font-size:20px; font-weight:800; color:#ffffff;">Simulador de Negociação Estratégica</h2>
    </div>
    <div style="text-align:right;">
      <span id="score" style="background:#8b5cf6; color:white; font-size:13px; font-weight:800; padding:6px 12px; border-radius:12px; display:inline-block;">Leverage: 100%</span>
    </div>
  </div>

  <div style="background:#1e293b; padding:16px; border-radius:14px; margin-bottom:20px; border-left:4px solid #a855f7;">
    <div style="font-size:11px; color:#94a3b8; font-weight:700; text-transform:uppercase;">Cenário do Cliente:</div>
    <p style="margin:6px 0 0; font-size:14px; color:#e2e8f0; line-height:1.5;">
      <em>"Seu preço anual é R$ 120.000. Nosso orçamento máximo aprovado pela diretoria é R$ 100.000. Se não puder fechar por R$ 100.000, teremos que assinar com seu concorrente."</em>
    </p>
  </div>

  <div style="margin-bottom:18px;">
    <label style="font-size:12px; font-weight:700; color:#cbd5e1; display:block; margin-bottom:8px;">Qual a melhor resposta diplomática e condicional?</label>
    
    <button onclick="chooseOption(1)" style="width:100%; text-align:left; background:#1e293b; border:1px solid #334155; color:#f1f5f9; padding:12px 16px; border-radius:12px; margin-bottom:8px; cursor:pointer; font-size:13px; transition:0.2s;" onmouseover="this.style.borderColor='#a855f7'" onmouseout="this.style.borderColor='#334155'">
      A) "Okay, we can accept R$ 100.000 if you sign today."
    </button>
    
    <button onclick="chooseOption(2)" style="width:100%; text-align:left; background:#1e293b; border:1px solid #334155; color:#f1f5f9; padding:12px 16px; border-radius:12px; margin-bottom:8px; cursor:pointer; font-size:13px; transition:0.2s;" onmouseover="this.style.borderColor='#a855f7'" onmouseout="this.style.borderColor='#334155'">
      B) "Provided that we scale the contract to a 24-month term and standard support SLA, we might be positioned to consider your budget target."
    </button>

    <button onclick="chooseOption(3)" style="width:100%; text-align:left; background:#1e293b; border:1px solid #334155; color:#f1f5f9; padding:12px 16px; border-radius:12px; margin-bottom:8px; cursor:pointer; font-size:13px; transition:0.2s;" onmouseover="this.style.borderColor='#a855f7'" onmouseout="this.style.borderColor='#334155'">
      C) "No way, our product is much superior to the competition."
    </button>
  </div>

  <div id="feedback" style="display:none; padding:14px; border-radius:12px; font-size:13px; line-height:1.4; margin-bottom:16px;"></div>

  <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #334155; padding-top:14px;">
    <button onclick="speakFormula()" style="background:#334155; color:#e2e8f0; border:none; padding:8px 14px; border-radius:10px; font-size:12px; cursor:pointer; font-weight:600; display:inline-flex; align-items:center; gap:6px;">
      🔊 Ouvir Frase em Inglês Nativo
    </button>
    <button onclick="resetSim()" style="background:transparent; color:#94a3b8; border:1px solid #475569; padding:8px 14px; border-radius:10px; font-size:12px; cursor:pointer;">
      🔄 Reiniciar
    </button>
  </div>

  <script>
    function chooseOption(num) {
      const fb = document.getElementById('feedback');
      const sc = document.getElementById('score');
      fb.style.display = 'block';
      if (num === 2) {
        fb.style.background = '#064e3b';
        fb.style.color = '#a7f3d0';
        fb.style.border = '1px solid #059669';
        fb.innerHTML = '<strong>Excelente! Resposta de Alto Nível (B2/C1).</strong> Você ancorou uma contrapartida de 24 meses para conceder o desconto, mantendo margem e autoridade!';
        sc.innerText = 'Leverage: 150% (Vitória!)';
        sc.style.background = '#10b981';
      } else if (num === 1) {
        fb.style.background = '#7f1d1d';
        fb.style.color = '#fecaca';
        fb.style.border = '1px solid #dc2626';
        fb.innerHTML = '<strong>Cuidado: Você cedeu R$ 20.000 sem pedir nada em troca!</strong> Em Business English, nunca reduza o preço sem negociar prazo ou volume.';
        sc.innerText = 'Leverage: 50% (Perdeu margem)';
        sc.style.background = '#ef4444';
      } else {
        fb.style.background = '#7f1d1d';
        fb.style.color = '#fecaca';
        fb.style.border = '1px solid #dc2626';
        fb.innerHTML = '<strong>Muito agressivo!</strong> Rompe o relacionamento profissional com o cliente.';
        sc.innerText = 'Leverage: 0% (Impasse)';
        sc.style.background = '#ef4444';
      }
    }

    function speakFormula() {
      if ('speechSynthesis' in window) {
        const u = new SpeechSynthesisUtterance("Provided that we scale to a 24 month term, we might be positioned to consider your budget target.");
        u.lang = 'en-US';
        u.rate = 0.9;
        window.speechSynthesis.speak(u);
      }
    }

    function resetSim() {
      document.getElementById('feedback').style.display = 'none';
      document.getElementById('score').innerText = 'Leverage: 100%';
      document.getElementById('score').style.background = '#8b5cf6';
    }
  </script>
</div>`,
    teacher_version: {
      warmup: 'Ask students: "When was the last time you negotiated a price, contract, or deadline? Did you achieve your goal, or did you give away too much too soon?" (5 mins)',
      lead_in: 'Display three common negotiation scenarios on screen: 1) Salary increase, 2) Software vendor renewal, 3) Real estate purchase. Ask pairs to rank them by psychological difficulty and identify who holds leverage. (10 mins)',
      presentation: 'Present the "Conditional Concession Formula": IF + Present Simple, WE COULD/MIGHT + Bare Infinitive. Contrast blunt language ("We want 10% off") with diplomat-level persuasion ("Provided delivery is accelerated, we would be positioned to consider your standard volume tier"). (15 mins)',
      controlled_practice: 'Distribute Sentence Transformation worksheet. Students rewrite 6 rigid demands into polite conditional trade-offs. Teacher monitors and checks intonation. (10 mins)',
      communicative_practice: 'The Alpha-Omega Vendor Simulation: Student A is a Corporate Procurement Director needing a 15% discount; Student B is a SaaS Account Executive constrained by a 5% cap but able to bundle free premium training and dedicated SLA. Conduct 10-minute live negotiation. (15 mins)',
      wrap_up: 'Pairs report agreed terms. Teacher conducts delayed error correction on modal hedging, pronunciation of silent syllables, and business etiquette. (5 mins)',
      homework: 'Draft a 150-word formal follow-up negotiation recap email summarizing concessions made and next steps.',
      materials_needed: ['Role-play briefing cards', 'Audio clip: London board meeting excerpt', 'Worksheet 01-B2'],
      teaching_tips: [
        'Emphasize falling-rising intonation on conditional clauses to avoid sounding aggressive.',
        'Discourage students from saying "yes" immediately; coach them to use "That depends on what we can agree regarding..."',
      ],
      timing_breakdown: [
        { stage: 'Warm-up & Schema Activation', minutes: 5 },
        { stage: 'Contextual Lead-in & Scenario Ranking', minutes: 10 },
        { stage: 'Form & Formula Presentation', minutes: 15 },
        { stage: 'Controlled Transformation Task', minutes: 10 },
        { stage: 'Two-Way Role-Play Simulation', minutes: 15 },
        { stage: 'Delayed Error Correction & Wrap-up', minutes: 5 },
      ],
      answer_keys: {
        'task-1': 'Provided that you can guarantee expedited delivery, we might consider accepting your standard rate.',
        'task-2': 'As long as the payment term is 60 days, we are open to signing the annual agreement.',
      },
    },
    student_version: {
      reading_text: 'Negotiation in international commerce is rarely a game of ultimatums. Senior negotiators understand that anchoring—stating the opening position clearly while allowing room for conditional trade-offs—sets the psychological boundaries of any deal. The key is never giving away value for free. Every concession granted must be tethered to a counter-benefit from the other side.',
      vocab_activities: 'Match the business collocations: 1. Anchor (a. a deadlock), 2. Grant (b. a price proposal), 3. Break (c. a concession). Write your own sentence for each pair in the space provided.',
      grammar_exercises: 'Complete the sentence using "Provided that", "As long as", or "On condition that": \n1. We will sign the agreement ________ you extend the warranty to 24 months.\n2. ________ that payment is processed via wire transfer, the onboarding fee will be waived.',
      speaking_prompts: [
        'What is your personal negotiation style: competitive, collaborative, or accommodating?',
        'Role-play: You are renewing your cloud hosting contract. Try to secure 2 extra months free without increasing your monthly payment.',
      ],
      homework: 'Write an email following up on a simulated contract dispute, proposing two mutually beneficial compromises.',
    },
    vocabulary_list: [
      {
        term: 'Anchor',
        ipa: '/ˈæŋ.kɚ/',
        definition: 'To establish a reference point or opening price from which subsequent discussions will pivot.',
        example: 'The supplier decided to anchor high to leave sufficient room for concessions.',
        translation_pt: 'Fixar uma âncora / valor de referência inicial',
      },
      {
        term: 'Concession',
        ipa: '/kənˈseʃ.ən/',
        definition: 'Something granted, especially in response to demands or to resolve an impasse.',
        example: 'We cannot make any further concessions on payment deadlines.',
        translation_pt: 'Concessão, cessão mútua',
      },
      {
        term: 'Leverage',
        ipa: '/ˈlev.ɚ.ɪdʒ/',
        definition: 'Power or ability to influence people and get the results you desire.',
        example: 'Having three competing vendor offers gave our team tremendous leverage.',
        translation_pt: 'Poder de barganha, alavancagem',
      },
      {
        term: 'Impasse',
        ipa: '/ˈɪm.pæs/',
        definition: 'A situation in which no progress is possible, especially because of disagreement; a deadlock.',
        example: 'After four hours of talks, the negotiations reached an impasse over indemnities.',
        translation_pt: 'Impasse, beco sem saída',
      },
      {
        term: 'Counter-offer',
        ipa: '/ˈkaʊn.tɚˌɑː.fɚ/',
        definition: 'An offer made in response to another offer which was considered unsatisfactory.',
        example: 'Our board reviewed the tender and submitted an aggressive counter-offer.',
        translation_pt: 'Contraproposta',
      },
    ],
    grammar_lab: {
      topic: 'Conditionals in Diplomatic Business Discourse',
      rule_explanation: 'In corporate negotiations, absolute statements sound abrasive. Native executives substitute "If you do X, I will do Y" with subjunctive or softened forms: "Provided that...", "As long as...", or "Should you be willing to...".',
      formula: 'Provided that / As long as + Present Simple, [Subject] + would / could / might + Infinitive',
      common_mistakes: [
        'Mistake: "If you give discount, we sign today." -> Correction: "Provided you can adjust the unit price, we would be prepared to sign today."',
        'Mistake: "We will only agree if..." -> Correction: "We would gladly agree on condition that..."',
      ],
      examples: [
        'Provided that payment terms remain net 30, we would be delighted to finalize the partnership.',
        'Should unexpected delays occur, the penalty clause would be reviewed amicably.',
      ],
    },
    quizzes: [
      {
        id: 'q-neg-1',
        prompt: 'Which phrase is the most polite and professional way to propose a conditional concession?',
        question_type: 'multiple_choice',
        options: [
          'Give us 10% off or we are leaving the room.',
          'Provided that delivery is guaranteed by Friday, we would be open to your rate.',
          'If you want our deal, you must obey our terms.',
          'We need discount right now.',
        ],
        correct_answer: 'Provided that delivery is guaranteed by Friday, we would be open to your rate.',
        explanation: '"Provided that" combined with "would be open to" demonstrates high-level B2/C1 diplomatic tact.',
      },
      {
        id: 'q-neg-2',
        prompt: 'True or False: "Anchoring" means immediately conceding to the other party\'s first request.',
        question_type: 'true_false',
        options: ['True', 'False'],
        correct_answer: 'False',
        explanation: 'Anchoring is establishing the initial baseline number or position that sets the psychological framework for bargaining.',
      },
      {
        id: 'q-neg-3',
        prompt: 'Fill in the blank: "We reached a total ________ when neither side would compromise on licensing rights."',
        question_type: 'fill_blank',
        options: ['impasse', 'anchor', 'leverage', 'counter-part'],
        correct_answer: 'impasse',
        explanation: 'An impasse denotes a complete deadlock in negotiations.',
      },
    ],
    flashcards: [
      {
        id: 'fc-1',
        front: 'Anchor (v.)',
        ipa: '/ˈæŋ.kɚ/',
        back: 'To set an initial reference point in a negotiation to influence all subsequent offers.',
        example: 'By anchoring at $50,000, she guided the counter-offers upward.',
      },
      {
        id: 'fc-2',
        front: 'Concession (n.)',
        ipa: '/kənˈseʃ.ən/',
        back: 'Something surrendered or agreed to in order to reach a compromise.',
        example: 'Each concession was strictly conditional upon a bulk order.',
      },
      {
        id: 'fc-3',
        front: 'Break an impasse (idiom)',
        ipa: '/breɪk ən ˈɪm.pæs/',
        back: 'To resolve a deadlock and enable negotiations to move forward.',
        example: 'Introducing a flexible delivery schedule broke the impasse.',
      },
    ],
    discussion_questions: [
      'In your culture, is hard bargaining considered acceptable or disrespectful?',
      'How do you prepare psychologically before stepping into an important negotiation?',
      'Have you ever walked away from a deal? What was the deal-breaker?',
    ],
  },
  {
    id: 'les-b1-present-perfect',
    title: 'Life Milestones: Present Perfect vs. Simple Past',
    slug: 'life-milestones-present-perfect-vs-simple-past',
    cefr_level: 'B1',
    department: 'CEFR',
    category: 'Grammar Lab',
    age_group: 'Adults & Teens',
    duration_minutes: 50,
    difficulty: 'Intermediate',
    learning_objectives: [
      'Contrast indefinite past experiences (Present Perfect) with definite time markers (Simple Past)',
      'Accurately use "ever", "never", "already", "yet", "since", and "for"',
      'Engage in dynamic biographical interviews with peers',
    ],
    language_focus: 'Have/Has + Past Participle vs. Past Simple (V2) with specific time indicators (yesterday, in 2021, when I was 10)',
    skills_covered: ['Grammar', 'Speaking', 'Listening', 'Accuracy'],
    tags: ['CEFR B1', 'Grammar', 'Speaking', 'Present Perfect', 'Everyday English'],
    summary: 'A definitive, high-engagement B1 lesson clarifying the classic trap between completed past actions with exact timestamps and ongoing life experiences connecting to now.',
    cover_image_url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
    is_published: true,
    published_at: '2026-11-02T14:00:00Z',
    view_count: 512,
    download_count: 310,
    teacher_version: {
      warmup: 'Show pictures of an airport passport with stamps. Ask: "Have you ever traveled to an English-speaking country? Where did you go?" Note students\' verb tense shifts on board. (5 mins)',
      lead_in: 'Conduct a "Find Someone Who" quick round. Give students 3 cards: "Has ridden a horse", "Has met a celebrity", "Has lived abroad". (10 mins)',
      presentation: 'Draw the classic Timeline diagram: Unfinished life period (birth -> now) vs Closed container in the past. Highlight the trigger question: "Did you mention WHEN?" If YES -> Past Simple. If NO / Unfinished -> Present Perfect. (15 mins)',
      controlled_practice: 'Tense correction drill. Students identify and correct 5 intentional errors in student sample sentences. (10 mins)',
      communicative_practice: '"The Two Truths and a Lie: Life Stories Edition". Students prepare 3 statements using Present Perfect. Peers cross-examine them using Past Simple questions ("When did that happen? Who were you with?") to catch the lie. (15 mins)',
      wrap_up: 'Praise accurate tense shifting. Review irregular past participles (written, spoken, chosen, flown). (5 mins)',
      homework: 'Write a 120-word biography of someone inspiring, using at least 4 Present Perfect and 4 Past Simple sentences.',
      materials_needed: ['Timeline flashcards', 'Two Truths question cards', 'Worksheet 02-B1'],
      teaching_tips: [
        'Watch out for the Brazilian Portuguese interference: "I have lived here for 3 years" -> Portuguese speakers often say "I live here for 3 years" or "I lived".',
      ],
    },
    student_version: {
      reading_text: 'Sarah is an environmental photojournalist. In the past decade, she has traveled to thirty-four countries and documented endangered species across four continents. However, her career began in 2015 when she purchased her first DSLR camera at a garage sale in Portland. Last year, she won the National Geographic Wildlife Award for her Arctic fox series.',
      vocab_activities: 'Highlight all verbs in the text. Sort them into two columns: [Actions with a specific past time] and [Life experiences connected to the present].',
      grammar_exercises: 'Fill in with the correct form of the verb: \n1. I ________ (see) that film twice, but I ________ (not like) the ending.\n2. She ________ (live) in London since 2022.',
      speaking_prompts: [
        'Have you ever tried an extreme sport like skydiving or surfing?',
        'What is the most memorable concert you have ever attended?',
      ],
      homework: 'Draft a short paragraph about your three biggest achievements so far.',
    },
    vocabulary_list: [
      {
        term: 'Milestone',
        ipa: '/ˈmaɪl.stoʊn/',
        definition: 'A significant stage or event in the development of something or someone.',
        example: 'Graduating college was an unforgettable milestone in his life.',
        translation_pt: 'Marco histórico, conquista importante',
      },
      {
        term: 'So far',
        ipa: '/soʊ fɑːr/',
        definition: 'Until now; up to the present moment.',
        example: 'We have received over two hundred applications so far.',
        translation_pt: 'Até agora, até o presente momento',
      },
      {
        term: 'Endangered',
        ipa: '/ɪnˈdeɪn.dʒɚd/',
        definition: 'At serious risk of extinction or disappearance.',
        example: 'She has photographed endangered wildlife across the Amazon.',
        translation_pt: 'Ameaçado de extinção',
      },
    ],
    grammar_lab: {
      topic: 'Present Perfect vs. Past Simple',
      rule_explanation: 'Use the Present Perfect for life experiences without mentioning a specific time, or actions that continue until now. Switch immediately to the Past Simple when you specify when it occurred.',
      formula: 'Have/Has + Past Participle (indefinite) vs. Subject + V2 (definite timestamp)',
      common_mistakes: [
        'Mistake: "I have seen him yesterday." -> Correction: "I saw him yesterday."',
        'Mistake: "I live here since 2018." -> Correction: "I have lived here since 2018."',
      ],
      examples: [
        'Have you ever eaten oysters? - Yes, I ate them in Marseille two years ago.',
        'He has worked at this school for a decade.',
      ],
    },
    quizzes: [
      {
        id: 'q-pp-1',
        prompt: 'Which sentence correctly follows standard CEFR B1 grammar rules?',
        question_type: 'multiple_choice',
        options: [
          'I have visited Tokyo in 2019.',
          'I visited Tokyo in 2019.',
          'I was visiting Tokyo in 2019 two times.',
          'I have visit Tokyo yesterday.',
        ],
        correct_answer: 'I visited Tokyo in 2019.',
        explanation: 'Because the specific year (2019) is given, we must use the Simple Past ("visited"), not the Present Perfect.',
      },
    ],
    flashcards: [
      {
        id: 'fc-pp-1',
        front: 'Since vs. For',
        back: '"Since" + starting point (since Monday, since 2012). "For" + duration of time (for 3 days, for 5 years).',
        example: 'I have studied English since 2020 / for four years.',
      },
    ],
    discussion_questions: [
      'What is something you have always wanted to do but haven\'t done yet?',
      'Who is the most famous person you have ever met in person?',
    ],
  },
  {
    id: 'les-kids-jungle-animals',
    title: 'The Colorful Jungle: Animals, Sounds & Movement Rhymes',
    slug: 'the-colorful-jungle-animals-sounds-movement',
    cefr_level: 'A1',
    department: 'English for Kids',
    category: 'Animals',
    age_group: 'Ages 3-5',
    duration_minutes: 40,
    difficulty: 'Beginner',
    learning_objectives: [
      'Recognize and name 6 jungle animals: lion, monkey, snake, elephant, parrot, frog',
      'Associate animal movements with action verbs: jump, swing, roar, slither, stamp',
      'Sing and act out the "Jungle Safari Movement Chant"',
    ],
    language_focus: 'Action verbs and animal names: "The lion roars! The monkey swings! Can you jump like a frog?"',
    skills_covered: ['Listening', 'Speaking', 'Total Physical Response (TPR)', 'Chants'],
    tags: ['Kids', 'Ages 3-5', 'Animals', 'TPR', 'Songs', 'Phonics'],
    summary: 'A joyful, high-energy Total Physical Response (TPR) lesson plan for early learners, blending colorful flashcards, animal movements, sound mimicry, and a memorable action chant.',
    cover_image_url: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=800&q=80',
    is_published: true,
    published_at: '2026-11-03T09:00:00Z',
    view_count: 670,
    download_count: 420,
    teacher_version: {
      warmup: 'The Mystery Sound Box: Teacher plays animal sound effects (roar, screech, hiss). Children guess what creature is hiding inside the jungle basket. (5 mins)',
      lead_in: 'Unveil big colorful flashcards one by one. Ask children: "What color is this frog? Green! What does he do? Boing! Boing!" (5 mins)',
      presentation: 'TPR Animal Drill: Introduce 4 body movements. "When I say LION, we put our claws up and ROAR! When I say MONKEY, we scratch our sides and giggle!" Repeat with increasing speed. (10 mins)',
      controlled_practice: '"Teacher Says" (Simon Says variation): Teacher gives commands: "Jump like a frog!", "Slither like a snake!". Anyone who moves when Teacher doesn\'t say the animal does 3 silly claps. (10 mins)',
      communicative_practice: 'The Animal Train Safari: Children form a train, walk around the room chanting: "We are walking through the jungle, what do we see? I see a BIG ELEPHANT looking at me!" (7 mins)',
      wrap_up: 'Calm-down circle: Children color their favorite animal on the printable coloring sheet while listening to soft rainforest sounds. (3 mins)',
      homework: 'Show their parents their animal drawing and teach them the lion roar in English!',
      materials_needed: ['Animal soundboard audio', 'Animal flashcards with high contrast', 'Crayons & Jungle coloring sheets'],
      teaching_tips: [
        'Use excessive facial expressions and vocal variation—early learners learn vocabulary best through full-body embodiment.',
        'Keep verbal instructions under 5 words per command.',
      ],
    },
    student_version: {
      reading_text: 'Look at the green frog. Jump, frog, jump! Look at the big lion. Roar, lion, roar! The monkey loves bananas. Swing in the tree, little monkey!',
      vocab_activities: 'Match the animal with its favorite food or movement by drawing a line with your green crayon!',
      grammar_exercises: 'Circle the correct animal picture: \n1. It is big and gray with a long trunk (Elephant) \n2. It is yellow with a fluffy mane (Lion)',
      speaking_prompts: [
        'Show me how a monkey moves!',
        'Make the sound of a roaring lion!',
      ],
      homework: 'Color the jungle elephant worksheet with your family.',
    },
    vocabulary_list: [
      {
        term: 'Lion',
        ipa: '/ˈlaɪ.ən/',
        definition: 'A large wild cat with a golden mane that lives in grasslands.',
        example: 'The lion says ROAR!',
        translation_pt: 'Leão',
      },
      {
        term: 'Monkey',
        ipa: '/ˈmʌŋ.ki/',
        definition: 'A playful animal with a long tail that swings from branches.',
        example: 'The little monkey swings in the tall tree.',
        translation_pt: 'Macaco',
      },
      {
        term: 'Elephant',
        ipa: '/ˈel.ə.fənt/',
        definition: 'A very big gray animal with a long trunk and large ears.',
        example: 'The elephant stamps his heavy feet.',
        translation_pt: 'Elefante',
      },
    ],
    quizzes: [
      {
        id: 'q-kids-1',
        prompt: 'Which animal says "ROAR" and has a big golden mane?',
        question_type: 'multiple_choice',
        options: ['The Lion', 'The Frog', 'The Snake'],
        correct_answer: 'The Lion',
        explanation: 'Lions are known as the kings of the jungle and make a loud roar!',
      },
    ],
    flashcards: [
      {
        id: 'fc-kids-1',
        front: 'Lion 🦁',
        ipa: '/ˈlaɪ.ən/',
        back: 'Roars loudly and has a beautiful mane!',
        example: 'The brave lion protects his family.',
      },
      {
        id: 'fc-kids-2',
        front: 'Monkey 🐒',
        ipa: '/ˈmʌŋ.ki/',
        back: 'Swings through trees and loves bananas!',
        example: 'The funny monkey eats a sweet fruit.',
      },
    ],
    discussion_questions: [
      'What is your favorite animal in the entire world?',
      'If you could be an animal for one day, which one would you choose?',
    ],
  },
  {
    id: 'les-a1-first-day',
    title: 'First Day in English: Essential Greetings & The Verb To Be',
    slug: 'first-day-english-essential-greetings-verb-to-be',
    cefr_level: 'A1',
    department: 'CEFR',
    category: 'Everyday English',
    age_group: 'Adults & Teens',
    duration_minutes: 50,
    difficulty: 'Beginner',
    learning_objectives: [
      'Greet peers formally and casually throughout different times of day',
      'Introduce oneself and state nationality, profession, and hometown using "am", "is", "are"',
      'Ask and answer essential introductory questions: "What is your name?", "Where are you from?"',
    ],
    language_focus: 'Subject Pronouns (I, you, he, she, it, we, they) + Verb "To Be" (affirmative, negative, and question forms)',
    skills_covered: ['Speaking', 'Listening', 'Pronunciation', 'Basic Writing'],
    tags: ['A1', 'Beginner', 'Greetings', 'Verb To Be', 'Icebreaker'],
    summary: 'The ultimate zero-to-hero first lesson for beginners. Builds confidence immediately with clear sentence frames, pronunciation drills for contractions, and an icebreaker bingo.',
    cover_image_url: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80',
    is_published: true,
    published_at: '2026-11-04T08:00:00Z',
    view_count: 820,
    download_count: 590,
    drive_url: 'https://drive.google.com/drive/folders/fluent-immersion-a1-first-day-pack',
    slides_url: 'https://docs.google.com/presentation/d/e/2PACX-1vS-fluent-a1-icebreaker/pub',
    youtube_url: 'https://www.youtube.com/watch?v=Fw0rdSHzWFY',
    custom_html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 24px; border-radius: 18px; max-width: 680px; margin: 0 auto; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
  <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #334155; padding-bottom:12px; margin-bottom:20px;">
    <div>
      <span style="font-size:11px; font-weight:800; color:#10b981; text-transform:uppercase; letter-spacing:1px;">FLUENT IMMERSION • Nível A1 Iniciante</span>
      <h2 style="margin:4px 0 0; font-size:20px; font-weight:800; color:#ffffff;">Prática Interativa: Saudações & To Be</h2>
    </div>
    <span id="score-a1" style="background:#10b981; color:white; font-size:13px; font-weight:800; padding:6px 12px; border-radius:12px;">Acertos: 0/3</span>
  </div>

  <div style="background:#1e293b; padding:16px; border-radius:14px; margin-bottom:20px;">
    <p style="margin:0; font-size:13px; color:#cbd5e1;">
      Clique no cumprimento correto para o horário do dia indicado:
    </p>
  </div>

  <div>
    <div style="margin-bottom:16px;">
      <p style="font-size:13px; font-weight:700; color:#f8fafc; margin-bottom:8px;">1. São 08:30 da manhã. O que você diz ao entrar na sala?</p>
      <div style="display:flex; gap:8px; flex-wrap:wrap;">
        <button onclick="checkA1(1, 'a', this)" style="background:#334155; color:white; border:none; padding:10px 16px; border-radius:10px; cursor:pointer; font-size:13px; transition:0.2s;">Good morning! ☀️</button>
        <button onclick="checkA1(1, 'b', this)" style="background:#334155; color:white; border:none; padding:10px 16px; border-radius:10px; cursor:pointer; font-size:13px; transition:0.2s;">Good evening! 🌙</button>
        <button onclick="checkA1(1, 'c', this)" style="background:#334155; color:white; border:none; padding:10px 16px; border-radius:10px; cursor:pointer; font-size:13px; transition:0.2s;">Good night! 😴</button>
      </div>
    </div>

    <div style="margin-bottom:16px;">
      <p style="font-size:13px; font-weight:700; color:#f8fafc; margin-bottom:8px;">2. Complete a frase: "Hello, I _____ your English teacher."</p>
      <div style="display:flex; gap:8px; flex-wrap:wrap;">
        <button onclick="checkA1(2, 'a', this)" style="background:#334155; color:white; border:none; padding:10px 16px; border-radius:10px; cursor:pointer; font-size:13px; transition:0.2s;">is</button>
        <button onclick="checkA1(2, 'b', this)" style="background:#334155; color:white; border:none; padding:10px 16px; border-radius:10px; cursor:pointer; font-size:13px; transition:0.2s;">am</button>
        <button onclick="checkA1(2, 'c', this)" style="background:#334155; color:white; border:none; padding:10px 16px; border-radius:10px; cursor:pointer; font-size:13px; transition:0.2s;">are</button>
      </div>
    </div>

    <div style="margin-bottom:16px;">
      <p style="font-size:13px; font-weight:700; color:#f8fafc; margin-bottom:8px;">3. Complete: "Where _____ you from?"</p>
      <div style="display:flex; gap:8px; flex-wrap:wrap;">
        <button onclick="checkA1(3, 'a', this)" style="background:#334155; color:white; border:none; padding:10px 16px; border-radius:10px; cursor:pointer; font-size:13px; transition:0.2s;">are</button>
        <button onclick="checkA1(3, 'b', this)" style="background:#334155; color:white; border:none; padding:10px 16px; border-radius:10px; cursor:pointer; font-size:13px; transition:0.2s;">am</button>
        <button onclick="checkA1(3, 'c', this)" style="background:#334155; color:white; border:none; padding:10px 16px; border-radius:10px; cursor:pointer; font-size:13px; transition:0.2s;">is</button>
      </div>
    </div>
  </div>

  <div id="feedback-a1" style="display:none; padding:14px; border-radius:12px; font-size:13px; margin-top:16px; border:1px solid #059669; background:#064e3b; color:#a7f3d0;">
    🎉 <strong>Parabéns!</strong> Você dominou as saudações e o verbo To Be desta primeira aula!
  </div>

  <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #334155; padding-top:14px; margin-top:16px;">
    <button onclick="speakA1()" style="background:#334155; color:#e2e8f0; border:none; padding:8px 14px; border-radius:10px; font-size:12px; cursor:pointer; font-weight:600;">
      🔊 Ouvir Áudio Nativo
    </button>
    <button onclick="location.reload()" style="background:transparent; color:#94a3b8; border:1px solid #475569; padding:8px 14px; border-radius:10px; font-size:12px; cursor:pointer;">
      🔄 Reiniciar
    </button>
  </div>

  <script>
    let correctCount = 0;
    const answered = {};

    function checkA1(q, opt, btn) {
      if (answered[q]) return;
      const parent = btn.parentElement;
      const btns = parent.querySelectorAll('button');
      const isCorrect = (q === 1 && opt === 'a') || (q === 2 && opt === 'b') || (q === 3 && opt === 'a');
      
      btns.forEach(b => b.style.opacity = '0.5');
      if (isCorrect) {
        btn.style.background = '#10b981';
        btn.style.opacity = '1';
        correctCount++;
        answered[q] = true;
      } else {
        btn.style.background = '#ef4444';
        btn.style.opacity = '1';
        answered[q] = true;
      }
      document.getElementById('score-a1').innerText = 'Acertos: ' + correctCount + '/3';
      if (correctCount === 3) {
        document.getElementById('feedback-a1').style.display = 'block';
      }
    }

    function speakA1() {
      if ('speechSynthesis' in window) {
        const u = new SpeechSynthesisUtterance("Good morning! Hello, I am your English teacher. Where are you from?");
        u.lang = 'en-US';
        u.rate = 0.85;
        window.speechSynthesis.speak(u);
      }
    }
  </script>
</div>`,
    teacher_version: {
      warmup: 'Smile and write your name on the board: "Hello! My name is [Teacher Name]. I am your English teacher." Model the gesture of pointing to yourself. (5 mins)',
      lead_in: 'Choral repetition of greetings: Good morning (sun rising gesture), Good afternoon, Good evening, Hi, Hello. Contrast casual "Hey!" with professional "Good morning". (10 mins)',
      presentation: 'Introduce the Verb To Be matrix: I am, You are, He/She/It is, We are, They are. Model contractions: I\'m, You\'re, He\'s, She\'s. Drill phonetics: /aɪm/, /jʊər/, /hiːz/. (15 mins)',
      controlled_practice: 'Fill-in-the-blank mini card activity. Students match subject cards with matching verb cards (e.g., "They" -> "are"). (10 mins)',
      communicative_practice: '"The Speed Networking Circle": Students have 1 minute to introduce themselves to 3 classmates: "Hi, I\'m Lucas. I\'m from Curitiba. Nice to meet you!" (8 mins)',
      wrap_up: 'Celebrate first English conversation. Review the 3 core greetings. (2 mins)',
      homework: 'Write 4 sentences introducing family members using "He is..." and "She is...".',
      materials_needed: ['Name tags', 'Subject-Verb color cards', 'Student Worksheet A1-01'],
      teaching_tips: [
        'Keep your Teacher Talking Time (TTT) strictly below 30%. Get students vocalizing immediately.',
      ],
    },
    student_version: {
      reading_text: 'Hello! My name is Daniel. I am 28 years old and I am a software engineer from São Paulo. This is my friend Elena. She is an architect from Madrid. We are students in this English class together. It is very nice to meet you!',
      vocab_activities: 'Complete the introductions with am / is / are: \n1. I ________ Maria.\n2. Carlos ________ from Colombia.\n3. We ________ happy to be here.',
      grammar_exercises: 'Turn into negative sentences: \n1. He is a doctor. -> He is not a doctor.\n2. They are from Canada. -> ____________________',
      speaking_prompts: [
        'Introduce yourself to the student next to you: Name, city, and job.',
        'Ask your teacher where they are from.',
      ],
      homework: 'Complete the profile card with your personal information in English.',
    },
    vocabulary_list: [
      {
        term: 'Nice to meet you',
        ipa: '/naɪs tuː miːt juː/',
        definition: 'A polite expression used when introduced to someone for the first time.',
        example: 'Hello, Mr. Smith. Nice to meet you.',
        translation_pt: 'Prazer em conhecê-lo(a)',
      },
      {
        term: 'Hometown',
        ipa: '/ˈhoʊm.taʊn/',
        definition: 'The town or city where a person was born or grew up.',
        example: 'My hometown is Salvador, Bahia.',
        translation_pt: 'Cidade natal',
      },
    ],
    quizzes: [
      {
        id: 'q-a1-1',
        prompt: 'Choose the correct sentence:',
        question_type: 'multiple_choice',
        options: [
          'They is from Brazil.',
          'They are from Brazil.',
          'They am from Brazil.',
          'They be from Brazil.',
        ],
        correct_answer: 'They are from Brazil.',
        explanation: 'The pronoun "They" takes the plural form "are".',
      },
    ],
    flashcards: [
      {
        id: 'fc-a1-1',
        front: 'I am -> Contraction?',
        back: 'I\'m (pronounced /aɪm/)',
        example: 'I\'m very happy to meet you.',
      },
    ],
    discussion_questions: [
      'Why do you want to learn and master English?',
      'What is your favorite English word or phrase so far?',
    ],
  },
  {
    id: 'les-c1-advanced-inversion',
    title: 'Advanced Rhetoric: Negative Inversion & Cleft Sentences',
    slug: 'advanced-rhetoric-negative-inversion-cleft-sentences',
    cefr_level: 'C1',
    department: 'CEFR',
    category: 'Grammar Lab',
    age_group: 'Adults',
    duration_minutes: 60,
    difficulty: 'Advanced',
    learning_objectives: [
      'Master negative adverbial inversion for dramatic emphasis (Seldom, Rarely, Never before, Not only... but also)',
      'Construct Wh- and It-cleft sentences to focus attention on key discourse elements',
      'Deliver persuasive executive presentations with elevated linguistic impact',
    ],
    language_focus: 'Negative Inversion (Negative Adverb + Auxiliary + Subject + Main Verb) & Cleft Structures (What surprised us was... / It was the CEO who...)',
    skills_covered: ['Advanced Grammar', 'Public Speaking', 'Stylistic Nuance', 'Writing'],
    tags: ['C1', 'Advanced', 'Rhetoric', 'Inversion', 'Cleft Sentences'],
    summary: 'A masterclass in elevating spoken and written English from merely correct to undeniably compelling, teaching students how native speakers use structural shifts for emphasis.',
    cover_image_url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80',
    is_published: true,
    published_at: '2026-11-04T16:00:00Z',
    view_count: 290,
    download_count: 175,
    teacher_version: {
      warmup: 'Compare two sentences on the board: 1) "I have rarely seen such dedication." 2) "Rarely have I seen such dedication." Ask: Which sentence sounds like a keynote speaker inaugurating an international summit? (5 mins)',
      lead_in: 'Analyze an excerpt from Steve Jobs or Winston Churchill highlighting inversion and cleft sentences. (10 mins)',
      presentation: 'Break down the syntactic mechanics: Inversion copies question word order after restrictive adverbs (Hardly had we launched when... / Under no circumstances should you...). (15 mins)',
      controlled_practice: 'Rewrite 8 standard executive statements into inverted rhetorical power statements. (10 mins)',
      communicative_practice: '"The 2-Minute Keynote Challenge": Students deliver an impromptu pitch about innovation or leadership, embedding at least one inverted sentence and one cleft structure. Peers evaluate oratorical impact. (15 mins)',
      wrap_up: 'Class voting on most powerful rhetorical moment. Feedback on rhythm and pauses. (5 mins)',
      homework: 'Rewrite an article editorial substituting standard sentences with clefts and inversions.',
      materials_needed: ['Speech transcripts', 'Rhetorical formula guide', 'Evaluation rubric'],
      teaching_tips: [
        'Remind students that inversion is a spice: too much ruins the soup. Teach them to reserve it for climactic moments.',
      ],
    },
    student_version: {
      reading_text: 'Not until an organization confronts a severe disruption does its true resilience become apparent. What distinguishes visionary leadership from mere administrative oversight is the audacity to pivot before market trends dictate urgency. Rarely do companies thrive by clinging to outdated paradigms.',
      vocab_activities: 'Identify all inverted and cleft structures in the text above and rephrase them into colloquial standard English.',
      grammar_exercises: 'Rewrite using the prompt in brackets: \n1. We had scarcely arrived when the power went out. [Scarcely...] \n2. I only realized my mistake when I saw the final invoice. [Only when...]',
      speaking_prompts: [
        'Deliver a 60-second argument beginning with: "What the modern educational system needs most is..."',
      ],
      homework: 'Write an analytical executive memo containing 3 inverted structures.',
    },
    vocabulary_list: [
      {
        term: 'Scarcely',
        ipa: '/ˈsker.sli/',
        definition: 'Only just; almost not; hardly.',
        example: 'Scarcely had the merger been announced when share prices surged.',
        translation_pt: 'Mal, apenas, dificilmente',
      },
    ],
    quizzes: [
      {
        id: 'q-c1-1',
        prompt: 'Which sentence is syntactically inverted correctly?',
        question_type: 'multiple_choice',
        options: [
          'Under no circumstances you should share this confidential key.',
          'Under no circumstances should you share this confidential key.',
          'Under no circumstances should share you this confidential key.',
          'Under no circumstances you share this confidential key.',
        ],
        correct_answer: 'Under no circumstances should you share this confidential key.',
        explanation: 'Negative adverbs trigger question syntax: Negative phrase + modal auxiliary ("should") + subject ("you") + main verb ("share").',
      },
    ],
    flashcards: [
      {
        id: 'fc-c1-1',
        front: 'Seldom / Rarely + Inversion',
        back: 'Rarely + Auxiliary + Subject + Verb: "Rarely do we encounter such exemplary craftsmanship."',
        example: 'Seldom have I witnessed such dedication.',
      },
    ],
    discussion_questions: [
      'How does word order influence human emotion and perceived authority in public speaking?',
    ],
  },
];
