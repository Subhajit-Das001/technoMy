const temporaryTechnopediaContest = {
  contest: 'TechnoQuest 2026',
  year: 'TechnoQuest-2026',
  startTime: new Date('2026-06-10T00:00:00.000Z'),
  endTime: new Date('2026-11-22T00:00:00.000Z'),    
  questions: [
    {
      "questionId": 1,
      "letter": "A",
      "title": "The General's Dilemma",
      "content": `If the squared distance between some two soldiers equals to 5, then those soldiers will conflict with each other! The drill exercises are held on a rectangular n × m field, split into nm square 1 × 1 segments for each soldier. Thus, the square of the distance between the soldiers that stand on squares(x1, y1) and (x2, y2) equals exactly(x1-x2)^2 +(y1-y2)^2. Now not all nm squad soldiers can participate in the drill exercises as it was before the old witch curse. Unless, of course, the general wants the soldiers to fight with each other or even worse. For example, if he puts a soldier in the square (2, 2), then he cannot put soldiers in the squares (1, 4), (3, 4), (4, 1) and (4, 3) — each of them will conflict with the soldier in the square (2, 2). Find the sum of maximum number of soldiers that can be simultaneously positioned on this field for each of the following cases 
I) 1002 2
II) 451 2
III) 780 2
IV) 121 2 `,
      "answer": "2358",
      "points": 100
    },
    {
      "questionId": 2,
      "letter": "B",
      "title": "The game",
      "content": `Poulomi and Uday devise a path to follow. Poulomi writes down the first six intervals for a break: 0 1 2 3 4 5
Each subsequent interval is the last digit of the sum of the previous six intervals. Poulomi starts scribbling down the entire sequence of intervals. Help Uday find out which of the following subsequences will never occur.
A) 1 3 5 7 9
B) 9 7 5 3 1
C) 3 1 5 9 7
D) All
Answer 1 for A, 2 for B, and so on`,
      "answer": "1",
      "points": 100
    },
    {
      "questionId": 3,
      "letter": "C",
      "title": "Mr. and Mrs. Srivastava",
      "content": `Mr. and Mrs. Srivastava threw a dinner party, and invited four other couples: the Shobhanes, the Patnis, the Mukherjees, and the Umbarkars. When all the guests had arrived there were ten people in the house. Some of these people had met before and some hadn't. All the people who had never met before shook hands. Then Mr. Srivastava asked every guest and his own wife how many hands
each of them had shook. To his surprise every person gave a different answer. How many hands did Mrs. Srivastava shake?`,
      "answer": "4",
      "points": 100
    },
    {
      "questionId": 4,
      "letter": "D",
      "title": "HANGMAN",
      "content": `It is a leisure period in Kabya's school and he decides to play the word-guessing game, HANGMAN, with his friend Ritik.
The rules of the game are:
→ Kabya thinks of a word and tells Ritik the number of letters in the word.
→ Ritik has to guess the letters in the word.
→ At most, Kabya can guess incorrectly 7 times.
→ If he guesses all the letters before getting 7 incorrect guesses, Ritik wins.
→ Otherwise, Kabya wins.
Kabya thinks of an 8-letter word. He further gives Revanth a hint as: If you guess correctly every time, you can win the game with 6 guesses.
Ritik starts guessing alphabetically but loses. Among all his guesses, he could get only 2 guesses correct, 1 vowel and 1 consonant.
Which of these vowels is definitely NOT present in the word?
A) A (B) E (C) I (D) O
Answer 1 for A, 2 for B, and so on`,
      "answer": "3",
      "points": 100
    },
    {
      "questionId": 5,
      "letter": "E",
      "title": "Deep's cubes",
      "content": `Deep has been given 2 cubes, using which he has to represent all the months and dates. Each face of a cube bears different digits (from 0-9), but the digits on the two cubes can be the same. He does that first assuming that ‘5’ will be represented as ‘5’ and not ‘05’. He then repeats the same for the the case where ‘5’ is represented as ‘05’. What’s the minimum number of common faces the two cubes can have, with first cube faces adding up to give the least sum, in the two cases. Answer 1 for A, 2 for B, and so on  
1) 2,2
2) 2,3
3) 3,3
4) 3,2`,
      "answer": "2",
      "points": 100
    },
    {
      "questionId": 6,
      "letter": "F",
      "title": "IIT Guwahati's tunnel",
      "content": `The instructions read as follows:
Every person entering IIT Guwahati will be given a bowl with 15 red flowers and 12 yellow flowers. Each time the Gong of Time rings, he/she must do one of two things:
1. Exchange: If he has at least 3 red flowers in his bowl, then he may exchange 3 red flowers for 2 yellow flowers.
2. Swap: He may replace each yellow flowers in his bowl with a red flowers and replace each red flowers in his bowl with a yellow flowers. That is, if he starts with i red flowers and j yellow flowers, then after he performs this operation, he will have j red flowers and i yellow flowers. [You can leave the tunnel only when you make all the combinations (no. of red, no. of yellow) of flowers that are possible].
What is the number of combinations you need to make to leave the tunnel? `,
      "answer": "52",
      "points": 100
    },
    {
      "questionId": 7,
      "letter": "G",
      "title": "Mario's Dilemma",
      "content": "Mario visits a chocolate store nearby where the shopkeeper has 9 jars filled with 4,2,6,7,3,4,5,8,3 jellyfishes respectively. Each second he is allowed to either double the content of one jar, or eat 9 jellyfishes (one from each jar). Can Mario always empty all the jars using these moves?If yes, then give the minimum time required to empty the jars ? (Answer 0 if no)",
      "answer": "19",
      "points": 100
    },
    {
      "questionId": 8,
      "letter": "H",
      "title": "Chess game",
      "content": `Shreshtha is given a 3x3 chessboard. Shreshtha is asked to place 2 black rooks, 2 white knights and 1 white bishop on this board in such a way that:
a. each piece threatens one or more pieces of the opponent
b. each piece is protected by another piece of its own colour
c. each piece (except the black queen) is under attack by some opponent piece

Let the pieces be assigned numbers as follows: Queen=9, Knight=3, Bishop=3, Rook=5 on black squares and respective negative values on white squares. Find out the ‘sum’ of all pieces in the arranged position.`,
      "answer": "1",
      "points": 100
    },
    {
      "questionId": 9,
      "letter": "I",
      "title": "Cards on table",
      "content": `There are 20 cards arranged in a row on the table. Each card is showing a positive integer. On each player's turn, he allowed to take either the left most or right most card. This is done until all the cards are taken. The winner is the player who has the greatest sum of numbers on his/her cards. What should be your first move so that he can win the game?
The sequences are: A -> 2 11 13 8 12 5 6 8 9 21 10 7 15 17 18 4 16 18 19 1
 B ->12 18 13 4 8 16 17 5 3 19 21 1 6 11 12 18 14 15 6 9
a. 1 from A and 9 from B
b. 2 from A and 12 from B
c. 2 from A and 9 from B
d. he cannot win in any case
Answer 1 for A, 2 for B, and so on`,
      "answer": "3",
      "points": 100
    },
    {
      "questionId": 10,
      "letter": "J",
      "title": "IO language",
      "content": ` Shifu explains that there are only 2 letters in the alphabet of the IO language I and O and for Po to understand better, he substitutes I for the riceball and O for dumpling. Shifu says any dish will consist of combinations of riceball or dumplings lined together.If he removes two neighbouring components ,”riceball and dumpling” from any plate then he will get a dish with the same meaning. Similarly, the dish will not change if he inserts combinations of “dumpling,riceball” or “riceball, riceball, dumpling, dumpling”. Po has been given a word having a combination of IOOIIIOIIOOOIOIOIIO, and has to pick tiles having words of the same meaning so as to win the game of MahJong. Help Po to find the number of words from the given list that have the same meaning as that of IOOIIIOIIOOOIOIOIIO
1. IIOIIOOOIIOIOOIOIOII
2. OIOIOIOIOIOIOIOIOIOI
3. OIIOIOOIOOOOIIOIIII
4. OOOIOOIOIOIOIIIOIII
5. IOIOIOOIIOIOOIIOIIOIO
6. IIIOOIOOIIOIOOIOIOOOI`,
      "answer": "2",
      "points": 100
    }
  ]
};

module.exports = {
  temporaryTechnopediaContest,
  questions: temporaryTechnopediaContest.questions,
  answers: temporaryTechnopediaContest.questions.map((question) => question.answer)
};