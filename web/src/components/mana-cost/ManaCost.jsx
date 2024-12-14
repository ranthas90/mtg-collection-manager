const ManaCost = ({ manaCost }) => {
    return (
        <div className="flex flex-row">
            {manaCost && manaCost.map((url, index) => (
                <img key={index} src={`/assets/symbols/${url}`} className="max-w-none w-[16px] h-[16px]" alt="Mana cost" />
            ))}
        </div>
    );
};

export default ManaCost;