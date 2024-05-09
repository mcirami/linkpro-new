import {arrayMove} from '@dnd-kit/sortable';
import {updateSectionsPositions} from '@/Services/CourseRequests.jsx';

export const handleDragEndAction = ( event,
                                     updateSectionsPositions,
                                     setSections,
                                     setShowTiny
) => {

    const {active, over} = event;
    let newArray = [];

    if (active.id !== over.id) {

        setSections((sections) => {
            const oldIndex = sections.map(function(e) {
                return e.id;
            }).indexOf(active.id);
            const newIndex = sections.map(function(e) {
                return e.id;
            }).indexOf(over.id);
            newArray = arrayMove(sections, oldIndex, newIndex);
            return newArray;
        });

        const packets = {
            sections: newArray
        }

        updateSectionsPositions(packets).then(() => {
            setShowTiny(false);
            setShowTiny(true);
        });
    }

    return newArray;
}
