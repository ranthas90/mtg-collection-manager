const InputControl = ({onChangeHandler, placeholder}) => {

    const onChangeEventHandler = (event) => {
        onChangeHandler(event.target.value);
    }

    return (
        <input
            className="mt-1 block w-full rounded-lg focus:border-indigo-600 border-2 p-1 focus:outline-none"
            type="text"
            placeholder={placeholder}
            onChange={onChangeEventHandler}
        />
    );
};

export default InputControl;