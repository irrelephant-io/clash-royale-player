const assert = require('chai').assert;
const _ = require('lodash');
const range = _.range;
const cards = require('./cards.json');

const moduleUnderTest = require('./index.js')

const RANDOM_TEST_CASE_COUNT = 1000;
const MAX_DECK_SIZE = 8;
const HAND_SIZE = 4;
const TURN_COUNT = 100;

function getExpectedResult(input) {
    const deck = _.uniq(input);
    const lastPlayedHand = _.takeRight(input, HAND_SIZE);

    return _.difference(deck, lastPlayedHand);
}

function generateTestCase(idx) {
    const randomDeck = _.sampleSize(cards, MAX_DECK_SIZE);
    const currentHand = _.sampleSize(randomDeck, HAND_SIZE);
    const drawPile = _.difference(randomDeck, currentHand);
    
    // Generate TURN_COUNT turns
    // Each turn:
    // - Play random card in our hand
    // - Put the played card on the top of the draw pile
    // - Draw the bottom card of the draw pile into the hand
    const playsSoFar = [];
    
    for (let turn = 0; turn < TURN_COUNT; turn++) {
        const cardToPlay = _.sample(currentHand);
        _.pull(currentHand, cardToPlay);
        drawPile.push(cardToPlay);
        const nextToDraw = drawPile.shift();
        currentHand.push(nextToDraw);
        playsSoFar.push(cardToPlay);
    }
    
    return [idx, playsSoFar];
}

describe('getCurrentHand', () => {
    _.chain(range(RANDOM_TEST_CASE_COUNT))
        .map(generateTestCase)
        .forEach(([testCaseIndex, testCase]) => {
            it(`Random test ${testCaseIndex + 1}`, () => {
                const actual = moduleUnderTest.getCurrentHand(testCase);
                const expected = getExpectedResult(testCase);

                assert.deepEqual(new Set(actual), new Set(expected));
            });            
        })
        .value();
});
