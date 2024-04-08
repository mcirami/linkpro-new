import React from 'react';

export const GetCurrentTime = () => {
    const today = new Date();
    return today.setHours(0,0,0);
};

export const GetHumanReadableTime = (timeStamp) => {
    const date = new Date(timeStamp);
    return date.setHours(23, 59, 59);
}
