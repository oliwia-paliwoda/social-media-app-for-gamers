export const store = {
    state: {
        currentUser: null,
    },

    init() {
        const storedUser = sessionStorage.getItem('currentUser');
        if (storedUser) {
            this.state.currentUser = JSON.parse(storedUser);
        }
    },

    setUser(user) {
        this.state.currentUser = user;
        sessionStorage.setItem('currentUser', JSON.stringify(user));
    },

    clearUser() {
        this.state.currentUser = null;
        sessionStorage.removeItem('currentUser');
    },
};

store.init();
