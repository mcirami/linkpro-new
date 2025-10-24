import React, {useRef} from 'react';
import ToolTipIcon from '@/Utils/ToolTips/ToolTipIcon';
import SwitchOptions from './SwitchOptions';
import InfoText from '@/Utils/ToolTips/InfoText';
import { RiEdit2Fill } from "react-icons/ri";
import {Link} from '@inertiajs/react';

const TableComponent = ({offers}) => {

    const table_wrap = useRef(null);

    return (
        <div className="my_row">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {offers.map(offer => (
                    <div className="bg-white rounded-2xl shadow-md hover:shadow-md transition p-4 flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                            <h3 className="font-medium text-gray-900 truncate">{offer.title || "(no title)"}</h3>
                            <Link className="blue text-indigo-600 text-sm font-medium" href={`/creator-center/course/${offer.course_id}`}>
                                <RiEdit2Fill className="h-4 w-4" />
                            </Link>
                        </div>

                        <div className="flex justify-between text-sm text-gray-600">
                            <div><strong>${offer.price || '0.00'}</strong> Price</div>
                            <div><strong>${ (Math.round( (offer.price * .80) * 100) / 100).toFixed(2) }</strong> PRP</div>
                            <div><strong>${ (Math.round( (offer.price  * .40) * 100) / 100).toFixed(2) }</strong> ARP</div>
                        </div>

                        <SwitchOptions
                            offer={offer}
                        />
                    </div>
                ))}
            </div>
            {/*<div className="table_wrap my_row table-responsive" ref={table_wrap}>
                <table className="table table-borderless" role="table">
                    <thead>
                    <tr>
                        <th scope="col">
                            <h5>
                                <span>Courses</span>
                            </h5>
                        </th>
                        <th scope="col">
                            <h5>
                                <span>Active</span>
                                <ToolTipIcon
                                    section="creator_active"
                                    circleSize="w-4 h-4"
                                    iconSize="text-xs"
                                />
                            </h5>
                        </th>
                        <th scope="col">
                            <h5>
                                <span>Public</span>
                                <ToolTipIcon
                                    section="creator_public"
                                    circleSize="w-4 h-4"
                                    iconSize="text-xs"
                                />
                            </h5>

                        </th>
                        <th scope="col">
                            <h5>
                                <span>Price</span>
                            </h5>
                        </th>
                        <th scope="col">
                            <h5>
                                <span>PRP</span>
                                <ToolTipIcon
                                    section="creator_prp"
                                    circleSize="w-4 h-4"
                                    iconSize="text-xs"
                                />
                            </h5>

                        </th>
                        <th scope="col">
                            <h5>
                                <span>ARP</span>
                                <ToolTipIcon
                                    section="creator_arp"
                                    circleSize="w-4 h-4"
                                    iconSize="text-xs"
                                />
                            </h5>

                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {offers?.map((offer) => {
                        return (
                            <SwitchOptions
                                key={offer.id}
                                offer={offer}
                            />
                        )
                    })}
                    </tbody>
                </table>
            </div>*/}
            <InfoText
                divRef={table_wrap}
            />
        </div>
    );
};

export default TableComponent;
