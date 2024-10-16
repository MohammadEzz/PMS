import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

export default function MainHeader(props) {
    return (
        <div className="main-header">
            <KeyboardDoubleArrowRightIcon sx={{ fontSize: 25 }} />
            <span>{props.title}</span>
        </div>
    );
}