export default function TitleSectionWithStatus(props) {
    return (
        <div className="container-title-section">
            <h2>Return Bill <span>#{props.id}</span> Items</h2>
            <div className={"small-block " + (!(props.status) ? 'underreview' : 'approved')}>
                {!(props.status) ? 'Under Review' : 'Approved'}
            </div>
            <div className="clearfix"></div>
        </div>
    );
}