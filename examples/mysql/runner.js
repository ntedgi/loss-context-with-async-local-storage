let counter = 0

async function fetchWithEmailHeader(url, email) {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'user-mail': email,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json(); // Assuming the response is JSON
        const { email1, email2 } = data;
        if (email1 !== email2) {
            console.log(`(${counter++}) WTF!!!!`, email1, email2)
        }
        else {
            console.log(`(${counter++})`)
        }
        return data;
    } catch (error) {
        console.error('Error during fetch:', error);
        throw error;
    }
}

// Usage
const url = 'http://localhost:7002'; // Replace with your


function generateRandomEmail(domain = 'example.com') {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const usernameLength = Math.floor(Math.random() * 10) + 5; // Username length between 5 and 15
    let username = '';

    for (let i = 0; i < usernameLength; i++) {
        username += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return `${username}@${domain}`;
}


const numberOfMails = 100
const emailArray = []
for (let i = 0; i < numberOfMails; i++) {
    emailArray.push(generateRandomEmail())
}

await Promise.all(emailArray.map(email => fetchWithEmailHeader(url, email)))