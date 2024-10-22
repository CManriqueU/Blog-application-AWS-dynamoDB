  // Function to call your API
async function callApi(method, endpoint, data) {
    const apiURL = `https://gson6msnrg.execute-api.us-east-1.amazonaws.com/dev/${endpoint}`;
    return fetch(apiURL, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    //.then(response => response.json())
    .then(response => {
        // Log the response status
        console.log('Response Statttus:', response.body);
        return response.json();
    })
    // .then(data => {
    //     console.log('Success:', data.body);
    //     return data;
    // })
    .catch(error => console.error('Errrrrrror:', error));
}

function addComment(commentData) {
    const commentContainer = document.createElement('div');
    commentContainer.classList.add('comment');

    const commentTextElement = document.createElement('span');
    commentTextElement.textContent = commentData.commentText;

    // Create delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('comment-button', 'delete');
    deleteBtn.innerHTML = "<i class='fas fa-trash-alt'></i> Delete"; // Font Awesome
    deleteBtn.setAttribute('data-comment-id', commentData.commentId);
    deleteBtn.onclick = function() {
        commentContainer.remove();
    };

    // Create update button
    const updateBtn = document.createElement('button');
    updateBtn.classList.add('comment-button', 'update');
    updateBtn.innerHTML = "<i class='fas fa-edit'></i> Update"; // Adjust if using icons
    updateBtn.setAttribute('data-comment-id', commentData.commentId);
    
    updateBtn.onclick = function() {
        // Replace comment text with an input field and a save button
        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.value = commentData.commentText;
    
        const saveBtn = document.createElement('button');
        saveBtn.classList.add('comment-button', 'save');
        saveBtn.innerHTML = "<i class='fas fa-save'></i> Save"; // Save icon
    
        saveBtn.onclick = async function() {
            const updatedComment = inputField.value;
            console.log("sending: "+updatedComment);
            const updatedCommentData = {
                commentText: updatedComment
            }
            // Call the API to update the comment in the backend
            // console.log("(*(*(*"+commentData.commentId+" "+updatedComment);
            await callApi('PATCH', `updateComment/${commentData.commentId}`, JSON.stringify(updatedCommentData));
            
            // Update the displayed comment text
            commentTextElement.textContent = updatedComment;
        
            // Remove the input field and save button
            commentContainer.removeChild(inputField);
            commentContainer.removeChild(saveBtn);
        
            // Show the original buttons again
            commentContainer.appendChild(commentTextElement);
            commentContainer.appendChild(updateBtn);
            commentContainer.appendChild(deleteBtn);
        
            // Make the buttons visible again
            updateBtn.style.display = '';
            deleteBtn.style.display = '';
        };        
    
        // Hide the update and delete buttons while editing
        commentContainer.removeChild(commentTextElement);
        commentContainer.appendChild(inputField);
        commentContainer.appendChild(saveBtn);
        updateBtn.style.display = 'none';
        deleteBtn.style.display = 'none';
    };    

    // Append the text and buttons to the container
    commentContainer.appendChild(commentTextElement);
    commentContainer.appendChild(deleteBtn);
    commentContainer.appendChild(updateBtn);

    // Append the container to comments
    document.getElementById('comments').appendChild(commentContainer);
}


document.getElementById('post-comment-btn').addEventListener('click', function() {
    const commentText = document.getElementById('comment-input').value;

    const commentData = {
        commentId: generateUniqueId(),
        commentText: commentText
    }    
    
    // Creates the comment in the FE
    if (commentText) {
        addComment(commentData);
        document.getElementById('comment-input').value = ''; // Clear the input field after posting
    }
    console.log("IN");
    console.log(JSON.stringify(commentData));
    // Creates the comment in the BE
    callApi('POST', '/insertComment', JSON.stringify(commentData) );
});

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('comments').addEventListener('click', async function(event) {
        if (event.target && event.target.matches('button.delete')) {
            const commentId = event.target.getAttribute('data-comment-id');
            console.log("delete clicked");
            console.log("commentId: "+commentId);   
            await callApi('DELETE', `deleteComment/${commentId}`);
            event.target.closest('.comment').remove(); // Remove the comment from the DOM
        }
    });
});

window.addEventListener('load', () => {
    fetchData();
});

async function fetchData() {
    let myvar = await callApi('GET', '/getComments');
    console.log("look here:",myvar);
    displayComments(JSON.parse(myvar.body));
}

function displayComments(comments) {
    const commentsContainer = document.getElementById('comments');
    commentsContainer.innerHTML = ''; // Clear any existing content
    console.log("HERE", comments);
    comments.forEach(comment => {
        console.log("*");
        addComment(comment);
    });
}

function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}