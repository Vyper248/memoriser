import StyledConfirmationButton from "./ConfirmationButton.style";

import Button from "../Button/Button";
import PopupMenu from "../PopupMenu/PopupMenu";
import type { ButtonProps } from "../Button/Button";

const ConfirmationButton = ({value, onClick, ...rest}: ButtonProps) => {
	const onCancel = () => {
		document.body.click();
	}

	return (
		<StyledConfirmationButton>
			<PopupMenu icon={<Button value={value} onClick={()=>{}} {...rest}/>}>
				<Button value={'Confirm'} onClick={onClick} {...rest}/>
				<Button value={'Cancel'} onClick={onCancel} {...rest}/>
			</PopupMenu>
		</StyledConfirmationButton>
	);
}

export default ConfirmationButton;
