import React from 'react';
import {element} from 'prop-types';

export const HandleFocus = (element) => {
    return element.classList.add('active');
};

export const HandleBlur = (element) => {
    if (element.value === "") {
        return element.classList.remove('active');
    }
}
