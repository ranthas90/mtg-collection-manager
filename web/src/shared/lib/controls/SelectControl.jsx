const SelectControl = ({options, placeholder, onChangeHandler}) => {

    const onChangeEventHandler = (event) => {
        onChangeHandler(event.target.value);
    }

    return (
        <select
            className="mt-1 block w-full rounded-lg focus:border-indigo-600 border-2 p-1 focus:outline-none bg-white"
            onChange={onChangeEventHandler}
        >
            <option value="">{placeholder}</option>
            {options.map((option) => (<option value={option.value}>{option.text}</option>))}
        </select>
    );
}

export default SelectControl;