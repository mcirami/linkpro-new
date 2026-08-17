/**
 * Single source of truth for how a layout_two button is painted.
 *
 * A link is either an "image" button (bg_image behind the label) or a "color"
 * button (bg_color behind it). text_color applies to both. Null colors mean
 * "leave it to the stylesheet", so links saved before these columns existed
 * keep their original look.
 *
 * The image and the color land on different elements: .bg_image_wrap is only
 * positioned under .icon_col.bg_image (see _links.scss), so a plain color has
 * to sit on .icon_col itself, over the `background: $white` default.
 *
 * @param linkItem      the link row
 * @param pageLayout    pageSettings.page_layout / page_layout
 * @param extraBgStyles merged into the image style (the preview pane sizes the
 *                      wrap differently to the live page)
 *
 * return { useImage, colStyle, bgStyle, textStyle }
 */
export const getButtonDesign = (linkItem = {}, pageLayout = null, extraBgStyles = {}) => {

    const empty = { useImage: false, colStyle: {}, bgStyle: {}, textStyle: {} };

    if (pageLayout !== "layout_two") return empty;

    const { bg_image, bg_color, text_color, button_design } = linkItem;

    const useImage = button_design === "image" && Boolean(bg_image);

    // Text sits over the image as well as the color, so it is not gated on
    // useImage. It has to be inline: .icon_col.bg_image forces h3/svg white.
    const textStyle = text_color ? { color: text_color } : {};

    if (useImage) {
        return {
            useImage,
            colStyle: {},
            bgStyle: {
                backgroundImage: `url(${bg_image})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
                ...extraBgStyles,
            },
            textStyle,
        };
    }

    return {
        useImage,
        colStyle: bg_color ? { backgroundColor: bg_color } : {},
        bgStyle: {},
        textStyle,
    };
};
