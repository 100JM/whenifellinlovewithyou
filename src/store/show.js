import { create } from 'zustand';

const useShowComponentStore = create((set) => ({
    mapPage: false,
    setMapPage: (isShow) => set({ mapPage: isShow }),
    galleryPage: false,
    setGalleryPage: (isShow) => set({ galleryPage: isShow }),
    addDialog: false,
    setAddDialog: (isShow) => set({ addDialog: isShow }),
    isFetch: true,
    setIsFetch: (isShow) => set({ isFetch: isShow }),
    uploadingState: { isUploading: false, uploadingText: '' },
    setUploadingState: ({ isUploading, uploadingText }) =>
        set((state) => ({
            uploadingState: {
                isUploading: isUploading !== undefined ? isUploading : state.uploadingState.isUploading,
                uploadingText: uploadingText !== undefined ? uploadingText : state.uploadingState.uploadingText,
            },
        })),
}));

export default useShowComponentStore;