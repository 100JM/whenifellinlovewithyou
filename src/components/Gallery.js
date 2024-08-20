import calendarIcon from '../assets/calendar-32x32.png';

const Gallery = ({ handleShowGallery, memories }) => {
    return (
        <div className="w-full h-full overflow-y-auto">
            {
                memories.length === 0 &&
                <div className="w-full h-full flex justify-center items-center slideDiv">
                    등록된 추억이 없어요🥲
                </div>
            }
            {
                memories.length > 0 &&
                <div className="w-full grid grid-cols-3" style={{ gap: "1px" }}>
                    {
                        memories.map((m) => {
                            return (
                                <div key={m.id} className="aspect-square flex items-center justify-center">
                                    <img src={m.image} className="w-full h-full object-cover"/>
                                </div>
                            );
                        })
                    }
                </div>
            }
            <div className="gallery-custom-button" onClick={() => handleShowGallery(false)}>
                <img src={calendarIcon} alt="D-day" />
            </div>
        </div>
    );
};

export default Gallery;