import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

const ImgCropper = ({cropperRef, imageSrc, aspectRatio}) => {
    return (
        <div className="crop-container">
            <Cropper
                ref={cropperRef}
                src={imageSrc}
                aspectRatio={aspectRatio}
                style={{ height: '100%', width: '100%' }}
                guides={false}
                viewMode={1} // 크롭 영역이 이미지를 벗어나지 않게
                background={false}
                data={{ width: '100%' }}
            />
        </div>
    );
};

export default ImgCropper;