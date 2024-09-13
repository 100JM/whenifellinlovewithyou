import { useState } from 'react';
import { ClipLoader } from 'react-spinners';
import useMemories from '../store/memory';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

const MemoryDialog = () => {
    const [isLoaded, setIsLoaded] = useState(false);

    const { photoDialog, setPhotoDialog } = useMemories();

    const handleMediaLoad = () => {
        setIsLoaded(true);
    };

    // useEffect(() => {
    //     if (!photoDialog.showPhotoDialog) {
    //         setIsLoaded(false);
    //     }
    // }, [photoDialog.showPhotoDialog]);

    return (
        <Dialog
            open={photoDialog.showPhotoDialog}
            onClose={() => setPhotoDialog({showPhotoDialog: false})}
            maxWidth="xs"
            fullWidth={true}
        >
            <DialogContent style={{ padding: "10px" }}>
                <div className="w-full h-full">
                    {
                        !isLoaded && <div className="flex justify-center items-center"><ClipLoader color={"#FFB6C1"} size={70} /></div>
                    }
                    {
                        photoDialog.photoInfo &&
                        <>
                            <div>
                                {photoDialog.photoInfo.locationName &&
                                    <span>{`🚩${photoDialog.photoInfo.locationName}`}</span>
                                }
                                <button className="float-end" onClick={() => setPhotoDialog({showPhotoDialog: false})}>
                                    <FontAwesomeIcon icon={faXmark} />
                                </button>
                            </div>
                            <div>
                                {
                                    !photoDialog.photoInfo.video
                                        ?
                                        <img src={photoDialog.photoInfo.image} alt={photoDialog.photoInfo.date} onLoad={handleMediaLoad} />
                                        :
                                        <video
                                            src={photoDialog.photoInfo.video}
                                            type="video/mp4"
                                            controls
                                            poster={photoDialog.photoInfo.image}
                                            onLoadStart={handleMediaLoad}
                                        ></video>
                                }
                            </div>
                            <div className="text-slate-500">
                                <span>{photoDialog.photoInfo.date}</span>
                            </div>
                            {photoDialog.photoInfo.alt &&
                                <div>
                                    <span>
                                        {photoDialog.photoInfo.alt.split('<br />').map((line, index) => (
                                            <span key={index}>
                                                {line}
                                                <br />
                                            </span>
                                        ))}
                                    </span>
                                </div>
                            }
                        </>
                    }
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default MemoryDialog;