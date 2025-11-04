import React from 'react';

export const Loader = ({showLoader}) => {

    const {icon, position, progress, message} = showLoader;
    return (
        <div className="loader_popup" style={{
            position: {position},
            borderRadius: 8 + 'px'
        }}>
            <div className="loader_wrap">
                {icon === "upload" ?
                    <>
                        <span className="loader">
                            {progress &&
                                <span className="progress">{progress}%</span>
                            }
                        </span>

                    </>
                    :
                    <>
                        <div id="loading_spinner" className="active">
                            {message &&
                                <div className="w-full text-center">
                                    <p className="text-white">{message}</p>
                                </div>
                            }
                            <img src={Vapor.asset('images/spinner.svg')} alt="" />
                        </div>
                        </>
                }
            </div>
        </div>
    )
}
