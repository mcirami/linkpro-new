import React, {useEffect, useState} from 'react';
import {updateFolderName} from '@/Services/FolderRequests.jsx';
import {
    LINKS_ACTIONS,
} from '@/Services/Reducer.jsx';
import {useUserLinksContext} from '@/Context/UserLinksContext.jsx';

const FolderNameInput = ({folder_id}) => {

    const [charactersLeft, setCharactersLeft] = useState(11);
    const { userLinks, dispatch } = useUserLinksContext();
    //const { dispatchOrig } = useContext(OriginalArrayContext);

    const [ currentFolder, setCurrentFolder ] = useState(
        userLinks.find(function(e) {
            return e?.type === "folder" && e?.id === folder_id
        }) || null );

    useEffect(() => {
        if(currentFolder?.name) {
            setCharactersLeft(11 - currentFolder?.name?.length);
        } else {
            setCharactersLeft(11);
        }
    },[charactersLeft])

    const handleSubmit = () => {

        const packets = {
            folderName: currentFolder.name
        }

        updateFolderName(folder_id, packets)
        .then((data) => {

            if(data.success) {

                dispatch({ type: LINKS_ACTIONS.UPDATE_FOLDER_NAME, payload: {folder_id: folder_id, name: currentFolder.name} })
                //dispatchOrig({ type: ORIGINAL_LINKS_ACTIONS.UPDATE_FOLDER_NAME, payload: {folder_id: folder_id, name: currentFolder.name} })
            }
        })
    }

    const handleFolderName = (e) => {
        let value = e.target.value;

        setCharactersLeft(11 - value?.length);

        setCurrentFolder({
            ...currentFolder,
            name: value
        })
    }

    return (
        <>
            <div className="input_wrap">
                <input
                    /*maxLength="13"*/
                    name="name"
                    type="text"
                    value={currentFolder.name || ""}
                    placeholder="Folder Name"
                    onChange={(e) => handleFolderName(e)}
                    onKeyPress={ event => {
                        if(event.key === 'Enter') {
                            handleSubmit(event);
                        }
                    }
                    }
                    onBlur={(e) => handleSubmit(e)}
                />
            </div>
            <div className="my_row info_text">
                <p className="char_max">Max 11 Characters Shown</p>
                <p className="char_count">
                    {charactersLeft < 0 ?
                        <span className="over">Only 11 Characters Will Be Shown</span>
                        :
                        "Characters Left: " + charactersLeft
                    }
                </p>
            </div>
        </>
    );
};

export default FolderNameInput;
