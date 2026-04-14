import { create } from 'zustand';

interface VoiceInputStore {
  activeInputId: string | null;
  setActiveInput: (id: string | null) => void;
}

export const useVoiceInputStore = create<VoiceInputStore>((set) => ({
  activeInputId: null,
  setActiveInput: (id) => set({ activeInputId: id }),
}));
