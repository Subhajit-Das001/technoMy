

// Array of questions
const questions = [
    {
        id: 1,
        question: "The switch box in your new house is in an inconvenient corner of your basement. To your disappointment, you discover none of the 250 switches is labeled. (Suppose each switch maps to only one light.) To start with, you switch all 250 lights in the house to 'on', and then you head down to your basement to begin the mapping process. On every trip to your basement, you can switch any number of switches on or off. You can then roam the hallways of your house to discover which lights are on and which are off. What is the minimum number of trips you need to make to the basement to map every switch to every light?",
    },
    {
        id: 2,
        question: "At a restaurant, pizzas can be ordered in boxes of 6, 9, and 20. What is the highest number of pizzas that cannot be bought with any combination of these boxes?",
    },
    {
        id: 3,
        question: "Amber and Bosco are preparing for a holiday party, and each has a pie to slice up into pieces. They decide to have a little contest to make things fun. Each person is allowed to make 81 cuts of the pie with a knife, and whoever ends up with more pieces is the winner. They agree stacking is not allowed, but that “centerpieces without the crust are permissible. How many maximum pieces can be made using 81 cuts?",
    },
    {
        id: 4,
        question: "What is the minimum number of shots needed to guarantee hitting a battleship (a 4 × 1 rectangle) on a 10 × 10 board? The battleship can be located anywhere on the board and may be oriented either horizontally or vertically. You may assume that there are no other ships. (A “shot” is a blind guess of a square on the board.)",
    },
    {
        id: 5,
        question: "In a city shrouded in darkness, four brave superheroes find themselves faced with a daunting task: crossing a treacherous bridge at night, with only one torch to guide their way. Each hero possesses unique abilities, with varying speeds to traverse the bridge: The Flash, with lightning speed, takes 1 minute to cross; Batman, stealthy and resourceful, takes 2 minutes; Wonder Woman, with her unmatched strength and courage, takes 7 minutes; and Thor, wielding the power of thunder, takes 10 minutes. To ensure the safety of all four heroes, they must devise a plan to cross the bridge in the shortest time possible. With the fate of the city hanging in the balance, what is the minimum time in which to overcome this challenge?",
    },
    {
        id: 6,
        question: `Consider a circle containing n numbers in which there exists a free circular permutation of the numbers from 1 to n with adjacent pairs summing to a prime. For n = 4, one of the following permutations exists.Then for n = 10, find the total number of possible permutations.`,
    },
    {
        id: 7,
        question: "Twenty-four ants are placed randomly on a meter-long rod; each ant is facing east or west with equal probability. At a signal, they proceed to march forward (that is, in whatever direction they are facing) at 1 cm/sec; whenever two ants collide, they reverse directions. How long does it take (in seconds) before you can be certain that all the ants are off the rod?",
    },
    {
        id: 8,
        question: "Place a stick on each edge of each 1x1 cell of an 8x8 chessboard. On an edge common to two cells, place exactly one stick. Find the minimum number of sticks to be deleted so that the remaining sticks do not form any rectangle.",
    }
];

// Array of answers
const answers = [8, 43, 3322, 24, 17, 48, 100, 43];

module.exports = {
    questions,
    answers
};
