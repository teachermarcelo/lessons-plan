/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { DashboardView } from './components/DashboardView';
import { LessonModal } from './components/LessonModal';
import { HtmlStudio } from './components/HtmlStudio';
import { AdminCommandCenter } from './components/AdminCommandCenter';
import { SubscriptionModal } from './components/SubscriptionModal';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { AuthModal } from './components/AuthModal';
import { LegalModal } from './components/LegalModal';
import { Lesson, UserProfile, NotificationItem, Collection, EmailLog } from './types/fluent';
import { 
  getStoredUser, 
  setStoredUser, 
  getStoredLessons, 
  saveStoredLessons, 
  getStoredFavorites, 
  saveStoredFavorites, 
  getStoredCollections, 
  saveStoredCollections, 
  getStoredNotifications, 
  saveStoredNotifications, 
  getStoredEmailLogs, 
  saveStoredEmailLogs,
  DEFAULT_ADMIN_USER,
  DEFAULT_TEACHER_USER,
  DEFAULT_TRIAL_USER
} from './lib/supabase';
import { generateLessonPDF } from './lib/pdfGenerator';

export default function App() {
  // App state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(getStoredUser());
  const [currentView, setCurrentView] = useState<string>('landing');
  const [lessons, setLessons] = useState<Lesson[]>(getStoredLessons());
  const [favorites, setFavorites] = useState<string[]>(getStoredFavorites());
  const [collections, setCollections] = useState<Collection[]>(getStoredCollections());
  const [notifications, setNotifications] = useState<NotificationItem[]>(getStoredNotifications());
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>(getStoredEmailLogs());
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fluent_theme');
      if (saved) return saved === 'dark';
    }
    return true;
  });

  // Modals state
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [editingLessonInStudio, setEditingLessonInStudio] = useState<Lesson | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isSubscribeOpen, setIsSubscribeOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [legalModalType, setLegalModalType] = useState<'terms' | 'privacy' | null>(null);

  useEffect(() => {
    setStoredUser(currentUser);
  }, [currentUser]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('fluent_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('fluent_theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    saveStoredLessons(lessons);
  }, [lessons]);

  useEffect(() => {
    saveStoredFavorites(favorites);
  }, [favorites]);

  useEffect(() => {
    saveStoredNotifications(notifications);
  }, [notifications]);

  useEffect(() => {
    saveStoredEmailLogs(emailLogs);
  }, [emailLogs]);

  // Actions
  const handleToggleFavorite = (lessonId: string) => {
    if (favorites.includes(lessonId)) {
      setFavorites(favorites.filter((id) => id !== lessonId));
    } else {
      setFavorites([...favorites, lessonId]);
    }
  };

  const handleQuickDownloadPDF = (lesson: Lesson) => {
    const isSubscribed = currentUser?.subscription_status === 'active' || currentUser?.role === 'ADMIN';
    if (!isSubscribed) {
      setIsSubscribeOpen(true);
      return;
    }
    const doc = generateLessonPDF(lesson, 'COMPLETE_PACK');
    doc.save(`${lesson.slug}-complete-pack.pdf`);
  };

  const handleOpenStudio = (lessonToEdit?: Lesson) => {
    setEditingLessonInStudio(lessonToEdit || null);
    setCurrentView('html-studio');
  };

  const handleSaveLessonFromStudio = (savedLesson: Lesson) => {
    const exists = lessons.some((l) => l.id === savedLesson.id);
    if (exists) {
      setLessons(lessons.map((l) => (l.id === savedLesson.id ? savedLesson : l)));
    } else {
      setLessons([savedLesson, ...lessons]);
    }
  };

  const handlePublishLessonFromStudio = (publishedLesson: Lesson) => {
    handleSaveLessonFromStudio({ ...publishedLesson, is_published: true });

    // Automatically trigger notification for all members
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `New Lesson Available: ${publishedLesson.title}`,
      message: `A brand-new ${publishedLesson.cefr_level} lesson in ${publishedLesson.department} has been added to your library.`,
      category: publishedLesson.department.toLowerCase().includes('business') ? 'business' : 'new_lesson',
      link_url: `/lesson/${publishedLesson.slug}`,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    setNotifications([newNotif, ...notifications]);
  };

  const handleDuplicateLesson = (lesson: Lesson) => {
    const copy: Lesson = {
      ...lesson,
      id: `les-copy-${Date.now()}`,
      title: `${lesson.title} (Copy)`,
      slug: `${lesson.slug}-copy-${Date.now()}`,
      view_count: 0,
      download_count: 0,
    };
    setLessons([copy, ...lessons]);
    setSelectedLesson(copy);
  };

  const handleDeleteLesson = (lessonId: string) => {
    setLessons(lessons.filter((l) => l.id !== lessonId));
  };

  const handleTogglePublish = (lessonId: string) => {
    setLessons(
      lessons.map((l) => (l.id === lessonId ? { ...l, is_published: !l.is_published } : l))
    );
  };

  const handleSendBroadcastNotification = async (payload: {
    resourceTitle: string;
    cefrLevel: string;
    category: string;
    description: string;
  }) => {
    const res = await fetch('/api/resend/send-notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipients: [currentUser?.email || 'teacher@fluentimmersion.com'],
        resourceTitle: payload.resourceTitle,
        cefrLevel: payload.cefrLevel,
        category: payload.category,
        description: payload.description,
      }),
    });

    const data = await res.json();
    const newLog: EmailLog = {
      id: `em-log-${Date.now()}`,
      recipient_email: currentUser?.email || 'members@fluentimmersion.com',
      subject: `NEW LESSON AVAILABLE — FLUENT IMMERSION: ${payload.resourceTitle} (${payload.cefrLevel})`,
      notification_type: 'new_lesson',
      status: 'sent',
      provider_id: data.data?.id || `resend_${Date.now()}`,
      sent_at: new Date().toISOString(),
    };
    setEmailLogs([newLog, ...emailLogs]);
  };

  const handleActivateSubscription = (subscriptionId: string) => {
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        subscription_status: 'active',
        subscription_id: subscriptionId,
      });
    }
  };

  const handleSwitchUserRole = (role: 'ADMIN' | 'TEACHER_MEMBER' | 'TRIAL') => {
    if (role === 'ADMIN') {
      setCurrentUser(DEFAULT_ADMIN_USER);
    } else if (role === 'TEACHER_MEMBER') {
      setCurrentUser(DEFAULT_TEACHER_USER);
    } else {
      setCurrentUser(DEFAULT_TRIAL_USER);
    }
  };

  const handleSelectNotification = (item: NotificationItem) => {
    // If the notification corresponds to a known lesson, open that lesson modal
    const matchedLesson = lessons.find((l) => item.message.includes(l.title) || item.title.includes(l.title));
    if (matchedLesson) {
      setSelectedLesson(matchedLesson);
      setIsNotificationsOpen(false);
    }
  };

  const isSubscribed = currentUser?.subscription_status === 'active' || currentUser?.role === 'ADMIN';

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} flex flex-col font-sans transition-colors duration-200`}>
      {/* Global Top Navbar */}
      <Navbar
        currentUser={currentUser}
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'pricing') {
            setIsSubscribeOpen(true);
          } else {
            setCurrentView(view);
          }
        }}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenSubscribe={() => setIsSubscribeOpen(true)}
        onLogout={() => setCurrentUser(null)}
        onSwitchUser={handleSwitchUserRole}
        notifications={notifications}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Main Views */}
      <div className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            onSubscribe={() => setIsSubscribeOpen(true)}
            onSelectLesson={(lesson) => setSelectedLesson(lesson)}
            sampleLessons={lessons}
            onOpenStudio={() => handleOpenStudio()}
            onOpenAdmin={() => setCurrentView('admin')}
            onOpenLegal={(type) => setLegalModalType(type)}
          />
        )}

        {currentView === 'dashboard' && currentUser && (
          <DashboardView
            currentUser={currentUser}
            lessons={lessons}
            favorites={favorites}
            collections={collections}
            onToggleFavorite={handleToggleFavorite}
            onOpenLesson={(lesson) => setSelectedLesson(lesson)}
            onQuickDownloadPDF={handleQuickDownloadPDF}
            onOpenStudio={(lesson) => handleOpenStudio(lesson)}
            onOpenSubscribe={() => setIsSubscribeOpen(true)}
            onOpenAdmin={() => setCurrentView('admin')}
            onOpenLegal={(type) => setLegalModalType(type)}
          />
        )}

        {currentView === 'html-studio' && (
          <HtmlStudio
            currentUser={currentUser}
            onAdminLoginSuccess={(adminUser) => setCurrentUser(adminUser)}
            initialLesson={editingLessonInStudio}
            onSaveLesson={handleSaveLessonFromStudio}
            onPublishLesson={handlePublishLessonFromStudio}
            onBackToDashboard={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'admin' && (
          <AdminCommandCenter
            currentUser={currentUser}
            onAdminLoginSuccess={(adminUser) => setCurrentUser(adminUser)}
            lessons={lessons}
            emailLogs={emailLogs}
            onTogglePublish={handleTogglePublish}
            onDeleteLesson={handleDeleteLesson}
            onSaveLessonFromStudio={handleSaveLessonFromStudio}
            onPublishLessonFromStudio={handlePublishLessonFromStudio}
            onSendBroadcastNotification={handleSendBroadcastNotification}
            onClose={() => setCurrentView('dashboard')}
          />
        )}
      </div>

      {/* MODALS */}
      {selectedLesson && (
        <LessonModal
          lesson={selectedLesson}
          isFavorite={favorites.includes(selectedLesson.id)}
          onClose={() => setSelectedLesson(null)}
          onToggleFavorite={handleToggleFavorite}
          onEditInStudio={(lesson) => {
            setSelectedLesson(null);
            handleOpenStudio(lesson);
          }}
          onDuplicateLesson={handleDuplicateLesson}
          isSubscribed={isSubscribed}
          onOpenSubscribe={() => {
            setSelectedLesson(null);
            setIsSubscribeOpen(true);
          }}
        />
      )}

      {isSubscribeOpen && (
        <SubscriptionModal
          currentUser={currentUser}
          onClose={() => setIsSubscribeOpen(false)}
          onActivateSuccess={handleActivateSubscription}
        />
      )}

      {isAuthOpen && (
        <AuthModal
          onClose={() => setIsAuthOpen(false)}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setCurrentView('dashboard');
          }}
        />
      )}

      {isNotificationsOpen && (
        <NotificationCenterModal
          notifications={notifications}
          onClose={() => setIsNotificationsOpen(false)}
          onMarkAsRead={(id) => {
            setNotifications(
              notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n))
            );
          }}
          onMarkAllAsRead={() => {
            setNotifications(notifications.map((n) => ({ ...n, is_read: true })));
          }}
          onSelectNotification={handleSelectNotification}
        />
      )}

      {legalModalType && (
        <LegalModal
          type={legalModalType}
          onClose={() => setLegalModalType(null)}
        />
      )}
    </div>
  );
}
