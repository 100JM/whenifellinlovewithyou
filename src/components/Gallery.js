import useShowComponentStore from '../store/show';
import useMemories from '../store/memory';

import calendarIcon from '../assets/calendar-32x32.png';

const Gallery = ({ handleShowPhoto }) => {
    const { setGalleryPage, setMapPage } = useShowComponentStore();
    const { ourMemories, setPhotoDialog, setSelectEdOurPhoto } = useMemories();

    const hideGalleryPage = () => {
        setGalleryPage(false);
        setMapPage(false);
    };

    const handleClickPhoto = (isShow, info) => {
        setPhotoDialog(isShow);
        setSelectEdOurPhoto(info);
    };

    return (
        <div className="w-full h-full overflow-y-auto">
            {
                ourMemories.length === 0 &&
                <div className="w-full h-full flex justify-center items-center">
                    등록된 추억이 없어요🥲
                </div>
            }
            {
                ourMemories.length > 0 &&
                <div className="w-full grid grid-cols-3" style={{ gap: "1px" }}>
                    {
                        ourMemories.map((m) => {
                            return (
                                <div key={m.id} aria-hidden={false} className="aspect-square flex items-center justify-center" onClick={() => handleShowPhoto(true, m)}>
                                    <img src={m.image} alt={m.date} className="w-full h-full object-cover" />
                                </div>
                            );
                        })
                    }
                </div>
            }
            <div className="gallery-custom-button" onClick={() => hideGalleryPage()}>
                <img src={calendarIcon} alt="D-day" />
            </div>
        </div>
    );
};

export default Gallery;