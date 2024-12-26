// Get all the anchor links in the navigation menu
const navLinks = document.querySelectorAll('nav a');

// Add a click event listener to each anchor link
navLinks.forEach(link => {
  link.addEventListener('click', (event) => {
    // Prevent the default link behavior
    event.preventDefault();

    // Get the target section ID from the link href
    const targetId = event.target.getAttribute('href');

    // Smooth scroll to the target section
    document.querySelector(targetId).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Get the tour dates section
const tourDatesSection = document.getElementById('tour-dates');

// Add a click event listener to the tour dates section
tourDatesSection.addEventListener('click', (event) => {
  // Check if the clicked element is a list item
  if (event.target.tagName.toLowerCase() === 'li') {
    // Toggle the 'active' class on the clicked list item
    event.target.classList.toggle('active');
  }
});

// Get the merchandise section
const merchandiseSection = document.getElementById('merchandise');

// Add a click event listener to the merchandise section
merchandiseSection.addEventListener('click', (event) => {
  // Check if the clicked element is a link
  if (event.target.tagName.toLowerCase() === 'a') {
    // Open the merchandise link in a new tab
    window.open(event.target.href, '_blank');
  }
});
