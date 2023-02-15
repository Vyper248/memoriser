import StyledDropdown from "./Dropdown.style";

type Option = {
	value: string;
	name: string;
}

type DropdownProps = {
	value: string | undefined;
	options: Option[];
	onChange: (value:string)=>void;
}

const Dropdown = ({value, options, onChange}: DropdownProps) => {

	const onChangeValue = (e: React.ChangeEvent<HTMLSelectElement>) => {
		let value = e.target.value;
		onChange(value);	
	}

	return (
		<StyledDropdown>
			<select value={value} onChange={onChangeValue}>
			{
				options.map(option => <option key={option.value} value={option.value}>{option.name}</option>)
			}
			</select>
		</StyledDropdown>
	);
}

export default Dropdown;
