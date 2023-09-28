export const LP_ACTIONS = {
    UPDATE_PAGE_DATA: 'update-page-data'
}

export function reducer(pageData, action) {
    switch(action.type) {
        case LP_ACTIONS.UPDATE_PAGE_DATA:
            return {
                ...pageData,
                [`${action.payload.name}`]: action.payload.value
            }
    }
}
