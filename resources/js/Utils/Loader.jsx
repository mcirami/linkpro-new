import React from 'react';

export const Loader = ({showLoader}) => {

    return (
        <div className="loader_popup" style={{ position:`${showLoader.position}`}}>
            <div className="loader_wrap">
                {showLoader.icon === "upload" ?
                    <span className="loader"> </span>
                    :
                    <div id="loading_spinner" className="active">
                        <img src={Vapor.asset('images/spinner.svg')} alt="" />
                    </div>
                }
            </div>
        </div>
    )
}
