export const getErrorMessageTranslate = (status) => {
    switch (status) {
        case 400:
            return 'No text provided or invalid request.';
        case 401:
            return 'Authentication is required.';
        case 403:
            return 'You have exceeded the use limit. To continue, please log in or register.';
        case 500:
            return 'Server Error: Something went wrong on the server.';
        default:
            return 'An error occurred. Please try again later.';
    }
};