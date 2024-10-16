export default function SubMenuItem(props) {
    return (
        <div 
        onClick={props.onClick} 
        className={'sub-menu-item '+((props.active) ? 'active' : '')} 
        value={props.value}>
              {props.title}
        </div>
    );
}