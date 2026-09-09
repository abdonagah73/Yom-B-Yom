// ===== Add Post =====

function addPost() {

    const input = document.getElementById("postInput");
    const text = input.value.trim();

    if (text === "") {
        alert("Please write something first!");
        return;
    }

    const postsContainer =
        document.getElementById("postsContainer");

    const post = document.createElement("div");

    post.className = "post-card";

    post.innerHTML = `
        <div class="post-header">

            <div class="post-user">
                👩🏻
            </div>

            <div>
                <h3>You</h3>
                <span>Just now</span>
            </div>

        </div>

        <p>${text}</p>

        <div class="post-actions">

            <button onclick="likePost(this)">
                ❤️ <span>0</span>
            </button>

            <button onclick="showCommentBox(this)">
                💬 Comment
            </button>

            <button onclick="deletePost(this)">
                🗑️ Delete
            </button>

        </div>

        <div class="comments"></div>
    `;

    postsContainer.prepend(post);

    input.value = "";
}


function likePost(button) {

    const number =
        button.querySelector("span");

    let likes = Number(number.textContent);

    likes++;

    number.textContent = likes;
}

function deletePost(button) {

    const post =
        button.closest(".post-card");

    post.remove();
}

function showCommentBox(button) {

    const post =
        button.closest(".post-card");

    const comments =
        post.querySelector(".comments");

    const comment = prompt("Write your comment:");

    if (comment && comment.trim() !== "") {

        const newComment =
            document.createElement("p");

        newComment.innerHTML =
            `<strong>You:</strong> ${comment}`;

        comments.appendChild(newComment);
    }
}

function addActivity() {

    const name =
        document.getElementById("activityName").value.trim();

    const date =
        document.getElementById("activityDate").value;

    if (name === "" || date === "") {
        alert("Please enter activity name and date!");
        return;
    }

    const container =
        document.getElementById("activitiesContainer");

    const activity =
        document.createElement("div");

    activity.className = "activity-card";

    activity.innerHTML = `

        <div class="activity-icon">
            🎉
        </div>

        <div>
            <h3>${name}</h3>
            <p>${date}</p>
        </div>

        <button onclick="deleteActivity(this)">
            🗑️
        </button>

    `;

    container.appendChild(activity);

    document.getElementById("activityName").value = "";
    document.getElementById("activityDate").value = "";
}

function deleteActivity(button) {

    const activity =
        button.closest(".activity-card");

    activity.remove();
}