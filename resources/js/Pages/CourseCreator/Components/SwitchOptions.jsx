import React, {useState} from 'react';
import Switch from '@mui/material/Switch'
import { styled } from '@mui/material/styles';
import {updateOfferData} from '@/Services/OfferRequests.jsx';
import {OFFER_ACTIONS} from '../Reducer';
import ToolTipIcon from '../../../Utils/ToolTips/ToolTipIcon';

const SwitchOptions = ({offerData, dispatchOffer}) => {

    const handleChange = (type) => {

        const value = !offerData[type];

        const packets = {
            [`${type}`]: value,
        };

        updateOfferData(packets, offerData["id"]).then((response) => {
            if(response.success) {
                dispatchOffer({
                    type: OFFER_ACTIONS.UPDATE_OFFER_DATA,
                    payload: {
                        value: value,
                        name: type
                    }
                })
            }
        });
    }

    const IOSSwitch = styled((props) => (
        <Switch {...props} />
    ))(({ theme }) => ({
        width: 62,
        height: 26,
        padding: 0,
        '& .MuiSwitch-switchBase': {
            padding: 0,
            margin: 2,
            transitionDuration: '800ms',
            '&.Mui-checked': {
                transform: 'translateX(35px)',
                color: '#fff',
                '& + .MuiSwitch-track': {
                    backgroundColor: '#424fcf',
                    opacity: 1,
                    border: 0,
                },
                '&.Mui-disabled + .MuiSwitch-track': {
                    opacity: 0.5,
                },
            },
            '&.Mui-focusVisible .MuiSwitch-thumb': {
                color: '#ffffff',
                border: '6px solid #ffffff',
            },
            '&.Mui-disabled .MuiSwitch-thumb': {
                color: '#ffffff',
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
            },
        },
        '& .MuiSwitch-thumb': {
            color: '#ffffff',
            boxSizing: 'border-box',
            width: 22,
            height: 22,
        },
        '& .MuiSwitch-track': {
            borderRadius: 26 / 2,
            backgroundColor: theme.palette.mode === 'light' ? 'rgb(136, 136, 136)' : '#39393D',
            opacity: 1,
            transition: theme.transitions.create(['background-color'], {
                duration: 500,
            }),
        },
    }));

    return (
        <>
            <div className="switch_wrap two_columns">
                <div className="page_settings border_wrap my_row">
                    <h3>Public</h3>
                    <IOSSwitch
                        onChange={() => handleChange('public')}
                        checked={Boolean(offerData["public"])}
                        disabled={!Boolean(offerData["published"])}
                    />
                </div>
                <ToolTipIcon section="public_course" />
            </div>


            <div className="switch_wrap two_columns">
                <div className="page_settings border_wrap my_row">
                    <h3>Active</h3>
                    <IOSSwitch
                        onChange={() => handleChange('active')}
                        checked={Boolean(offerData["active"])}
                        disabled={!Boolean(offerData["published"])}
                    />
                </div>
                <ToolTipIcon section="active_course" />
            </div>
        </>
    );
};

export default SwitchOptions;
