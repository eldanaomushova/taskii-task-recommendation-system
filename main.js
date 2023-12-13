//this function will prevent any zoom in and out key pressed
document.addEventListener('keydown', function (event) {
    if ((event.metaKey || event.ctrlKey) && (event.key === '+' || event.key === '-')) {
        event.preventDefault();
    }
});

//this 5 lines will today's data and generate calendar automatically
const currentDate = new Date();
const currentMonth = currentDate.getMonth() + 1; 
const currentYear = currentDate.getFullYear();
const calendarUrl = `https://calendar.google.com/calendar/embed?height=600&wkst=2&bgcolor=%23eaeef7&ctz=Asia%2FBishkek&showTabs=0&showCalendars=0&showTz=0&showPrint=0&showDate=1&showNav=0&showTitle=0&hl=en&src=NjhmYzFjYmY3ZWViZmI5ODQ5Njg0OTQ2YzhjNDUxZmY5ZWY1NTM4YmI1NTQ1YmVjNzViNDAyNmQ3YzA5NGE3YUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%23795548&mode=MONTH&dates=${currentYear}${currentMonth}01/${currentYear}${currentMonth}31`;
document.getElementById('google-calendar').src = calendarUrl;



//this function is responsible for toggling the search input based on the state of a checkbox
function toggleSearchInput() {
    var searchCheckbox = document.getElementById('searchCheckbox');
    var searchText = document.getElementById('searchText');
    if (searchCheckbox.checked) {
        searchText.innerHTML = '<input type="text" placeholder="Search">';
        document.querySelector('.search-input input').focus();
    } else {
        searchText.innerHTML = 'Search';
    }
}

//this function performs the search operation on a list of tasks and highlights the tasks matching the search term
function performSearch() {
    var searchTerm = document.getElementById('searchInput').value.toLowerCase();
    var taskList = document.querySelectorAll('.listtask');
    var found = false;
    taskList.forEach(function(taskItem) {
        var taskText = taskItem.textContent.toLowerCase();
        if (taskText.includes(searchTerm)) {
            taskItem.style.backgroundColor = 'yellow';
            found = true;
        } else {
            taskItem.style.backgroundColor = '';
        }
    });
    if (!found) {
        alert('Task not found.');
    } 
}
//will highlight this searched task
function showTasks(taskType) {
    var taskTypes = document.querySelectorAll('.task');
    
    taskTypes.forEach(function(type) {
        type.style.display = 'none';
    });
    var selectedTaskType = document.getElementById(taskType);
    if (selectedTaskType) {
        selectedTaskType.style.display = 'block';
    }
}

//create meeting
function scheduleMeeting() {
    var participantEmail = document.getElementById("participantEmail").value;
    var meetingDate = document.getElementById("meetingDate").value;
    if (participantEmail.trim() === "" || meetingDate.trim() === "") {
        alert("Please enter both participant's email and meeting date.");
        return;
    }
    var meetingItem = document.createElement("li");
    meetingItem.className = "listtask";
    meetingItem.innerHTML = `Meeting with ${participantEmail} (${meetingDate})`;
    var deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Cancel";
    deleteButton.className = "delete";
    deleteButton.onclick = function () {
        meetingItem.remove();
    };
    meetingItem.appendChild(deleteButton);
    document.getElementById("meetingList").appendChild(meetingItem);
    document.getElementById("participantEmail").value = "";
    document.getElementById("meetingDate").value = "";
}

//make sign up
function signup() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const agreeCheckbox = document.getElementById('agree');
    if (!agreeCheckbox.checked) { //chechbox must be clicked before sign in
        alert('Please agree to the Terms & Conditions before signing up.');
        return;
    }
    //using mockapi.io it will send data to it and finally create an account
    fetch('https://657615dc0febac18d403ac12.mockapi.io/api/v1/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            password,
        }),
    })
        .then(response => response.json())
        .then(data => {
            alert("Account has been created! Please log in now.");
        })
        .catch(error => {
            alert(error);
        });
}

//to log in 
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    //it will check if email exist in database, if yes main page mill be opened
    fetch(`https://657615dc0febac18d403ac12.mockapi.io/api/v1/user?search=${email}&password=${password}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('User not found or incorrect credentials');
            }
            return response.json();
        })
        .then(data => {
            if (data.length === 0) {
                throw new Error('User not found or incorrect credentials');
            }
            console.log(data);
            window.location.href = "system.html";
        })
        .catch(error => {
            console.error(error);
            alert(error.message);
        });
}

//this function will direct to previus page and thus log out
function signOut() {
    const confirmSignOut = confirm("Are you sure you want to sign out?");
    
    if (confirmSignOut) {
        window.location.href = "mainpage.html";
    }
}
//to create task
function addTask() {
    const taskText = document.getElementById("taskInput").value;
    const taskDate = document.getElementById("dataPick").value;
    if (taskText.trim() === "" || taskDate.trim() === "") { //both input must be filled
        alert("Please enter both task and date.");
        return;
    }
    const taskItem = document.createElement("li");
    taskItem.className = "listtask";
    taskItem.innerHTML = `${taskText} ( ${taskDate})`;
    const deleteButton = document.createElement("button"); //deleting
    deleteButton.innerHTML = "Del";
    deleteButton.className = "delete"; 
    const updateButton = document.createElement("button"); //updating
    updateButton.innerHTML = "Upd";
    updateButton.className = "update";
    updateButton.onclick = function () {
        const newTaskText = prompt("Enter the updated task text:", taskText);
        const newTaskDate = prompt("Enter the updated due date:", taskDate);
        if (newTaskText !== null && newTaskDate !== null) {
            taskItem.innerHTML = `${newTaskText} (${newTaskDate})`;
        }
    };
    const completeButton = document.createElement("button"); //mark as complete
    completeButton.innerHTML = "Done";
    completeButton.className = "completed";
    
    taskItem.appendChild(updateButton);
    taskItem.appendChild(deleteButton); 
    taskItem.appendChild(completeButton);
    document.getElementById("taskList").appendChild(taskItem);
    document.getElementById("taskInput").value = "";
    document.getElementById("dataPick").value = "";
    const userId = "1"; 
    let taskId;
    fetch(`https://657615dc0febac18d403ac12.mockapi.io/api/v1/user/${userId}/Task`, { //will send data to database
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title: taskText,
            deadline: taskDate,
            completed: false,
            userId: userId,
        }),
    })
    //errors and responses, if data is created
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to create task. Status: ${response.status}, Message: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Task created:', data);
            taskId = data.id;
            console.log(taskId);
        })
        
        .catch(error => {
            console.error('Error creating task:', error.message);
        });
        completeButton.onclick = function () {
            taskItem.remove();
            moveToCompleted(taskText, taskDate, taskId, userId);
        };
        deleteButton.onclick = function () {
            taskItem.remove();
            moveToDelete(taskText, taskDate, taskId, userId);
            console.log(taskId);
        };
        

}
//if task is completed it will search for the data and it will make completed: "True"
function moveToCompleted(taskText, taskDate, taskId, userId) {
    var completedItem = document.createElement("li");
    completedItem.className = "listtask";
    completedItem.innerHTML = `${taskText} (${taskDate})`;
    document.getElementById("completed").appendChild(completedItem);
    console.log(taskId);
    fetch(`https://657615dc0febac18d403ac12.mockapi.io/api/v1/user/${userId}/Task/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: true })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to mark task as complete. Status: ${response.status}, Message: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Task marked as complete:', data);
        })
        .catch(error => {
            console.error(`Error marking task as complete: ${error.message}`);
        });
}
//this function will dalete task from the list and from database
function moveToDelete(taskText, taskDate, taskId, userId) {
    var trashItem = document.createElement("li");
    trashItem.className = "listtask";
    trashItem.innerHTML = `${taskText} (Due: ${taskDate})`;
    document.getElementById("trash").appendChild(trashItem);
    fetch(`https://657615dc0febac18d403ac12.mockapi.io/api/v1/user/${userId}/Task/${taskId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: true })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Failed to delete task. Status: ${response.status}, Message: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Task deleted successfully:', data);
    })
    .catch(error => {
        console.error(`Error deleting task: ${error.message}`);
    });

}