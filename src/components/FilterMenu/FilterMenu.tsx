import { useAppDispatch } from "../../redux/hooks";
import { setFilter } from "../../redux/mainSlice";

import Button from "../Button/Button";

const FilterMenu = () => {
	const dispatch = useAppDispatch();

	const onClickClear = () => {
		dispatch(setFilter({type: 'none'}));
	}

	const onClickRed = () => {
		dispatch(setFilter({type: 'color', color: 'red'}));
	}

	const onClickOrange = () => {
		dispatch(setFilter({type: 'color', color: 'orange'}));
	}

	const onClickGreen = () => {
		dispatch(setFilter({type: 'color', color: 'green'}));
	}

	return (
		<>
			<Button value='Clear Filter' onClick={onClickClear}/>
			<Button value='Show Red' onClick={onClickRed}/>
			<Button value='Show Orange' onClick={onClickOrange}/>
			<Button value='Show Green' onClick={onClickGreen}/>
		</>
	);
}

export default FilterMenu;
