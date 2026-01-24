// --- MODAL LOGIC ---

function openProfileModal() {
    // 1. Get current values from the dashboard
    // We grab the text from the main dashboard cards to show in the profile
    const currentTotal = document.getElementById('total-expenses').textContent;
    const currentCount = document.getElementById('total-count').textContent;

    // 2. Update the modal with these values
    document.getElementById('profile-total').textContent = currentTotal;
    document.getElementById('profile-count').textContent = currentCount;

    // 3. Show the modal
    const modal = document.getElementById('profile-modal');
    modal.style.display = 'flex';
}

function closeProfileModal() {
    document.getElementById('profile-modal').style.display = 'none';
}

// Close modal if user clicks outside the white box
window.addEventListener('click', function(event) {
    const modal = document.getElementById('profile-modal');
    if (event.target === modal) {
        closeProfileModal();
    }
});