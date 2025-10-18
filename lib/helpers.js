export const isStrongPassword = (password) => {
    // At least 1 uppercase, 1 number, 1 special character, min 8 characters
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    return regex.test(password);
};
