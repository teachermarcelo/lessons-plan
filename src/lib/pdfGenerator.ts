import { jsPDF } from 'jspdf';
import { Lesson } from '../types/fluent';

export type PDFExportType =
  | 'TEACHER_VERSION'
  | 'STUDENT_VERSION'
  | 'WORKSHEET'
  | 'FLASHCARDS'
  | 'ANSWER_KEY'
  | 'COMPLETE_PACK';

export const generateLessonPDF = (lesson: Lesson, type: PDFExportType): jsPDF => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = margin;

  // Helper: Draw Header & Brand
  const drawHeader = (title: string, subBadge: string) => {
    // Top banner
    doc.setFillColor(15, 23, 42); // Navy
    doc.rect(0, 0, pageWidth, 24, 'F');

    // Accent line
    doc.setFillColor(139, 92, 246); // Electric purple
    doc.rect(0, 24, pageWidth, 2, 'F');

    // Brand text
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('FLUENT IMMERSION', margin, 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(216, 180, 254);
    doc.text('TEACH SMARTER. TEACH BETTER. — www.fluentimmersion.com', margin, 18);

    // Badge on right
    doc.setFillColor(124, 58, 237);
    doc.roundedRect(pageWidth - margin - 45, 6, 45, 12, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(subBadge, pageWidth - margin - 22.5, 13.5, { align: 'center' });

    cursorY = 36;
  };

  // Helper: Draw Footer
  const drawFooter = () => {
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `FLUENT IMMERSION © 2026 • ${lesson.title} (${lesson.cefr_level})`,
        margin,
        pageHeight - 7
      );
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 7, {
        align: 'right',
      });
    }
  };

  // Helper: Auto-wrap text section
  const addSection = (title: string, bodyText: string, fillColor = [248, 250, 252]) => {
    if (cursorY > pageHeight - 40) {
      doc.addPage();
      cursorY = 20;
    }

    doc.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
    doc.roundedRect(margin, cursorY, contentWidth, 8, 1.5, 1.5, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(109, 40, 217);
    doc.text(title.toUpperCase(), margin + 3, cursorY + 5.5);
    cursorY += 12;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 41, 59);

    const splitText = doc.splitTextToSize(bodyText, contentWidth - 4);
    for (let line of splitText) {
      if (cursorY > pageHeight - 20) {
        doc.addPage();
        cursorY = 20;
      }
      doc.text(line, margin + 2, cursorY);
      cursorY += 5.2;
    }
    cursorY += 4;
  };

  // Build document according to selected export type
  if (type === 'TEACHER_VERSION' || type === 'COMPLETE_PACK') {
    drawHeader(lesson.title, `TEACHER • ${lesson.cefr_level}`);

    // Lesson meta box
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(15, 23, 42);
    doc.text(lesson.title, margin, cursorY);
    cursorY += 7;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(
      `CEFR Level: ${lesson.cefr_level} | Duration: ${lesson.duration_minutes} min | Audience: ${lesson.age_group} | Dept: ${lesson.department}`,
      margin,
      cursorY
    );
    cursorY += 8;

    addSection(
      'Learning Objectives & Pedagogical Focus',
      lesson.learning_objectives.map((obj, i) => `${i + 1}. ${obj}`).join('\n') +
        `\nLanguage Focus: ${lesson.language_focus}`
    );

    addSection('Stage 1: Warm-up & Schema Activation (5m)', lesson.teacher_version.warmup);
    addSection('Stage 2: Contextual Lead-In (10m)', lesson.teacher_version.lead_in);
    addSection('Stage 3: Language Presentation & Modeling (15m)', lesson.teacher_version.presentation);
    addSection('Stage 4: Controlled Practice (10m)', lesson.teacher_version.controlled_practice);
    addSection('Stage 5: Communicative Free Production (15m)', lesson.teacher_version.communicative_practice);
    addSection('Stage 6: Wrap-up & Delayed Feedback (5m)', lesson.teacher_version.wrap_up);
    addSection('Homework Assignment', lesson.teacher_version.homework);

    if (lesson.teacher_version.teaching_tips && lesson.teacher_version.teaching_tips.length > 0) {
      addSection(
        'Expert CELTA/DELTA Teaching Tips',
        lesson.teacher_version.teaching_tips.map((t) => `• ${t}`).join('\n'),
        [245, 243, 255]
      );
    }
  }

  if (type === 'STUDENT_VERSION') {
    drawHeader(lesson.title, `STUDENT • ${lesson.cefr_level}`);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(15, 23, 42);
    doc.text(lesson.title, margin, cursorY);
    cursorY += 7;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`Student Worksheet • Level: ${lesson.cefr_level} • Target: ${lesson.language_focus}`, margin, cursorY);
    cursorY += 8;

    addSection('Reading & Discussion Passage', lesson.student_version.reading_text);
    addSection('Vocabulary Lab & Collocations', lesson.student_version.vocab_activities);
    addSection('Grammar Exercises', lesson.student_version.grammar_exercises);
    addSection(
      'Communicative Speaking Tasks',
      lesson.student_version.speaking_prompts.map((p, i) => `Task ${i + 1}: ${p}`).join('\n\n')
    );
    addSection('Independent Practice / Homework', lesson.student_version.homework);
  }

  if (type === 'WORKSHEET') {
    drawHeader(lesson.title, `WORKSHEET • ${lesson.cefr_level}`);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(15, 23, 42);
    doc.text(`${lesson.title} — Printable Worksheet`, margin, cursorY);
    cursorY += 10;

    addSection('Section 1: Vocabulary & Definitions', lesson.student_version.vocab_activities);
    addSection('Section 2: Grammar & Sentence Construction', lesson.student_version.grammar_exercises);
    addSection('Section 3: Speaking Prompts for Pair Work', lesson.student_version.speaking_prompts.join('\n\n'));
  }

  if (type === 'FLASHCARDS') {
    drawHeader(lesson.title, `FLASHCARDS • ${lesson.cefr_level}`);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text('Printable Flashcard Study Cutouts', margin, cursorY);
    cursorY += 10;

    const cards = lesson.flashcards || [];
    cards.forEach((card, idx) => {
      if (cursorY > pageHeight - 35) {
        doc.addPage();
        cursorY = 20;
      }
      doc.setDrawColor(139, 92, 246);
      doc.setLineWidth(0.4);
      doc.roundedRect(margin, cursorY, contentWidth, 22, 2, 2, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(109, 40, 217);
      doc.text(`Card #${idx + 1}: ${card.front} ${card.ipa ? `(${card.ipa})` : ''}`, margin + 4, cursorY + 7);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      doc.text(`Definition: ${card.back}`, margin + 4, cursorY + 13);
      if (card.example) {
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(100, 116, 139);
        doc.text(`Example: "${card.example}"`, margin + 4, cursorY + 18);
      }
      cursorY += 26;
    });
  }

  if (type === 'ANSWER_KEY') {
    drawHeader(lesson.title, `CONFIDENTIAL • ANSWER KEY`);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(185, 28, 28); // Red
    doc.text('TEACHER CONFIDENTIAL — EXERCISE ANSWER KEY', margin, cursorY);
    cursorY += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text('Do not distribute this document to students. Answers are calibrated for CEFR accuracy.', margin, cursorY);
    cursorY += 10;

    if (lesson.quizzes && lesson.quizzes.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text('Quiz Solutions & Explanations:', margin, cursorY);
      cursorY += 7;

      lesson.quizzes.forEach((q, i) => {
        if (cursorY > pageHeight - 25) {
          doc.addPage();
          cursorY = 20;
        }
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(30, 41, 59);
        doc.text(`Q${i + 1}: ${q.prompt}`, margin, cursorY);
        cursorY += 5;

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(22, 101, 52); // Green
        doc.text(`Correct Answer: ${q.correct_answer}`, margin + 4, cursorY);
        cursorY += 4.5;

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 116, 139);
        doc.text(`Explanation: ${q.explanation}`, margin + 4, cursorY);
        cursorY += 7;
      });
    }

    if (lesson.teacher_version.answer_keys) {
      addSection(
        'Worksheet Solutions',
        Object.entries(lesson.teacher_version.answer_keys)
          .map(([k, v]) => `• ${k}: ${v}`)
          .join('\n')
      );
    }
  }

  drawFooter();
  return doc;
};
