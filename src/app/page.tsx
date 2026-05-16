"use client";

import { Footer } from "@/components/layout/footer";
import { LiveEmbed } from "@/components/debate/live-embed";
import { SpeakerGrid } from "@/components/debate/speaker-grid";
import { Timer } from "@/components/debate/timer";
import { AiSummaryPanel } from "@/components/ai-summary/summary-panel";
import { VotingSection } from "@/components/voting/voting-section";
import { MediaBoard } from "@/components/media-board/media-board";
import { ViewerParticipation } from "@/components/participation/viewer-participation";
import { CommentsSection } from "@/components/comments/comments-section";
import { TypingChallenge } from "@/components/typing-challenge/typing-challenge";
import { useDebateStore } from "@/stores/debate-store";
import { useEffect, useState } from "react";

export default function Home() {
  const setDebate = useDebateStore((s) => s.setDebate);
  const setSpeakers = useDebateStore((s) => s.setSpeakers);
  const setVoteStats = useDebateStore((s) => s.setVoteStats);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mock data for MVP Phase 1
  useEffect(() => {
    if (!mounted) return;

    setDebate({
      id: 1,
      title: "Apakah Indonesia Perlu Masuk WTO?",
      motion: "Keanggotaan WTO memberikan lebih banyak manfaat daripada kerugian bagi Indonesia",
      description: null,
      status: "live",
      session_type: "education",
      current_phase: "opening",
      tiktok_live_url: null,
      started_at: new Date().toISOString(),
      ended_at: null,
      created_by: null,
      created_at: new Date().toISOString(),
    });

    setSpeakers([
      {
        id: 1, debate_id: 1, user_id: null,
        display_name: "Andi Pratama", title: "Ekonom & Peneliti", avatar_url: null,
        position: "pro", speaking_order: 1, total_speaking_time: 0,
        is_speaking: false, is_active: true,
      },
      {
        id: 2, debate_id: 1, user_id: null,
        display_name: "Sarah Wijaya", title: "Dosen FEUI", avatar_url: null,
        position: "pro", speaking_order: 2, total_speaking_time: 0,
        is_speaking: false, is_active: true,
      },
      {
        id: 3, debate_id: 1, user_id: null,
        display_name: "Budi Santoso", title: "Aktivis Perdagangan", avatar_url: null,
        position: "kontra", speaking_order: 3, total_speaking_time: 0,
        is_speaking: false, is_active: true,
      },
      {
        id: 4, debate_id: 1, user_id: null,
        display_name: "Dewi Kartika", title: "Petani & Aktivis", avatar_url: null,
        position: "kontra", speaking_order: 4, total_speaking_time: 0,
        is_speaking: true, is_active: true,
      },
    ]);

    setVoteStats({
      pro: 52, kontra: 48, total: 8432,
      categories: {
        most_logical: 38, most_convincing: 42, most_data_based: 25, most_emotional: 55,
      },
    });
  }, [mounted, setDebate, setSpeakers, setVoteStats]);

  if (!mounted) return null;

  return (
    <>
      <main className="pt-20 pb-6 px-3 md:px-4 lg:px-6 max-w-7xl mx-auto">
        {/* Session & Topic Header */}
        <div className="mb-4 md:mb-6 animate-fade-in">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
              </svg>
              SESSION 2: EDUCATION
            </span>
            <Timer />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-primary">
            Apakah Indonesia Perlu Masuk WTO?
          </h2>
          <p className="text-secondary mt-1 text-sm md:text-base">
            Mosi: Keanggotaan WTO memberikan lebih banyak manfaat daripada kerugian bagi Indonesia
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-4 md:space-y-6">
            <LiveEmbed />
            <SpeakerGrid />
            <AiSummaryPanel />
            <VotingSection />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-4">
            <MediaBoard />
            <ViewerParticipation />
            <CommentsSection />
            <TypingChallenge />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
