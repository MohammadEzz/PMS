export default function TitleSectionWithoutStatus(props) {
    return (
        <div className="container-title-section">
            <h2>Return Bill <span>#{props.id}</span> Items</h2>
            <div className="clearfix"></div>
        </div>
    );
}