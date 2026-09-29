import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeaturedProjects } from './components/FeaturedProjects';
import { SystemsLabSection } from './components/SystemsLabSection';
import { RepositoriesGrid } from './components/RepositoriesGrid';
import { ContributionGraph } from './components/ContributionGraph';
import { ExperienceTimeline } from './components/ExperienceTimeline';
import { PeerCodeDefenseSection } from './components/PeerCodeDefenseSection';
import { SkillsSection } from './components/SkillsSection';
import { ArticlesSection } from './components/ArticlesSection';
import { ResearchInterestsSection } from './components/ResearchInterestsSection';
import { DynamicInfiniteScrollStream } from './components/DynamicInfiniteScrollStream';
import { Interactive3DGlobe } from './components/Interactive3DGlobe';
import { FloatingAiVoiceAssistant } from './components/FloatingAiVoiceAssistant';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { GithubSyncModal } from './components/GithubSyncModal';
import { ResumeModal } from './components/ResumeModal';
import { CommandPalette } from './components/CommandPalette';
import { InteractiveTerminalModal } from './components/InteractiveTerminalModal';
import { githubService } from './services/github';
import { soundService } from './services/sound';
import {
  DEFAULT_GITHUB_USERNAME,
  FALLBACK_USER,
  FALLBACK_REPOS,
  FEATURED_PROJECTS,
  EXPERIENCE_HISTORY,
} from './data/fallbackData';
import { GithubUser, GithubRepo, GithubEvent, FeaturedProject } from './types/github';

export default function App() {
  const [currentUser, setCurrentUser] = useState<GithubUser>(FALLBACK_USER);
  const [repos, setRepos] = useState<GithubRepo[]>(FALLBACK_REPOS);
  const [events, setEvents] = useState<GithubEvent[]>([]);
  const [featuredProjects] = useState<FeaturedProject[]>(FEATURED_PROJECTS);
  const [experience] = useState(EXPERIENCE_HISTORY);

  // Modals state
  const [selectedProject, setSelectedProject] = useState<FeaturedProject | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<GithubRepo | null>(null);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Synchronize data for given username
  const syncGithubData = useCallback(async (username: string) => {
    setIsSyncing(true);
    try {
      const [userData, reposData, eventsData] = await Promise.allSettled([
        githubService.fetchUser(username),
        githubService.fetchRepos(username),
        githubService.fetchEvents(username),
      ]);

      if (userData.status === 'fulfilled') {
        setCurrentUser({
          ...userData.value,
          name: userData.value.name || (username.toLowerCase() === 'christian3788' ? 'Christian Amos Otieno' : userData.value.login),
          email: userData.value.email || (username.toLowerCase() === 'christian3788' ? 'christianamos67@gmail.com' : null),
          location: userData.value.location || (username.toLowerCase() === 'christian3788' ? 'Kisumu, Kenya' : null),
          company: userData.value.company || (username.toLowerCase() === 'christian3788' ? 'Zone01 Kisumu' : null),
          avatar_url: '/IMG_20260926_072914.jpg',
        });
      }

      if (reposData.status === 'fulfilled' && reposData.value.length > 0) {
        setRepos(reposData.value);
      }

      if (eventsData.status === 'fulfilled') {
        setEvents(eventsData.value);
      }
    } catch (err) {
      console.error('Error syncing GitHub data:', err);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    syncGithubData(DEFAULT_GITHUB_USERNAME);
  }, [syncGithubData]);

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        soundService.playClick(220, 0.02);
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleExploreWorks = () => {
    soundService.playClick(140, 0.02);
    const el = document.getElementById('featured');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleContactClick = () => {
    soundService.playClick(140, 0.02);
    const el = document.getElementById('contact');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/20 selection:text-indigo-200">
      
      {/* Navigation (Strict Top Bar Contract) */}
      <Navbar
        user={currentUser}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
        onOpenResumeModal={() => setIsResumeModalOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenTerminal={() => setIsTerminalOpen(true)}
        isSyncing={isSyncing}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Split-Screen Editorial Hero with Persona Switcher */}
        <Hero
          user={currentUser}
          totalReposCount={repos.length}
          onExploreWorks={handleExploreWorks}
          onContactClick={handleContactClick}
        />

        {/* 01. Flagship Systems Architecture & Interactive Simulators */}
        <FeaturedProjects
          projects={featuredProjects}
          onSelectProject={(proj) => setSelectedProject(proj)}
        />

        {/* 02. Interactive Systems Lab & Hardware Simulation */}
        <SystemsLabSection />

        {/* 03. Live GitHub Repositories Grid (44 Public Repos) with Search & Language Filters */}
        <RepositoriesGrid
          repos={repos}
          username={currentUser.login}
          onOpenRepoDetails={(repo) => setSelectedRepo(repo)}
        />

        {/* 04. Engineering Telemetry & Yearly Contribution Graph */}
        <ContributionGraph
          events={events}
          repos={repos}
          username={currentUser.login}
        />

        {/* 05. Career Experience Timeline & Peer-Defended Apprenticeship */}
        <ExperienceTimeline history={experience} />

        {/* 06. Zone01 Peer Code Defense & Architecture Reviews */}
        <PeerCodeDefenseSection />

        {/* 07. Technical Competencies Matrix */}
        <SkillsSection />

        {/* 07. Technical Writing & Publications */}
        <ArticlesSection />

        {/* 08. Computational Inquiries & Scientific Roots (Gravitational Lensing) */}
        <ResearchInterestsSection />

        {/* 09. Dynamic Infinite Scroll Systems Dispatches Feed */}
        <DynamicInfiniteScrollStream />

        {/* 10. Interactive 3D Globe · Real Geolocation & Telemetry Hub */}
        <Interactive3DGlobe />

        {/* 11. Interactive Collaboration & Contact Dispatch */}
        <ContactSection user={currentUser} />
      </main>

      {/* Quiet, Clean Footer */}
      <Footer user={currentUser} />

      {/* Floating AI Voice Assistant */}
      <FloatingAiVoiceAssistant />

      {/* Project / Repo Deep Dive Modal */}
      <ProjectDetailModal
        project={selectedProject}
        repo={selectedRepo}
        onClose={() => {
          setSelectedProject(null);
          setSelectedRepo(null);
        }}
      />

      {/* GitHub Account Switcher & Rate Limit Modal */}
      <GithubSyncModal
        currentUsername={currentUser.login}
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        onSwitchUser={async (username) => {
          await syncGithubData(username);
        }}
      />

      {/* Curriculum Vitae / Resume Modal */}
      <ResumeModal
        user={currentUser}
        experience={experience}
        featuredProjects={featuredProjects}
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
      />

      {/* Command Palette (Cmd+K / Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectProject={(id) => {
          const found = featuredProjects.find((p) => p.id === id);
          if (found) setSelectedProject(found);
        }}
        onOpenResume={() => setIsResumeModalOpen(true)}
        onOpenSync={() => setIsSyncModalOpen(true)}
        onSwitchPersona={(persona) => {
          // Switch persona
        }}
      />

      {/* Interactive CLI Terminal Drawer */}
      <InteractiveTerminalModal
        user={currentUser}
        projects={featuredProjects}
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
      />

    </div>
  );
}

