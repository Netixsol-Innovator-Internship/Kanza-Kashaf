// Authentication functions
class AuthManager {
    static init() {
        // Check if user is logged in
        const userData = localStorage.getItem('currentUser');
        if (userData) {
            currentUser = JSON.parse(userData);
        }
    }

    static signup(name, email, password, confirmPassword) {
        // Validation
        if (!name || !email || !password || !confirmPassword) {
            throw new Error('All fields are required');
        }

        if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
        }

        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters long');
        }

        // Check if user already exists
        const users = this.getUsers();
        if (users.find(user => user.email === email)) {
            throw new Error('User with this email already exists');
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            name,
            email,
            password, // In real app, this should be hashed
            joinDate: new Date().toISOString(),
            bio: 'Quiz enthusiast and knowledge seeker!',
            quizHistory: [],
            totalQuizzes: 0
        };

        // Save user
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // Login user
        currentUser = newUser;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        return newUser;
    }

    static signin(email, password) {
        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        const users = this.getUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            throw new Error('Invalid email or password');
        }

        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        return user;
    }

    static signout() {
        currentUser = null;
        localStorage.removeItem('currentUser');
    }

    static getUsers() {
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : [];
    }

    static updateUser(userData) {
        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...userData };
            localStorage.setItem('users', JSON.stringify(users));
            currentUser = users[userIndex];
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
    }

    static isLoggedIn() {
        return currentUser !== null;
    }
}
