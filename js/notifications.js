// Sample notification items
let notifications = [
    {
        id: 1,
        icon: "fa-solid fa-list-check",
        text: "You completed all tasks in 'To Do List'.",
        time: "10m ago",
        isRead: false
    },
    {
        id: 2,
        icon: "fa-solid fa-calendar-day",
        text: "Upcoming event in Calendar tomorrow at 10:00 AM.",
        time: "1h ago",
        isRead: false
    },
    {
        id: 3,
        icon: "fa-solid fa-user-group",
        text: "Team 5 updated project milestones in 'Social'.",
        time: "3h ago",
        isRead: true
    },
    {
        id: 4,
        icon: "fa-solid fa-note-sticky",
        text: "New quick note saved in 'Notes'.",
        time: "1 day ago",
        isRead: true
    }
];

function renderNotifications() {
    const listContainer = document.getElementById('notifications-list');
    const unreadBadge = document.getElementById('unread-count');
    if (!listContainer || !unreadBadge) return;
    
    listContainer.innerHTML = '';
    
    // Count unread
    const unreadCount = notifications.filter(item => !item.isRead).length;
    unreadBadge.textContent = unreadCount;

    // Build items
    notifications.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = `notification-item ${item.isRead ? '' : 'unread'}`;
        itemDiv.onclick = () => markAsRead(item.id);

        itemDiv.innerHTML = `
            <div class="icon-box">
                <i class="${item.icon}"></i>
            </div>
            <div class="notification-info">
                <p>${item.text}</p>
                <span class="time">${item.time}</span>
            </div>
            ${!item.isRead ? '<div class="dot"></div>' : ''}
        `;

        listContainer.appendChild(itemDiv);
    });
}

function markAsRead(id) {
    notifications = notifications.map(item => {
        if (item.id === id) {
            return { ...item, isRead: true };
        }
        return item;
    });
    renderNotifications();
}

function markAllAsRead() {
    notifications = notifications.map(item => ({ ...item, isRead: true }));
    renderNotifications();
}

// Render list on page load
document.addEventListener('DOMContentLoaded', renderNotifications);
