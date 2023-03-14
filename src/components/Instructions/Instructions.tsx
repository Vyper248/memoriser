import StyledInstructions from "./Instructions.style";

type InstructionsProps = {
	visible: boolean;
}

const Instructions = ({visible}: InstructionsProps) => {
	return (
		<StyledInstructions>
			<h2>Instructions</h2>
			<p><strong>Groups</strong> - These can be created, edited or deleted from the first menu to the right of the Group selection dropdown.</p>
			<p><strong>Cards</strong> - Create a new card with the New Card button, located below the Group select menu. If you want to edit or delete a card, click on it to flip it and use the Edit button in the top right corner.</p>
			<p><strong>Sharing</strong> - Found in the Group menu, these share buttons will generate a link and copy it to the clipboard. You can share the currently selected group or all groups.</p>
			<p><strong>Filters</strong> - Access these by clicking the filter button to the right of the Group menu. These allow you to filter by a specific colour.</p>
			<p><strong>Timer</strong> - At the bottom of the card, you'll either see a message to say Check now, or a time. If you check a card while a time is showing, you won't get another point and the timer will reset. The purpose of this is to make sure you're practising after increasing amounts of time, which will help you to memorise your card.</p>
			<p><strong>Points</strong></p>
			<p><strong>0 Points (Red)</strong> means you've answered incorrectly or just created a new card.</p>
			<p><strong>1-4 Points (Orange)</strong> means you're learning and have correctly guessed a few times.</p>
			<p><strong>5+ Points (Green)</strong> means you're doing well. Keep going to keep reinforcing what you've learnt.</p>
		</StyledInstructions>
	);
}

export default Instructions;
