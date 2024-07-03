import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

const CropImgDialog = ({showCrop, imageSrc, cropperRef, aspectRatio, handleCropDialog, onCompleteCropImg, setAspectRatio}) => {
    return (
        <Dialog
            open={showCrop}
            // onClose={() => handleCropDialog(false)}
            maxWidth="xs"
            fullWidth={true}
        >
            <DialogContent style={{ padding: "10px", height: "auto" }}>
                {imageSrc && (
                    <div className="w-full h-full">
                        <div className="crop-container">
                            {/* <Cropper
                                    image={imageSrc}
                                    crop={crop}
                                    zoom={cropZoom}
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setCropZoom}
                                    style={{ height: '100%', width: '100%' }}
                                    cropShape="rect"
                                    showGrid={true}
                                /> */}
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
                        <div className="controls">
                            {/* <div className="w-full h-11 flex justify-around items-center mt-2">
                                    <button className="px-1 w-1/5" value={null} onClick={(e) => setAspectRatio(e.target.value)}>자유롭게</button>
                                    <button className="px-1 w-1/5" value={1/1} onClick={(e) => setAspectRatio(Number(e.target.value))}>1:1</button>
                                    <button className="px-1 w-1/5" value={3/4} onClick={(e) => setAspectRatio(Number(e.target.value))}>3:4</button>
                                    <button className="px-1 w-1/5" value={4/3} onClick={(e) => setAspectRatio(Number(e.target.value))}>4:3</button>
                                    <button className="px-1 w-1/5" value={0.7024} onClick={(e) => setAspectRatio(Number(e.target.value))}>자동 맞춤</button>
                                </div> */}
                            <select
                                id="aspectRatio"
                                name="aspectRatio"
                                onChange={(e) => setAspectRatio(e.target.value === 'free' ? null : parseFloat(e.target.value))}
                            >
                                <option value="free">자유 크롭</option>
                                <option value={1}>1:1</option>
                                <option value={4 / 3}>4:3</option>
                                <option value={16 / 9}>16:9</option>
                                <option value={9 / 16}>9:16</option>
                                <option value={2 / 3}>2:3</option> {/* 가로:세로 비율이 2:3 */}
                            </select>
                            <div className="w-full h-11 flex justify-end items-center mt-2">
                                <button type="button" className="border px-3 py-0.5 rounded bg-gray-300 border-gray-300 mr-2" onClick={() => handleCropDialog(false)}>취소</button>
                                <button type="button" className="border px-3 py-0.5 rounded" style={{ backgroundColor: "#FFB6C1", borderColor: "#FFB6C1" }} onClick={onCompleteCropImg}>적용</button>
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default CropImgDialog;