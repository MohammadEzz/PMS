import { useState } from "react";

export default function SubMenuContainer (props) {
    return (
        <div className={'sub-menu-container'}>
            {props.children}
        </div>
    );
}