// Quiz management functions
class QuizManager {
    static startQuiz(quizId) {
        currentQuiz = QUIZ_DATA.quizzes.find(q => q.id === quizId);
        if (!currentQuiz) {
            throw new Error('Quiz not found');
        }

        currentQuestionIndex = 0;
        userAnswers = [];
        timeRemaining = 30; // 30 seconds per question

        // Initialize user answers array
        for (let i = 0; i < currentQuiz.questions.length; i++) {
            userAnswers.push(null);
        }

        this.startQuestionTimer();
    }

    static startQuestionTimer() {
        timeRemaining = 30;
        this.updateTimerDisplay();

        questionTimer = setInterval(() => {
            timeRemaining--;
            this.updateTimerDisplay();

            if (timeRemaining <= 0) {
                this.nextQuestion();
            }
        }, 1000);
    }

    static updateTimerDisplay() {
        const hours = Math.floor(timeRemaining / 3600);
        const minutes = Math.floor((timeRemaining % 3600) / 60);
        const seconds = timeRemaining % 60;

        const timerElement = document.getElementById('timer-display');
        if (timerElement) {
            timerElement.innerHTML = `
                    <div class="bg-gray-100 rounded-lg py-4 px-2 sm:px-6 text-center w-full">
                        <div class="text-3xl font-semibold" id="timer-hours">${hours.toString().padStart(2, '0')}</div>
                        <div class="text-sm text-gray-500 mt-1">Hours</div>
                    </div>
                    <div class="bg-gray-100 rounded-lg py-4 px-1 sm:px-6 text-center w-full">
                        <div class="text-3xl font-semibold" id="timer-minutes">${minutes.toString().padStart(2, '0')}</div>
                        <div class="text-sm text-gray-500 mt-1">Minutes</div>
                    </div>
                    <div class="bg-gray-100 rounded-lg py-4 px-1 sm:px-6 text-center w-full">
                        <div class="text-3xl font-semibold" id="timer-seconds">${seconds.toString().padStart(2, '0')}</div>
                        <div class="text-sm text-gray-500 mt-1">Seconds</div>
                    </div>
            `;
        }
    }

    static selectAnswer(answerIndex) {
        userAnswers[currentQuestionIndex] = answerIndex;
        
        // Update UI to show selected answer
        const options = document.querySelectorAll('.quiz-option');
        options.forEach((option, index) => {
            option.classList.remove('selected');
            if (index === answerIndex) {
                option.classList.add('selected');
            }
        });

        // Enable next button
        const nextButton = document.getElementById('next-button');
        if (nextButton) {
            nextButton.disabled = false;
            nextButton.classList.remove('opacity-50', 'cursor-not-allowed');
            nextButton.classList.add('hover:bg-blue-700');
        }
    }

    static nextQuestion() {
        if (questionTimer) {
            clearInterval(questionTimer);
        }

        if (currentQuestionIndex < currentQuiz.questions.length - 1) {
            currentQuestionIndex++;
            AppManager.renderQuizPage();
            this.startQuestionTimer();
        } else {
            this.finishQuiz();
        }
    }

    static previousQuestion() {
        if (currentQuestionIndex > 0) {
            if (questionTimer) {
                clearInterval(questionTimer);
            }
            currentQuestionIndex--;
            AppManager.renderQuizPage();
            this.startQuestionTimer();
        }
    }

    static finishQuiz() {
        if (questionTimer) {
            clearInterval(questionTimer);
        }

        // Calculate score
        let correctAnswers = 0;
        const incorrectAnswers = [];

        currentQuiz.questions.forEach((question, index) => {
            if (userAnswers[index] === question.correct) {
                correctAnswers++;
            } else {
                incorrectAnswers.push({
                    question: question.question,
                    userAnswer: userAnswers[index] !== null ? question.options[userAnswers[index]] : 'No answer',
                    correctAnswer: question.options[question.correct],
                    questionIndex: index + 1
                });
            }
        });

        const score = correctAnswers;
        const totalQuestions = currentQuiz.questions.length;

        // Save quiz result
        if (AuthManager.isLoggedIn()) {
            const quizResult = {
                quizId: currentQuiz.id,
                quizTitle: currentQuiz.title,
                score: score,
                totalQuestions: totalQuestions,
                percentage: Math.round((score / totalQuestions) * 100),
                date: new Date().toISOString().split('T')[0],
                incorrectAnswers: incorrectAnswers
            };

            currentUser.quizHistory.push(quizResult);
            currentUser.totalQuizzes++;
            AuthManager.updateUser(currentUser);
        }

        // Store results for display
        window.lastQuizResult = {
            score,
            totalQuestions,
            percentage: Math.round((score / totalQuestions) * 100),
            incorrectAnswers
        };

        AppManager.renderResultsPage();
    }

    static getFilteredQuizzes(category = 'All', searchTerm = '') {
        let filteredQuizzes = QUIZ_DATA.quizzes;

        if (category !== 'All') {
            filteredQuizzes = filteredQuizzes.filter(quiz => quiz.category === category);
        }

        if (searchTerm) {
            filteredQuizzes = filteredQuizzes.filter(quiz => 
                quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return filteredQuizzes;
    }
}
