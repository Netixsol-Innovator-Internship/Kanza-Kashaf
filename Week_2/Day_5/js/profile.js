// Profile management functions
class ProfileManager {
    static renderProfilePage() {
        if (!AuthManager.isLoggedIn()) {
            AppManager.renderSigninPage();
            return;
        }

        const content = `
            <div class="max-w-4xl mx-auto px-4 py-8">
                <div class="bg-white p-8 mb-6 text-center">
                    <img src="./images/ProfilePic.png" alt="Profile" class="w-30 h-30 rounded-full mx-auto mb-4">
                    <h1 class="text-2xl font-bold text-gray-900 mb-2">${currentUser.name}</h1>
                    <p class="text-gray-600 mb-2">Quiz Enthusiast</p>
                    <p class="text-sm text-gray-500">Joined ${new Date(currentUser.joinDate).getFullYear()}</p>
                </div>

                <div class="bg-white">
                    <div class="border-b border-gray-200">
                        <nav class="-mb-px flex">
                            <button id="profile-tab" class="profile-tab-btn active py-4 px-6 text-sm font-medium border-b-2 border-blue-500 text-blue-600">
                                Profile
                            </button>
                            <button id="activity-tab" class="profile-tab-btn py-4 px-6 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700">
                                Activity
                            </button>
                        </nav>
                    </div>

                    <div id="profile-tab-content" class="p-6">
                        ${this.renderProfileTabContent()}
                    </div>
                </div>
            </div>
        `;

        document.getElementById('main-content').innerHTML = content;
        this.attachProfileEventListeners();
    }

    static renderProfileTabContent() {
        return `
            <div class="space-y-8">
                <div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 border-t pt-4 border-gray-200 mb-1">Name</label>
                            <p class="text-gray-900">${currentUser.name}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 border-t border-gray-200 pt-4 mb-1">Email</label>
                            <p class="text-gray-900">${currentUser.email}</p>
                        </div>
                    </div>
                    <div class="mt-4">
                        <label class="block text-sm font-medium text-gray-700 border-t border-gray-200 pt-4 mb-1">Bio</label>
                        <p class="text-gray-600">${currentUser.bio}</p>
                    </div>
                </div>

                <div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Quiz History</h3>
                    <div class="overflow-x-auto border border-gray-200 rounded-xl">
                        <table class="min-w-full border divide-y divide-gray-200 border-gray-200">
                            <thead class="">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quiz Name</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                ${this.renderQuizHistory()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    static renderActivityTabContent() {
        return `
            <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
                <div class="space-y-4">
                    ${this.renderRecentActivity()}
                </div>
            </div>
        `;
    }

    static renderQuizHistory() {
        if (!currentUser.quizHistory || currentUser.quizHistory.length === 0) {
            return `
                <tr>
                    <td colspan="3" class="px-6 py-4 text-center text-gray-500">No quiz history available</td>
                </tr>
            `;
        }

        return currentUser.quizHistory.map(quiz => `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${quiz.quizTitle}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${quiz.score}/${quiz.totalQuestions} (${quiz.percentage}%)</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${quiz.date}</td>
            </tr>
        `).join('');
    }

    static renderRecentActivity() {
        if (!currentUser.quizHistory || currentUser.quizHistory.length === 0) {
            return `<p class="text-gray-500 text-center py-8">No recent activity</p>`;
        }

        return currentUser.quizHistory.slice(-4).reverse().map(quiz => `
            <div class="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div class="flex-shrink-0">
                    <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                        </svg>
                    </div>
                </div>
                <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900">Completed ${quiz.quizTitle}</p>
                    <p class="text-sm text-gray-500">Scored ${quiz.score}/${quiz.totalQuestions} (${quiz.percentage}%) • ${quiz.date}</p>
                </div>
            </div>
        `).join('');
    }

    static attachProfileEventListeners() {
        // Tab switching
        document.getElementById('profile-tab').addEventListener('click', () => {
            this.switchTab('profile');
        });

        document.getElementById('activity-tab').addEventListener('click', () => {
            this.switchTab('activity');
        });
    }

    static switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.profile-tab-btn').forEach(btn => {
            btn.classList.remove('active', 'border-blue-500', 'text-blue-600');
            btn.classList.add('border-transparent', 'text-gray-500');
        });

        const activeTab = document.getElementById(`${tabName}-tab`);
        activeTab.classList.add('active', 'border-blue-500', 'text-blue-600');
        activeTab.classList.remove('border-transparent', 'text-gray-500');

        // Update content
        const contentDiv = document.getElementById('profile-tab-content');
        if (tabName === 'profile') {
            contentDiv.innerHTML = this.renderProfileTabContent();
        } else {
            contentDiv.innerHTML = this.renderActivityTabContent();
        }
    }
}
