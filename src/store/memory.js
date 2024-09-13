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
    photoDialog: {showPhotoDialog: false, photoInfo: undefined},
    setPhotoDialog: ({showPhotoDialog, photoInfo}) =>
        set(() => ({
            photoDialog: {
                showPhotoDialog: showPhotoDialog,
                photoInfo: photoInfo
            }
        }))
}));

export default useMemories;