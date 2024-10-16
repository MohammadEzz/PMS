export default function MainMenuItem(props) {
    return (
        <div onClick={props.onClick} className={'side-menu-item ' + ((props.active) ? 'active' : '')}>
            <span className='icon'><img src= {props.icon} /></span> 
            <span className='title'>{props.title}</span>
          </div>
    );
}