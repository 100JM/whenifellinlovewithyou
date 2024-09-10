import { create } from 'zustand';

const useShowComponentStore = create((set) => ({
    mapPage: false,
    setMapPage: (isShow) => set({ mapPage: isShow }),
    galleryPage: false,
    setGalleryPage: (isShow) => set({galleryPage: isShow}),
    
}));

export default useShowComponentStore;