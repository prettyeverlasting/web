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

// Get the back-to-top button
const backToTopBtn = document.querySelector('.back-to-top');

// Show the button when the user scrolls down 300px
window.addEventListener('scroll', () => {
  if (window.pageYOffset > 300) {
    backToTopBtn.classList.add('show');
  } else {
    backToTopBtn.classList.remove('show');
  }
});

// Smooth scroll to the top of the page when the button is clicked
backToTopBtn.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Update the copyright year in the footer
const copyrightYear = document.getElementById('copyright-year');
copyrightYear.textContent = new Date().getFullYear();
