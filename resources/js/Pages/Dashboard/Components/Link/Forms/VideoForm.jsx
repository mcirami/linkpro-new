import React, { useEffect, useState } from 'react';
import { usePageContext } from '@/Context/PageContext.jsx';
import { useUserLinksContext } from '@/Context/UserLinksContext.jsx';
import { updateLink } from '@/Services/LinksRequest.jsx';
import { LINKS_ACTIONS } from '@/Services/Reducer.jsx';
import { checkEmbedLink } from '@/Services/VideoService.jsx';
import { HandleBlur, HandleFocus } from '@/Utils/InputAnimations.jsx';

/**
 * The video-specific setting: the YouTube/Vimeo URL to embed. The title (name)
 * and optional call-to-action link (url) are edited like any other button, so
 * they are not duplicated here.
 *
 * The pasted video URL is normalised to an embeddable iframe src via
 * checkEmbedLink and stored in the link's `embed_url` column.
 */
const VideoForm = ({ editLink, setEditLink }) => {

    const { pageSettings } = usePageContext();
    const { dispatch } = useUserLinksContext();

    const [videoUrl, setVideoUrl] = useState(editLink.embed_url ?? '');

    useEffect(() => setVideoUrl(editLink.embed_url ?? ''), [editLink.embed_url]);

    const commitVideoUrl = () => {
        if (!editLink?.id) return;

        const embed = checkEmbedLink(videoUrl);
        if (embed !== videoUrl) {
            setVideoUrl(embed);
        }
        if (embed === (editLink.embed_url ?? '')) return;

        const packets = {
            embed_url: embed,
            page_id: pageSettings.id,
            type: editLink.type,
        };

        updateLink(packets, editLink.id).then((res) => {
            if (res?.success) {
                setEditLink((prev) => ({ ...prev, embed_url: embed }));
                dispatch({
                    type: LINKS_ACTIONS.UPDATE_LINK,
                    payload: {
                        id: editLink.id,
                        editLink,
                        embed_url: embed,
                    },
                });
            }
        });
    };

    const inputClasses =
        'w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500';

    return (
        <div className="link_form form_nav_content px-4 pt-5 pb-8 w-full">
            <div className="my_row">
                <div className="section_title w-full !mb-2">
                    <h4>Video URL</h4>
                </div>
                <input
                    className={inputClasses}
                    type="url"
                    name="embed_url"
                    value={videoUrl || ''}
                    placeholder="Paste a YouTube or Vimeo link"
                    onChange={(e) => setVideoUrl(e.target.value)}
                    onFocus={(e) => HandleFocus(e.target)}
                    onBlur={(e) => { commitVideoUrl(); HandleBlur(e.target); }}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); commitVideoUrl(); } }}
                />
                <p className="info_text mt-2 !text-gray-500">
                    Paste the share link from YouTube or Vimeo &mdash; we&rsquo;ll embed it automatically.
                </p>
            </div>
        </div>
    );
};

export default VideoForm;
