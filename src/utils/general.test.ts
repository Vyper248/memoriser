import { getSize, correctCardAdjustment, createNewCard } from "./general.utils";

it('Gets the size of a card based on points and last checked', () => {
    let recentTime = new Date().getTime();

    expect(getSize({points: 1})).toEqual('medium');
    expect(getSize({points: 5})).toEqual('small');
    expect(getSize({points: 0})).toEqual('large');
    expect(getSize({points: 2, lastChecked: 1674135909479, lastCheckingPeriod: '1 Hour'})).toEqual('large');
    expect(getSize({points: 2, lastChecked: recentTime, lastCheckingPeriod: '1 Hour'})).toEqual('medium');
});

it('Creates and returns a new card, using the groupId passed in', () => {
    let newGroup = createNewCard('1');
    expect(newGroup).toHaveProperty('id');
    expect(newGroup.groupId).toBe('1');
    expect(newGroup.question).toBe('Question?');
    expect(newGroup.answer).toBe('Answer');
    expect(newGroup.points).toBe(0);
});

it('Adjusts card points based on last checked time and period', () => {
    const mockSetState = jest.fn();

    let newId = new Date().getTime();

    let mockCard = {
        id: `${newId}`,
        groupId: '1',
        question: 'mock',
        answer: 'card',
        points: 1,
        lastChecked: newId,
        lastCheckingPeriod: '1 Hour',
    }

    correctCardAdjustment(mockCard, [mockCard], mockSetState);
    expect(mockSetState).toBeCalled();

    //hasn't been an hour, so don't update points
    expect(correctCardAdjustment(mockCard, [mockCard], mockSetState)[0].points).toBe(1);

    //newly created card with 0 points, so should update to 1 point and add lastChecked/lastCheckingPeriod
    let mockCard2 = {
        id: `${newId}`,
        groupId: '2',
        question: 'mock',
        answer: 'card',
        points: 0
    }

    expect(correctCardAdjustment(mockCard2, [mockCard2], mockSetState)[0].points).toBe(1);
    expect(correctCardAdjustment(mockCard2, [mockCard2], mockSetState)[0].lastChecked).not.toBe(undefined);
    expect(correctCardAdjustment(mockCard2, [mockCard2], mockSetState)[0].lastCheckingPeriod).toBe('1 Hour');

    //last checked over an hour ago, which matches lastCheckingPeriod, so increase to 2 points
    mockCard.lastChecked = newId-3700000;
    mockCard.lastCheckingPeriod = '1 Hour';
    expect(correctCardAdjustment(mockCard, [mockCard], mockSetState)[0].points).toBe(2);
    expect(correctCardAdjustment(mockCard, [mockCard], mockSetState)[0].lastChecked).not.toBe(newId-3700000);
    expect(correctCardAdjustment(mockCard, [mockCard], mockSetState)[0].lastCheckingPeriod).toBe('2 Hours');

    //last checked less than an hour ago, so don't increase, but do change lastChecked
    mockCard.lastChecked = newId-100000;
    mockCard.lastCheckingPeriod = '1 Hour';
    expect(correctCardAdjustment(mockCard, [mockCard], mockSetState)[0].points).toBe(1);
    expect(correctCardAdjustment(mockCard, [mockCard], mockSetState)[0].lastChecked).not.toBe(newId-100000);

    //last checked over an hour ago, but doesn't match lastCheckingPeriod, so increase to 2 points but don't change lastChecking Period
    mockCard.lastChecked = newId-3700000;
    mockCard.lastCheckingPeriod = '2 Hours';
    expect(correctCardAdjustment(mockCard, [mockCard], mockSetState)[0].points).toBe(2);
    expect(correctCardAdjustment(mockCard, [mockCard], mockSetState)[0].lastChecked).not.toBe(newId-3700000);
    expect(correctCardAdjustment(mockCard, [mockCard], mockSetState)[0].lastCheckingPeriod).toBe('2 Hours');
});