const temporaryTechnopediaContest = {
    contest: 'Technopedia Contest 2025',
    year: '2025',
    startTime: new Date('2025-11-10T00:00:00.000Z'),
    endTime: new Date('2026-11-22T00:00:00.000Z'),
    questions: [
        {
            questionId: 1,
            letter: 'A',
            title: 'Monochromatic Polygon Problem',
            content: `There are an unlimited number of laser nodes that can emit either a green or blue light between any two of them.
However, the team cannot control which color is produced between any given pair of nodes.
To create an efficient light source, they need to ensure that at least one polygon (such as a triangle or square) is formed using rays all of the same color (e.g., an all-green triangle or an all-blue square).
What is the smallest number of nodes needed to guarantee that such a monochromatic polygon will always be formed?
Note: The nodes are always arranged as the vertices of a regular polygon.`,
            answer: 6,
            points: 100
        },
        {
            questionId: 2,
            letter: 'B',
            title: 'Minimum Possible Score in a Team Game',
            content: `A, B and C join a game as a team.
Each of them has to independently answer 2021 yes-no questions (the questions are the same for everyone), in each of which either 'yes' or 'no' must be chosen.
After that, the answers of A and B are compared and the number of questions in which they chose the same answer is recorded.
The same is done for A's and C's answers, as well as for B's and C's answers.
The score of the team in the game is the largest number recorded.
Find the minimum possible score of the team in the game.`,
            answer: 674,
            points: 100
        },
        {
            questionId: 3,
            letter: 'C',
            title: 'Steps on a Stopped Escalator',
            content: `Jack and Paul are descending a similar escalator.
Jack walks down, taking 250 steps to reach the bottom; Paul ran down, taking 375.
Paul ran three steps in the time it took Jack to walk one.
Find out how many steps will be visible when the escalator is stopped.`,
            answer: 500,
            points: 100
        },
        {
            questionId: 4,
            letter: 'D',
            title: 'Minimum Students for Common Topic',
            content: `In a class, every pair of students has a conversation, but always about exactly one of three different topics.
Each pair chooses one topic and sticks to it.
What is the minimum number of students required to guarantee that there will always be three students such that every pair among them talked about the same topic?`,
            answer: 17,
            points: 100
        },
        {
            questionId: 5,
            letter: 'E',
            title: 'Danger Symbol on a Grid',
            content: `On the 51x51 grid wall of the building, there is a danger symbol on one of the squares and Heart symbols on the other 2600 squares.
In one move, a player may reverse the symbols (danger symbol to heart symbol and heart symbol to danger symbol) of any a*a subgrid where a > 1.
The player has to reach a stage when each square on the grid is a Heart symbol in order to win.
How many such places are possible for the danger symbol?`,
            answer: 200,
            points: 100
        },
        {
            questionId: 6,
            letter: 'F',
            title: 'Alien Multiplication Problem',
            content: `In a distant galaxy, Earth has been invaded by Aliens.
These aliens have a special way of multiplying: the number of aliens (n) can be replaced by a * b aliens if a + 2b = n, where n, a, and b are natural numbers.
If the alien population ever becomes exactly 2020, humanity’s hope is lost forever.
The aliens know that after a sequence of such replacements, there are some numbers from which 2020 can never be reached, even if they keep multiplying forever.
Find the sum of all initial numbers from which 2020 can’t be reached.`,
            answer: 36,
            points: 100
        },
        {
            questionId: 7,
            letter: 'G',
            title: 'Unlocking the Door with Identical Keys',
            content: `A door is locked with a special lock having two separate keyholes.
One needs to put two keys in the keyholes and turn them at the same time to open the door.
Aakash has a bunch of 8 identical keys, out of which 4 of them fit the lock and the other 4 don’t.
To unlock the door, he can try different combinations using two keys at a time.
What is the least number of attempts in which he can open the door?`,
            answer: 28,
            points: 100
        },
        {
            questionId: 8,
            letter: 'H',
            title: 'Unique Word Game Scoring',
            content: `Three boys played a "Word" game in which they each wrote down ten words.
For each word a boy wrote, he scored three points if neither of the other boys had the same word;
he scored one point if only one of the other boys had the same word.
No points were awarded for words which all three boys had.
When they added up their scores, they found that they each had different scores.
Shyam had the smallest score (19 points), and James scored the most.
How many points did James score?.`,
            answer: 25,
            points: 100
        },
        {
            questionId: 9,
            letter: 'I',
            title: 'Elevator Problem with Fixed Movement',
            content: `There are 85 floors in the tower and a single elevator to travel from one floor to another.
There are no stairs.
The elevator has a wiring mismatch due to which it can move exactly 7 floors upwards or 9 floors downwards.
The elevator takes 34 seconds to move to the next allowed floor (34 seconds to climb 7 floors and 34 seconds to come down 9 floors).
How much time does it take for the elevator to reach floor number 80 when it starts from the first floor?
(Answer in seconds)`,
            answer: 850,
            points: 100
        },
        {
            questionId: 10,
            letter: 'J',
            title: 'Milk-Drinking Dragons',
            content: `There are 2022 milk-drinking dragons standing in a row.
The first dragon has 1 pint of milk, the second has 2 pints, and so on, up to the 2022nd dragon which has 2022 pints.
The first dragon will transfer half his milk and half a pint to the second one, then the second will transfer half his milk and half a pint to the third one, and so on until the 2021st dragon transfers half his milk and half a pint to the 2022nd one.
How much milk (in pints) will the 2022nd dragon have after that?`,
            answer: 4043,
            points: 100
        }
    ]
};

module.exports = {
    temporaryTechnopediaContest,
    questions: temporaryTechnopediaContest.questions,
    answers: temporaryTechnopediaContest.questions.map((question) => question.answer)
};