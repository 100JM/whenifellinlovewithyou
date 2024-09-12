import { create } from "zustand";

const useMemories = create((set) => ({
    ourMemories: [],
    setOurMemories: (memories) => set({ourMemories: memories}),
    isLoading: true,
    setIsLoading: (loading) => set({isLoading: loading}),
    error: null,
    setError: (error) => set({error: error}),
    selectedOurMemory: {},
    setSelectedOurMemory: (memory) => set({selectedOurMemory: memory}),
    photoDialog: false,
    setPhotoDialog: (isShow) => set({photoDialog: isShow}),
    selectedOurPhoto: null,
    setSelectEdOurPhoto: (photoInfo) => set({selectedOurPhoto: photoInfo})
}));

export default useMemories;