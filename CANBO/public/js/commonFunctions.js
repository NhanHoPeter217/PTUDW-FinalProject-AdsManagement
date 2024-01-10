const fillPlaceholder = (elementId, value) => {
    const element = document.getElementById(elementId);
    if (element) {
        element.placeholder = value || '';
    }
};

const fetchUserInfo = async (fullNameId = null, dobId = null, emailId = null, phoneNumberId = null) => {
    try {
        const response = await fetch('/api/v1/user', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Lấy thông tin tài khoản bị lỗi!');
        }

        const data = await response.json();

        // Fill form fields with user info using the fillPlaceholder function
        if (fullNameId) fillPlaceholder(fullNameId, data.infoUser.fullName);
        if (dobId) fillPlaceholder(dobId, data.infoUser.dateOfBirth);
        if (emailId) fillPlaceholder(emailId, data.infoUser.email);
        if (phoneNumberId) fillPlaceholder(phoneNumberId, data.infoUser.phone);
    } catch (error) {
        console.error('Lỗi:', error.message);
    }
};

