export const isAuthenticated = () => {
    return !!(localStorage.getItem('loanAppLoginUserUserPosition') === 'admin');
    // return !!localStorage.getItem('loanAppLoginUserUserPosition');
  };
  