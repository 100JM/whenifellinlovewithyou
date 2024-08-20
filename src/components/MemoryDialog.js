import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

const MemoryDialog = ({ showPhoto, handleShowPhoto, selectedPhoto }) => {
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
                                        <img src={selectedPhoto.image} alt={selectedPhoto.date} />
                                        :
                                        <video
                                            src={selectedPhoto.video}
                                            type="video/mp4"
                                            controls
                                            poster={selectedPhoto.image}
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