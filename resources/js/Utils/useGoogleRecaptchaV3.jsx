import React, {useCallback, useEffect, useState} from 'react';

export const useGoogleRecaptchaV3 = (siteKey) => {

    const [isRecaptchaReady, setIsRecaptchaReady] = useState(false);

    useEffect(() => {
        if(window.grecaptcha) {
            setIsRecaptchaReady(true);
        } else {
            const script = document.createElement('script');
            script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`
            script.async = true;
            document.head.appendChild(script);
            script.onload = () => {
                setIsRecaptchaReady(true);
            }
        }

    }, [siteKey]);

    return useCallback( async (action) => {
        if (isRecaptchaReady && window.grecaptcha) {
            return await window.grecaptcha.execute(siteKey, {action});
        }
    },[siteKey, isRecaptchaReady])
};

export const checkRecaptcha = async (token) => {

    try {
        let success = true;
        const SECRET_KEY_V3 = '6LdSIQIqAAAAAL18SkTssKUTDoTu7Km3WrEqQ2ro'
        const recaptchaResponse = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${SECRET_KEY_V3}&response=${token}`);
        console.log("captcha response: ", recaptchaResponse.data)
        if (!recaptchaResponse.data.success || recaptchaResponse.data.score <
            0.5 || recaptchaResponse.data.action !== 'register') {
            success = false
        }

        return {
            valid: success
        }

    } catch (e) {
        console.error("Error calling function: ", error);
    }
}

