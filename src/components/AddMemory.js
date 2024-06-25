import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

const koLocale = dayjs.locale('ko');

const AddMemory = () => {
    return (
        <div className="w-full h-full">
            {/* <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={koLocale}>
                <MobileDatePicker
                    label="Select Date"
                // value={selectedDate}
                // onChange={(newValue) => setSelectedDate(newValue)}
                />
            </LocalizationProvider> */}
        </div>
    );
};

export default AddMemory;