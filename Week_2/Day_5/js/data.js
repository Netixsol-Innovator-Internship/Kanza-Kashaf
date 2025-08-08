// Quiz data and application state
const QUIZ_DATA = {
    quizzes: [
        {
            id: 1,
            title: "JavaScript Essentials",
            category: "Programming",
            description: "Test your knowledge of JavaScript fundamentals",
            image: "./images/Pic1.png",
            questions: [
                {
                    id: 1,
                    question: "What is the correct way to declare a variable in JavaScript?",
                    options: ["var myVar;", "variable myVar;", "v myVar;", "declare myVar;"],
                    correct: 0
                },
                {
                    id: 2,
                    question: "Which method is used to add an element to the end of an array?",
                    options: ["append()", "push()", "add()", "insert()"],
                    correct: 1
                },
                {
                    id: 3,
                    question: "What does '===' operator do in JavaScript?",
                    options: ["Assigns value", "Compares value only", "Compares value and type", "Creates variable"],
                    correct: 2
                },
                {
                    id: 4,
                    question: "Which of the following is NOT a JavaScript data type?",
                    options: ["String", "Boolean", "Float", "Number"],
                    correct: 2
                },
                {
                    id: 5,
                    question: "How do you create a function in JavaScript?",
                    options: ["function myFunction() {}", "create myFunction() {}", "def myFunction() {}", "func myFunction() {}"],
                    correct: 0
                },
                {
                    id: 6,
                    question: "What is the result of '2' + 2 in JavaScript?",
                    options: ["4", "'22'", "22", "Error"],
                    correct: 1
                },
                {
                    id: 7,
                    question: "Which method is used to remove the last element from an array?",
                    options: ["pop()", "remove()", "delete()", "splice()"],
                    correct: 0
                },
                {
                    id: 8,
                    question: "What is the correct way to write a JavaScript array?",
                    options: ["var colors = 'red', 'green', 'blue'", "var colors = (1:'red', 2:'green', 3:'blue')", "var colors = ['red', 'green', 'blue']", "var colors = 1 = ('red'), 2 = ('green'), 3 = ('blue')"],
                    correct: 2
                },
                {
                    id: 9,
                    question: "How do you write 'Hello World' in an alert box?",
                    options: ["alertBox('Hello World');", "msg('Hello World');", "alert('Hello World');", "msgBox('Hello World');"],
                    correct: 2
                },
                {
                    id: 10,
                    question: "Which event occurs when the user clicks on an HTML element?",
                    options: ["onchange", "onclick", "onmouseclick", "onmouseover"],
                    correct: 1
                }
            ]
        },
        {
            id: 2,
            title: "Python Programming",
            category: "Programming",
            description: "Explore the fundamentals of Python programming",
            image: "./images/Pic2.png",
            questions: [
                {
                    id: 1,
                    question: "What is the correct file extension for Python files?",
                    options: [".pyth", ".pt", ".py", ".python"],
                    correct: 2
                },
                {
                    id: 2,
                    question: "Which of the following is used to define a function in Python?",
                    options: ["function", "def", "define", "func"],
                    correct: 1
                },
                {
                    id: 3,
                    question: "What is the output of print(2**3)?",
                    options: ["6", "8", "9", "23"],
                    correct: 1
                },
                {
                    id: 4,
                    question: "Which of the following is a mutable data type in Python?",
                    options: ["tuple", "string", "list", "int"],
                    correct: 2
                },
                {
                    id: 5,
                    question: "How do you insert comments in Python code?",
                    options: ["// This is a comment", "/* This is a comment */", "# This is a comment", " This is a comment "],
                    correct: 2
                },
                {
                    id: 6,
                    question: "What is the correct way to create a list in Python?",
                    options: ["list = (1, 2, 3)", "list = [1, 2, 3]", "list = {1, 2, 3}", "list = <1, 2, 3>"],
                    correct: 1
                },
                {
                    id: 7,
                    question: "Which method is used to add an item to the end of a list?",
                    options: ["add()", "append()", "insert()", "extend()"],
                    correct: 1
                },
                {
                    id: 8,
                    question: "What is the output of len('Hello')?",
                    options: ["4", "5", "6", "Error"],
                    correct: 1
                },
                {
                    id: 9,
                    question: "Which operator is used for floor division in Python?",
                    options: ["/", "//", "%", "**"],
                    correct: 1
                },
                {
                    id: 10,
                    question: "What is the correct way to import a module in Python?",
                    options: ["include module_name", "import module_name", "using module_name", "require module_name"],
                    correct: 1
                }
            ]
        },
        {
            id: 3,
            title: "HTML & CSS Basics",
            category: "Web Development",
            description: "Master the building blocks of web development",
            image: "./images/Pic3.png",
            questions: [
                {
                    id: 1,
                    question: "What does HTML stand for?",
                    options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlink and Text Markup Language"],
                    correct: 0
                },
                {
                    id: 2,
                    question: "Which HTML tag represents the largest heading?",
                    options: ["h6", "heading", "h1", "header"],
                    correct: 2
                },
                {
                    id: 3,
                    question: "What does CSS stand for?",
                    options: ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"],
                    correct: 1
                },
                {
                    id: 4,
                    question: "Which CSS property is used to change the text color?",
                    options: ["text-color", "font-color", "color", "text-style"],
                    correct: 2
                },
                {
                    id: 5,
                    question: "Which HTML attribute specifies an alternate text for an image?",
                    options: ["title", "alt", "src", "longdesc"],
                    correct: 1
                },
                {
                    id: 6,
                    question: "How do you make text bold in CSS?",
                    options: ["font-weight: bold;", "text-style: bold;", "font-style: bold;", "text-weight: bold;"],
                    correct: 0
                },
                {
                    id: 7,
                    question: "Which attribute is used in the <a> tag to specify the URL of the link?",
                    options: ["src", "link", "href", "url"],
                    correct: 2
                },
                {
                    id: 8,
                    question: "How do you select an element with id 'demo' in CSS?",
                    options: [".demo", "#demo", "demo", "*demo"],
                    correct: 1
                },
                {
                    id: 9,
                    question: "Which keyword represents an unordered list element in HTML?",
                    options: ["ol", "ul", "list", "li"],
                    correct: 1
                },
                {
                    id: 10,
                    question: "Which CSS rule correctly makes all paragraph text bold?",
                    options: [
                        "p {text-size: bold;}",
                        "p {font-weight: bold;}",
                        "p {font-size: bold;}",
                        "p {font-style: bold;}"
                    ],
                    correct: 1
                }
            ]
        },
        {
            id: 4,
            title: "React Fundamentals",
            category: "Frontend",
            description: "Test your knowledge of React concepts and best practices",
            image: "./images/Pic4.png",
            questions: [
                {
                    id: 1,
                    question: "What is JSX in React?",
                    options: ["A JavaScript library", "A syntax extension for JavaScript", "A CSS framework", "A database query language"],
                    correct: 1
                },
                {
                    id: 2,
                    question: "Which hook is used to manage state in functional components?",
                    options: ["useEffect", "useState", "useContext", "useReducer"],
                    correct: 1
                },
                {
                    id: 3,
                    question: "What is the correct way to pass data from parent to child component?",
                    options: ["Using state", "Using props", "Using context", "Using refs"],
                    correct: 1
                },
                {
                    id: 4,
                    question: "Which method is called after a component is rendered for the first time?",
                    options: ["componentDidMount", "componentWillMount", "componentDidUpdate", "componentWillUnmount"],
                    correct: 0
                },
                {
                    id: 5,
                    question: "What is the purpose of useEffect hook?",
                    options: ["To manage state", "To handle side effects", "To create refs", "To optimize performance"],
                    correct: 1
                },
                {
                    id: 6,
                    question: "How do you create a React component?",
                    options: ["function MyComponent() {}", "class MyComponent extends React.Component {}", "const MyComponent = () => {}", "All of the above"],
                    correct: 3
                },
                {
                    id: 7,
                    question: "What is the virtual DOM in React?",
                    options: ["A real DOM element", "A JavaScript representation of the real DOM", "A CSS framework", "A database"],
                    correct: 1
                },
                {
                    id: 8,
                    question: "Which of the following is used to handle events in React?",
                    options: ["onclick", "onClick", "onPress", "handleClick"],
                    correct: 1
                },
                {
                    id: 9,
                    question: "What is the correct way to update state in a functional component?",
                    options: ["this.setState()", "setState()", "Using the setter function from useState", "Directly modifying state"],
                    correct: 2
                },
                {
                    id: 10,
                    question: "What is React.Fragment used for?",
                    options: ["Creating animations", "Grouping elements without extra DOM nodes", "Managing state", "Handling errors"],
                    correct: 1
                }
            ]
        },
        {
            id: 5,
            title: "C++ Programming",
            category: "Programming C++",
            description: "Master the fundamentals of C++ programming language",
            image: "./images/Pic5.png",
            questions: [
                {
                    id: 1,
                    question: "Which header file is required for input/output operations in C++?",
                    options: ["stdio.h", "iostream", "conio.h", "fstream"],
                    correct: 1
                },
                {
                    id: 2,
                    question: "What is the correct way to declare a pointer in C++?",
                    options: ["int ptr;", "int *ptr;", "int &ptr;", "pointer int ptr;"],
                    correct: 1
                },
                {
                    id: 3,
                    question: "Which operator is used to access members of a class through a pointer?",
                    options: [".", "->", "::", "&"],
                    correct: 1
                },
                {
                    id: 4,
                    question: "What is the size of int data type in C++ (typically)?",
                    options: ["2 bytes", "4 bytes", "8 bytes", "Depends on system"],
                    correct: 3
                },
                {
                    id: 5,
                    question: "Which of the following is a valid way to declare a constant in C++?",
                    options: ["const int x = 10;", "constant int x = 10;", "final int x = 10;", "readonly int x = 10;"],
                    correct: 0
                },
                {
                    id: 6,
                    question: "What is function overloading in C++?",
                    options: ["Using same function name with different parameters", "Using different function names", "Calling functions multiple times", "Creating virtual functions"],
                    correct: 0
                },
                {
                    id: 7,
                    question: "Which access specifier makes class members accessible only within the same class?",
                    options: ["public", "private", "protected", "internal"],
                    correct: 1
                },
                {
                    id: 8,
                    question: "What is the correct syntax for a constructor in C++?",
                    options: ["ClassName() {}", "constructor ClassName() {}", "void ClassName() {}", "new ClassName() {}"],
                    correct: 0
                },
                {
                    id: 9,
                    question: "Which loop is guaranteed to execute at least once?",
                    options: ["for loop", "while loop", "do-while loop", "foreach loop"],
                    correct: 2
                },
                {
                    id: 10,
                    question: "What does the 'new' operator do in C++?",
                    options: ["Creates a new variable", "Allocates memory dynamically", "Deletes memory", "Creates a new function"],
                    correct: 1
                }
            ]
        }
    ]
};

// Application state
let currentUser = null;
let currentQuiz = null;
let currentQuestionIndex = 0;
let userAnswers = [];
let quizTimer = null;
let questionTimer = null;
let timeRemaining = 0;
let currentPage = 'landing';
