// Main application manager
let selectedCategory = 'All';

class AppManager {
    static init() {
        AuthManager.init();
        this.attachGlobalEventListeners();
        this.renderCurrentPage();
    }

    static renderCurrentPage() {
        if (currentPage === 'landing') {
            this.renderLandingPage();
        } else if (AuthManager.isLoggedIn()) {
            document.getElementById('navbar').classList.remove('hidden');
            this.updateNavbar();
            
            switch (currentPage) {
                case 'home':
                    this.renderHomePage();
                    break;
                case 'quizzes':
                    this.renderQuizzesPage();
                    break;
                case 'profile':
                    ProfileManager.renderProfilePage();
                    break;
                case 'quiz':
                    this.renderQuizPage();
                    break;
                case 'results':
                    this.renderResultsPage();
                    break;
                case 'review':
                    this.renderReviewPage();
                    break;
                default:
                    this.renderHomePage();
            }
        } else {
            this.renderLandingPage();
        }
    }

    static renderLandingPage() {
        document.getElementById('navbar').classList.add('hidden');
        currentPage = 'landing';
        
        const content = `
            <div class="min-h-screen bg-gradient-to-br">
                <nav class="bg-white shadow-sm">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div class="flex justify-between items-center h-16">
                            <div class="flex items-center">
                                <div>
                                    <img src="./images/Logo.png" alt="logo" class="mr-2 mt-1">
                                </div>
                                <div>
                                    <h1 class="text-xl font-bold text-gray-900">QuizMaster</h1>
                                </div>
                            </div>
                            <div class="flex items-center space-x-4">
                                <button id="signin-btn" class="text-gray-700 hover:text-blue-600 sm:px-3 py-2 rounded-md text-sm font-medium">Sign In</button>
                                <button id="signup-btn" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">Sign Up</button>
                            </div>
                        </div>
                    </div>
                </nav>

                <div class="relative overflow-hidden">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                        <div class="relative rounded-xl overflow-hidden shadow-2xl transform transition-all duration-700 ease-out hover:scale-[1.02]">
                            <div class="absolute inset-0 bg-cover bg-center bg-no-repeat" style="background-image: url('./images/BackgroundPic.png'); background-position: center center;">
                                <div class="absolute inset-0 bg-black/20"></div>
                            </div>
                            <div class="relative z-10 px-8 py-20 sm:px-12 sm:py-24 lg:px-16 lg:py-32 text-center">
                                <h1 class="text-white text-4xl md:text-5xl font-bold mb-4">Welcome to QuizMaster</h1>
                                <p class="text-white text-lg max-w-2xl mb-6 mx-auto">
                                    Test your knowledge with our engaging quizzes. Compete with friends and climb the leaderboard. Start your quiz journey today!
                                </p>
                                <button id="get-started-btn" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg text-lg transition">
                                    Get Started
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <section class="py-16 bg-white">
                    <div class="max-w-7xl mx-auto px-4">
                        <h2 class="text-3xl font-bold text-left text-gray-900 mb-4">Key Features</h2>
                        <p class="text-gray-600 text-left mb-12">Explore the exciting features that make QuizMaster the ultimate quiz app.</p>

                        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div class="text-left p-8 h-50 border rounded-lg shadow-sm">
                                <img src="./images/Time.png" alt="time" class="mb-5">
                                <h3 class="text-xl font-semibold text-gray-900 mb-2">Timed Quizzes</h3>
                                <p class="text-gray-600">Challenge yourself with timed quizzes to test your speed and accuracy</p>
                            </div>

                            <div class="text-left p-8 h-50 border rounded-lg shadow-sm">
                                <img src="./images/Cup.png" alt="time" class="mb-5">
                                <h3 class="text-xl font-semibold text-gray-900 mb-2">Leaderboard</h3>
                                <p class="text-gray-600">Compete with friends and other users to see who can achieve the highest scores</p>
                            </div>

                            <div class="text-left p-8 sm:h-50 border rounded-lg shadow-sm">
                                <img src="./images/Track.png" alt="time" class="mb-5">
                                <h3 class="text-xl font-semibold text-gray-900 mb-2">Progress Tracking</h3>
                                <p class="text-gray-600">Track your progress and see how you improve over time with detailed performance reports</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        `;

        document.getElementById('main-content').innerHTML = content;
        this.attachLandingEventListeners();
    }

    static renderHomePage() {
        document.getElementById('navbar').classList.remove('hidden');
        currentPage = 'home';

        const content = `
            <div class="min-h-screen bg-gradient-to-br">
                <div class="relative overflow-hidden">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                        <div class="relative rounded-xl overflow-hidden shadow-2xl transform transition-all duration-700 ease-out hover:scale-[1.02]">
                            <div class="absolute inset-0 bg-cover bg-center bg-no-repeat" style="background-image: url('./images/BackgroundPic.png'); background-position: center center;">
                                <div class="absolute inset-0 bg-black/40"></div>
                            </div>
                            <div class="relative z-10 px-8 py-20 sm:px-12 sm:py-24 lg:px-16 lg:py-32 text-center">
                                <h1 class="text-white text-4xl md:text-5xl font-bold mb-4">Welcome back to QuizMaster</h1>
                                <p class="text-white text-lg max-w-2xl mb-6 mx-auto">
                                    Ready to challenge yourself again? Take a quiz and continue your learning journey!
                                </p>
                                <button id="go-to-quizzes-btn" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg text-lg transition">
                                    Explore Quizzes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <section class="py-16 bg-white">
                    <div class="max-w-7xl mx-auto px-4">
                        <h2 class="text-3xl font-bold text-left text-gray-900 mb-4">Why Use QuizMaster?</h2>
                        <p class="text-gray-600 text-left mb-12">Here's what makes us stand out:</p>

                        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div class="text-left p-8 border rounded-lg shadow-sm">
                                <img src="./images/Time.png" alt="time" class="mb-5">
                                <h3 class="text-xl font-semibold text-gray-900 mb-2">Timed Quizzes</h3>
                                <p class="text-gray-600">Stay sharp by testing your knowledge against the clock.</p>
                            </div>
                            <div class="text-left p-8 border rounded-lg shadow-sm">
                                <img src="./images/Cup.png" alt="leaderboard" class="mb-5">
                                <h3 class="text-xl font-semibold text-gray-900 mb-2">Leaderboard</h3>
                                <p class="text-gray-600">Track your ranking and compete with others globally.</p>
                            </div>
                            <div class="text-left p-8 border rounded-lg shadow-sm">
                                <img src="./images/Track.png" alt="progress" class="mb-5">
                                <h3 class="text-xl font-semibold text-gray-900 mb-2">Progress Tracking</h3>
                                <p class="text-gray-600">Visualize how far you've come with smart progress metrics.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        `;

        document.getElementById('main-content').innerHTML = content;

        document.getElementById('go-to-quizzes-btn')?.addEventListener('click', () => {
            this.renderQuizzesPage();
        });

        this.updateNavbar();
    }

    static renderSignupPage() {
        document.getElementById('navbar').classList.add('hidden');
        
        const content = `
            <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div class="max-w-md w-full space-y-8">
                    <div class="text-center">
                        <h2 class="text-3xl font-bold text-gray-900">Create your account</h2>
                    </div>
                    <form id="signup-form" class="mt-8 space-y-6">
                        <div class="space-y-4">
                            <div>
                                <input id="signup-name" name="name" type="text" required 
                                       class="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" 
                                       placeholder="Full Name">
                            </div>
                            <div>
                                <input id="signup-email" name="email" type="email" required 
                                       class="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" 
                                       placeholder="Email">
                            </div>
                            <div>
                                <input id="signup-password" name="password" type="password" required 
                                       class="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" 
                                       placeholder="Password">
                            </div>
                            <div>
                                <input id="signup-confirm-password" name="confirmPassword" type="password" required 
                                       class="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" 
                                       placeholder="Confirm Password">
                            </div>
                        </div>

                        <div id="signup-error" class="text-red-600 text-sm hidden"></div>

                        <div>
                            <button type="submit" class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                Sign Up
                            </button>
                        </div>

                        <div class="text-center">
                            <span class="text-sm text-gray-600">Already have an account? </span>
                            <button type="button" id="switch-to-signin" class="text-blue-600 hover:text-blue-500 font-medium">Sign in</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.getElementById('main-content').innerHTML = content;
        this.attachSignupEventListeners();
    }

    static renderSigninPage() {
        document.getElementById('navbar').classList.add('hidden');
        
        const content = `
            <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div class="max-w-md w-full space-y-8">
                    <div class="text-center">
                        <h2 class="text-3xl font-bold text-gray-900">Welcome back</h2>
                    </div>
                    <form id="signin-form" class="mt-8 space-y-6">
                        <div class="space-y-4">
                            <div>
                                <input id="signin-email" name="email" type="email" required 
                                       class="appearance-none rounded-lg relative block w-full px-3 py-3 bg-gray-200  border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:z-10 sm:text-sm" 
                                       placeholder="Email">
                            </div>
                            <div>
                                <input id="signin-password" name="password" type="password" required 
                                       class="appearance-none rounded-lg relative block w-full px-3 py-3 bg-gray-200 border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:z-10 sm:text-sm" 
                                       placeholder="Password">
                            </div>
                        </div>

                        <div class="text-left">
                            <button type="button" class="text-sm text-blue-600 hover:text-blue-500">Forgot password?</button>
                        </div>

                        <div id="signin-error" class="text-red-600 text-sm hidden"></div>

                        <div>
                            <button type="submit" class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                Log in
                            </button>
                        </div>

                        <div class="text-center">
                            <span class="text-sm text-gray-600">Don't have an account? </span>
                            <button type="button" id="switch-to-signup" class="text-blue-600 hover:text-blue-500 font-medium">Sign up</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.getElementById('main-content').innerHTML = content;
        this.attachSigninEventListeners();
    }

    static renderQuizzesPage() {
        document.getElementById('navbar').classList.remove('hidden');
        currentPage = 'quizzes';
        
        const categories = ['All', 'Programming', 'Web Development', 'Programming C++', 'Frontend'];
        const searchTerm = document.getElementById('search-input')?.value || '';
        const filteredQuizzes = QuizManager.getFilteredQuizzes(selectedCategory, searchTerm);

        const content = `
            <div class="max-w-7xl mx-auto px-4 py-8">
                <div class="mb-8">
                    <h1 class="text-3xl font-bold text-gray-900 mt-2 mb-8">Select a Quiz</h1>
                    
                    <div class="flex flex-wrap gap-2 mb-6">
                        ${categories.map(category => `
                            <button class="category-tab px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                category === selectedCategory 
                                    ? 'bg-blue-600 text-white active' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }" data-category="${category}">
                                ${category}
                            </button>
                        `).join('')}
                    </div>
                </div>

                <div class="mb-12">
                    <h2 class="text-2xl font-semibold text-gray-900 mb-6">Featured Quizzes</h2>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        ${QUIZ_DATA.quizzes.slice(0, 3).map(quiz => `
                            <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer quiz-card" data-quiz-id="${quiz.id}">
                                <img src="${quiz.image}" alt="${quiz.title}" class="w-full h-48 object-cover rounded-t-lg">
                                <div class="p-6">
                                    <h3 class="text-lg font-semibold text-gray-900 mb-2">${quiz.title}</h3>
                                    <p class="text-gray-600 text-sm">${quiz.description}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div>
                    <h2 class="text-2xl font-semibold text-gray-900 mb-6">All Quizzes</h2>
                    <div class="space-y-4">
                        ${filteredQuizzes.map(quiz => `
                            <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer quiz-card flex items-center p-6" data-quiz-id="${quiz.id}">
                                <div class="flex-1">
                                    <h3 class="text-xl font-semibold text-gray-900 mb-2">${quiz.title}</h3>
                                    <p class="text-gray-600 mb-2">${quiz.description}</p>
                                    <span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">${quiz.category}</span>
                                </div>
                                <div class="ml-6">
                                    <img src="${quiz.image}" alt="${quiz.title}" class="w-24 h-24 object-cover rounded-lg">
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        document.getElementById('main-content').innerHTML = content;
        this.attachQuizzesEventListeners();
    }

    static renderQuizPage() {
        if (!currentQuiz) {
            this.renderQuizzesPage();
            return;
        }

        const question = currentQuiz.questions[currentQuestionIndex];
        const progress = ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100;
        const selectedAnswer = userAnswers[currentQuestionIndex];

        const content = `
            <div class="max-w-4xl mx-auto px-4 py-8">
                <div class="mb-8">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-sm font-medium text-gray-700">Progress</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div class="progress-bar bg-black h-2 rounded-full" style="width: ${progress}%"></div>
                    </div>
                    <span class="text-sm font-medium text-gray-400 mt-6">Question ${currentQuestionIndex + 1} of ${currentQuiz.questions.length}</span>
                </div>

                <div class="bg-white p-6 mb-8">
                    <div id="timer-display" class="timer-grid grid grid-cols-3 gap-4 max-w-xs mx-auto">
                    </div>
                </div>

                <div class="bg-white rounded-lg mb-8">
                    <h2 class="quiz-question text-2xl font-semibold text-gray-900 mb-8">${question.question}</h2>
                    
                    <div class="space-y-4">
                        ${question.options.map((option, index) => `
                            <button class="quiz-option w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors ${
                                selectedAnswer === index ? 'selected' : ''
                            }" data-answer="${index}">
                                <div class="flex items-center">
                                    <div class="w-6 h-6 border-2 border-gray-300 rounded-full mr-4 flex items-center justify-center">
                                        <div class="w-3 h-3 bg-blue-600 rounded-full ${selectedAnswer === index ? '' : 'hidden'}"></div>
                                    </div>
                                    <span class="text-gray-900">${option}</span>
                                </div>
                            </button>
                        `).join('')}
                    </div>
                </div>

                <div class="flex justify-between">
                    <button id="previous-button" class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors ${
                        currentQuestionIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
                    }" ${currentQuestionIndex === 0 ? 'disabled' : ''}>
                        Previous
                    </button>
                    
                    <button id="next-button" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
                        selectedAnswer === null ? 'opacity-50 cursor-not-allowed' : ''
                    }" ${selectedAnswer === null ? 'disabled' : ''}>
                        ${currentQuestionIndex === currentQuiz.questions.length - 1 ? 'Finish' : 'Next'}
                    </button>
                </div>
            </div>
        `;

        document.getElementById('main-content').innerHTML = content;
        this.attachQuizEventListeners();
        QuizManager.updateTimerDisplay();
    }

    static renderResultsPage() {
        const result = window.lastQuizResult;
        if (!result) {
            this.renderQuizzesPage();
            return;
        }

        const content = `
            <div class="max-w-4xl mx-auto px-4 py-8">
                <div class="bg-white p-8 text-center">
                    <h1 class="text-3xl font-bold text-gray-900 mb-8">Quiz Results</h1>
                    
                    <div class="mb-8">
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-sm font-medium text-gray-700">Quiz Completed</span>
                            <span class="text-sm font-medium text-gray-700">100%</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                            <div class="bg-black h-2 rounded-full" style="width: 100%"></div>
                        </div>
                    </div>

                    <div class="bg-gray-50 rounded-lg p-4 mb-4">
                        <div class="text-sm text-left text-gray-600 mb-2">Score</div>
                        <div class="text-2xl text-left font-bold text-gray-900 mb-2">${result.score}/${result.totalQuestions}</div>
                    </div>

                    <div class="text-sm text-gray-600 mb-4">
                        Congratulations ${currentUser ? currentUser.name : 'Guest'}! You've completed the quiz with a score of ${result.percentage}% out of 10. Your performance indicates a strong understanding of the subject matter. Keep up the excellent work!
                    </div>

                    <div class="flex flex-row gap-4 justify-center">
                        ${result.incorrectAnswers.length > 0 ? `
                            <button id="review-answers-btn" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                                Review Answers
                            </button>
                        ` : ''}
                        <button id="take-another-quiz-btn" class="bg-gray-300 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                            Take Another Quiz
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('main-content').innerHTML = content;
        this.attachResultsEventListeners();
    }

    static renderReviewPage() {
        const result = window.lastQuizResult;
        if (!result || !result.incorrectAnswers.length) {
            this.renderQuizzesPage();
            return;
        }

        const content = `
            <div class="max-w-4xl mx-auto px-4 py-8">
                <div class="bg-white rounded-lg shadow-sm p-8">
                    <h1 class="text-3xl font-bold text-gray-900 mb-8">Review Incorrect Answers</h1>
                    
                    <div class="space-y-8">
                        ${result.incorrectAnswers.map((item, index) => `
                            <div class="border-b border-gray-200 pb-6 ${index === result.incorrectAnswers.length - 1 ? 'border-b-0' : ''}">
                                <h3 class="text-lg font-semibold text-gray-900 mb-3">Question ${item.questionIndex}</h3>
                                <p class="text-gray-800 mb-4">${item.question}</p>
                                
                                <div class="space-y-2">
                                    <div class="flex items-start">
                                        <span class="text-red-600 font-medium mr-2">Your answer:</span>
                                        <span class="text-red-600">${item.userAnswer}</span>
                                    </div>
                                    <div class="flex items-start">
                                        <span class="text-green-600 font-medium mr-2">Correct answer:</span>
                                        <span class="text-green-600">${item.correctAnswer}</span>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <div class="mt-8 text-right">
                        <button id="back-to-quizzes-btn" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                            Back to Quizzes
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('main-content').innerHTML = content;
        this.attachReviewEventListeners();
    }

    static updateNavbar() {
        if (!AuthManager.isLoggedIn()) return;

        // Update profile avatar and name
        const profileAvatar = document.getElementById('profile-avatar');
        if (profileAvatar && currentUser) {
            profileAvatar.src = './images/ProfilePic.png';
        }

        // Update active nav item
        document.querySelectorAll('#navbar a').forEach(link => {
            link.classList.remove('text-gray-900');
            link.classList.add('text-gray-500');
        });

        const activeNavItem = document.getElementById(`nav-${currentPage}`);
        if (activeNavItem) {
            activeNavItem.classList.remove('text-gray-500');
            activeNavItem.classList.add('text-gray-900');
        }
    }

    static attachGlobalEventListeners() {
        // Search functionality
        document.addEventListener('input', (e) => {
            if (e.target.id === 'search-input') {
                if (currentPage === 'quizzes') {
                    this.renderQuizzesPage();
                }
            }
        });

        // Navigation Desktop
        document.addEventListener('click', (e) => {
            if (e.target.id === 'nav-home') {
                e.preventDefault();
                currentPage = 'home';
                this.renderHomePage();
            } else if (e.target.id === 'nav-quizzes') {
                e.preventDefault();
                this.renderQuizzesPage();
            } else if (e.target.id === 'nav-profile' || e.target.id === 'profile-button') {
                e.preventDefault();
                currentPage = 'profile';
                ProfileManager.renderProfilePage();
            }else if (e.target.id === 'profile-avatar' || e.target.id === 'profile-button') {
                e.preventDefault();
                currentPage = 'profile';
                ProfileManager.renderProfilePage();
            } else if (e.target.id === 'nav-leaderboard') {
                e.preventDefault();
                // Placeholder for leaderboard functionality
                alert('Leaderboard feature coming soon!');
            }
        });

        // Navigation Mobile
        document.addEventListener('click', (e) => {
            const id = e.target.id;

            if (id === 'nav-home' || id === 'mobile-nav-home') {
                e.preventDefault();
                currentPage = 'home';
                this.renderHomePage();
            } else if (id === 'nav-quizzes' || id === 'mobile-nav-quizzes') {
                e.preventDefault();
                this.renderQuizzesPage();
            } else if (id === 'mobile-nav-leaderboard') {
                e.preventDefault();
                alert('Leaderboard feature coming soon!');
            } else if (
                id === 'nav-profile' ||
                id === 'mobile-nav-profile' ||
                id === 'profile-button' ||
                id === 'profile-avatar'
            ) {
                e.preventDefault();
                currentPage = 'profile';
                ProfileManager.renderProfilePage();
            }
        });
    }

    static attachLandingEventListeners() {
        document.getElementById('get-started-btn').addEventListener('click', () => {
            this.renderSignupPage();
        });

        document.getElementById('signin-btn').addEventListener('click', () => {
            this.renderSigninPage();
        });

        document.getElementById('signup-btn').addEventListener('click', () => {
            this.renderSignupPage();
        });
    }

    static attachSignupEventListeners() {
        document.getElementById('signup-form').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm-password').value;
            
            const errorDiv = document.getElementById('signup-error');
            
            try {
                AuthManager.signup(name, email, password, confirmPassword);
                this.renderQuizzesPage();
            } catch (error) {
                errorDiv.textContent = error.message;
                errorDiv.classList.remove('hidden');
            }
        });

        document.getElementById('switch-to-signin').addEventListener('click', () => {
            this.renderSigninPage();
        });
    }

    static attachSigninEventListeners() {
        document.getElementById('signin-form').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('signin-email').value;
            const password = document.getElementById('signin-password').value;
            
            const errorDiv = document.getElementById('signin-error');
            
            try {
                AuthManager.signin(email, password);
                currentPage = 'home';
                this.renderHomePage();
            } catch (error) {
                errorDiv.textContent = error.message;
                errorDiv.classList.remove('hidden');
            }
        });

        document.getElementById('switch-to-signup').addEventListener('click', () => {
            this.renderSignupPage();
        });
    }

    static attachQuizzesEventListeners() {
        // Category tabs
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                selectedCategory = tab.dataset.category;
                currentPage = 'quizzes';
                this.renderQuizzesPage();
            });
        });

        // Quiz cards
        document.querySelectorAll('.quiz-card').forEach(card => {
            card.addEventListener('click', () => {
                const quizId = parseInt(card.dataset.quizId);
                try {
                    QuizManager.startQuiz(quizId);
                    currentPage = 'quiz';
                    this.renderQuizPage();
                } catch (error) {
                    alert(error.message);
                }
            });
        });
    }

    static attachQuizEventListeners() {
        // Answer selection
        document.querySelectorAll('.quiz-option').forEach(option => {
            option.addEventListener('click', () => {
                const answerIndex = parseInt(option.dataset.answer);
                QuizManager.selectAnswer(answerIndex);
            });
        });

        // Navigation buttons
        const previousButton = document.getElementById('previous-button');
        const nextButton = document.getElementById('next-button');

        if (previousButton) {
            previousButton.addEventListener('click', () => {
                QuizManager.previousQuestion();
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                if (userAnswers[currentQuestionIndex] !== null) {
                    QuizManager.nextQuestion();
                }
            });
        }
    }

    static attachResultsEventListeners() {
        const reviewButton = document.getElementById('review-answers-btn');
        const takeAnotherButton = document.getElementById('take-another-quiz-btn');

        if (reviewButton) {
            reviewButton.addEventListener('click', () => {
                currentPage = 'review';
                this.renderReviewPage();
            });
        }

        if (takeAnotherButton) {
            takeAnotherButton.addEventListener('click', () => {
                this.renderQuizzesPage();
            });
        }
    }

    static attachReviewEventListeners() {
        document.getElementById('back-to-quizzes-btn').addEventListener('click', () => {
            this.renderQuizzesPage();
        });
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    AppManager.init();
});
