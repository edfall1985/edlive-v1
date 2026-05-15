import { create } from "zustand";
import type { Comment } from "@/types";

interface CommentState {
  comments: Comment[];
  lastId: number;
  setComments: (comments: Comment[]) => void;
  addComments: (comments: Comment[]) => void;
  addComment: (comment: Comment) => void;
}

export const useCommentStore = create<CommentState>((set) => ({
  comments: [],
  lastId: 0,

  setComments: (comments) =>
    set({
      comments,
      lastId: comments.length > 0 ? Math.max(...comments.map((c) => c.id)) : 0,
    }),

  addComments: (newComments) =>
    set((state) => ({
      comments: [...state.comments, ...newComments].slice(-100),
      lastId:
        newComments.length > 0
          ? Math.max(...newComments.map((c) => c.id))
          : state.lastId,
    })),

  addComment: (comment) =>
    set((state) => ({
      comments: [...state.comments, comment].slice(-100),
      lastId: comment.id,
    })),
}));
