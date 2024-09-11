import useShowComponentStore from '../store/show';

import calendarIcon from '../assets/calendar-32x32.png';

const Gallery = ({ memories, handleShowPhoto }) => {
    const {setGalleryPage, setMapPage} = useShowComponentStore();

    const hideGalleryPage = () => {
        setGalleryPage(false);
        setMapPage(false);
    };

    return (
        <div className="w-full h-full overflow-y-auto">
            {
                memories.length === 0 &&
                <div className="w-full h-full flex justify-center items-center">
                    등록된 추억이 없어요🥲
                </div>
            }
            {
                memories.length > 0 &&
                <div className="w-full grid grid-cols-3" style={{ gap: "1px" }}>
                    {
                        memories.map((m) => {
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