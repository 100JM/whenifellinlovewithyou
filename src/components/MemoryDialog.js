import { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

const MemoryDialog = ({ showPhoto, handleShowPhoto, selectedPhoto }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    const handleMediaLoad = () => {
        setIsLoaded(true);
    };

    useEffect(() => {
        if(!showPhoto) {
            setIsLoaded(false);
        }
    }, [showPhoto]);

    return (
        <Dialog
            open={showPhoto}
            onClose={() => handleShowPhoto(false)}
            maxWidth="xs"
            fullWidth={true}
        >
            <DialogContent style={{ padding: "10px" }}>
                <div className="w-full h-full">
                    {
                        !isLoaded && <div className="flex justify-center items-center"><ClipLoader color={"#FFB6C1"} size={70} /></div>
                    }
                    {
                        selectedPhoto &&
                        <>
                            <div>
                                {selectedPhoto.locationName &&
                                    <span>{`🚩${selectedPhoto.locationName}`}</span>
                                }
                                <button className="float-end" onClick={() => handleShowPhoto(false)}>
                                    <FontAwesomeIcon icon={faXmark} />
                                </button>
                            </div>
                            <div>
                                {
                                    !selectedPhoto.video
                                        ?
                                        <img src={selectedPhoto.image} alt={selectedPhoto.date} onLoad={handleMediaLoad} />
                                        :
                                        <video
                                            src={selectedPhoto.video}
                                            type="video/mp4"
                                            controls
                                            poster={selectedPhoto.image}
                                            onLoadStart={handleMediaLoad}
                                        ></video>
                                }
                            </div>
                            <div className="text-slate-500">
                                <span>{selectedPhoto.date}</span>
                            </div>
                            {selectedPhoto.alt &&
                                <div>
                                    <span>
                                        {selectedPhoto.alt.split('<br />').map((line, index) => (
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