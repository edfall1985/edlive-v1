import { create } from "zustand";
import type { Debate, Speaker, VoteStats } from "@/types";

interface DebateState {
  debate: Debate | null;
  speakers: Speaker[];
  voteStats: VoteStats | null;

  setDebate: (debate: Debate) => void;
  setSpeakers: (speakers: Speaker[]) => void;
  setVoteStats: (stats: VoteStats) => void;
  updateSpeaker: (id: number, data: Partial<Speaker>) => void;
}

export const useDebateStore = create<DebateState>((set) => ({
  debate: null,
  speakers: [],
  voteStats: null,

  setDebate: (debate) => set({ debate }),
  setSpeakers: (speakers) => set({ speakers }),
  setVoteStats: (stats) => set({ voteStats: stats }),

  updateSpeaker: (id, data) =>
    set((state) => ({
      speakers: state.speakers.map((s) =>
        s.id === id ? { ...s, ...data } : s
      ),
    })),
}));
