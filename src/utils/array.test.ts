import { addToArray, editInArray, filterArrayByGroupId, removeFromArray, sortArray, getNextValue } from "./array.utils";

it('Adds an object to the array and returns that array', () => {
    let array2 = [{id: '1'}, {id: '2'}, {id: '3'}];
    expect(addToArray({id: '4'}, array2)).toEqual([{id: '4'}, {id: '1'}, {id: '2'}, {id: '3'}]);
});

it('Edits an object in an array and returns that array', () => {
    let array = [{id: '1', word: 'five'}, {id: '2'}, {id: '3'}];
    expect(editInArray({id: '1', word: 'six'}, array)).toEqual([{id: '1', word: 'six'}, {id: '2'}, {id: '3'}]);
});

it('Removes an object from the array and returns that array', () => {
    let array = [{id: '1'}, {id: '2'}, {id: '3'}];
    expect(removeFromArray({id: '1'}, array)).toEqual([{id: '2'}, {id: '3'}]);
    expect(removeFromArray({id: '3'}, array)).toEqual([{id: '1'}, {id: '2'}]);
});

it('Filters objects from the array that have a given id and returns that array', () => {
    let array = [{id: '1', groupId: '1'}, {id: '2', groupId: '2'}, {id: '3', groupId: '1'}];
    expect(filterArrayByGroupId('1', array)).toEqual([{id: '1', groupId: '1'}, {id: '3', groupId: '1'}]);
    expect(filterArrayByGroupId('2', array)).toEqual([{id: '2', groupId: '2'}]);
});

it('Sorts array based on points and last checking data', () => {
    let array = [{id: '1', points: 14}, {id: '2', points: 3}, {id: '3', points: 21}, {id: '4', points: 8}];
    expect(sortArray(array)).toEqual([{id: '2', points: 3}, {id: '4', points: 8}, {id: '1', points: 14}, {id: '3', points: 21}]);
    expect(sortArray(array)).not.toEqual([{id: '1', points: 14}, {id: '2', points: 3}, {id: '3', points: 21}, {id: '4', points: 8}]);
    expect(sortArray([])).toEqual([]);
});

it('Gets the next value from an array', () => {
    let array = ['1', '2', '3', '4'];
    expect(getNextValue('1', array)).toEqual('2');
    expect(getNextValue('3', array)).toEqual('4');
    expect(getNextValue('4', array)).toEqual('4');
    expect(getNextValue(undefined, array)).toEqual('1');
});