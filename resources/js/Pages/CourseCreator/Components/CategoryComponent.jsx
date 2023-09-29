import React, {useState} from 'react';
const categories = user.categories;

//import InputLabel from '@mui/material/InputLabel';
//import MenuItem from '@mui/material/MenuItem';
//import FormControl from '@mui/material/FormControl';
//import Select from '@mui/material/Select';
import { InputLabel, FormControl, Select } from '@mui/material';

const CategoryComponent = () => {

    const [selectedCategory, setSelectedCategory] = useState("")

    const handleChange = (event) => {
        setSelectedCategory(event.target.value);
    }

    return (
        <div className="edit_form">
            {/*<div className="custom_select">
                <   label>Select Category</label>
                <ul className="list-unstyled">
                    {categories?.map((category) => {

                        const {id, name, children, parent_id} = category;

                        return (
                            <React.Fragment key={id}>
                                {!parent_id && <li value={id}>{name}</li>}
                                {children.length > 0 &&

                                    children.map((child) => {

                                        const {id, name} = child;

                                        return (
                                            <li key={id} style={{ paddingLeft: '20px'}} value={id}>{name}</li>
                                        )
                                    })
                                }
                            </React.Fragment>
                        )
                    })}
                </ul>
            </div>*/}
            <FormControl fullWidth>
                <InputLabel id="category_select_label">Select Category</InputLabel>
                <Select
                    native
                    labelId="category_select_label"
                    id="category_select"
                    label="Select Category"
                    defaultValue={selectedCategory}
                    onChange={(e) => handleChange(e)}
                >
                    <option value=""></option>
                    {categories?.map((category) => {

                        const {id, name, children} = category;

                        return (

                            children.length > 0 ?
                                <optgroup key={id} label={name}>
                                    {children.map((child) => {
                                        const {id, name} = child;
                                        return (
                                            <option key={id} value={id}>{name}</option>
                                        )
                                    })}
                                    <option key={children.length} value={id}>Other {name}</option>
                                </optgroup>

                                :
                                <option key={id} value={id}>{name}</option>
                        )
                    })}
                </Select>
            </FormControl>
        </div>
    );
};

export default CategoryComponent;
