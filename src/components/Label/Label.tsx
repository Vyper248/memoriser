import StyledLabel from "./Label.style";

type LabelProps = {
	value: string;
}

const Label = ({value}: LabelProps) => {
	return (
		<StyledLabel>{value}</StyledLabel>
	);
}

export default Label;
