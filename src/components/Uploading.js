import { ClipLoader } from 'react-spinners';

const Uploading = ({uploadinText}) => {
    return (
        <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex justify-center items-center"
            style={{backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: "9999"}}
        >
            <ClipLoader color={"#FFB6C1"} size={70}/>
            {uploadinText && <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white">
                {uploadinText}
            </span>}
        </div>
    )
};

export default Uploading;