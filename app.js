// DOM Elements
const restaurantName = document.getElementById('restaurant-name');
const backButton = document.getElementById('back-button');
const categoriesView = document.getElementById('categories-view');
const itemsView = document.getElementById('items-view');
const currentCategory = document.getElementById('current-category');
const subcategoriesView = document.getElementById('subcategories-view');

// State Management
let menuData = {};
let currentCategoryId = null;
let currentSubcategoryId = null;

// Initialize Menu
async function initMenu() {
  try {
    const response = await fetch('menu.json');
    menuData = await response.json();
    
    // Set restaurant name
    restaurantName.textContent = menuData.restaurant;
    
    // Render categories
    renderCategories();
    
    // Set up back button
    backButton.addEventListener('click', handleBackButton);
  } catch (error) {
    console.error('Error loading menu:', error);
    categoriesView.innerHTML = `<p class="text-red-500 text-center col-span-full py-12">Menu failed to load. Please try again later.</p>`;
  }
}

// Render Main Categories
function renderCategories() {
  categoriesView.innerHTML = '';
  
  menuData.categories.forEach(category => {
    const categoryCard = document.createElement('div');
    categoryCard.className = 'card-hover bg-white rounded-xl shadow-md overflow-hidden cursor-pointer animate-fade-in';
    categoryCard.innerHTML = `
      <div class="aspect-square overflow-hidden">
        <img src="${category.image}" alt="${category.name}" 
             class="w-full h-full object-cover transition-transform duration-500 hover:scale-110">
      </div>
      <div class="p-4 sm:p-6">
        <h3 class="text-lg sm:text-xl font-bold text-gray-800 mb-1">${category.name}</h3>
      </div>
    `;
    
    categoryCard.addEventListener('click', () => showSubcategories(category.id));
    categoriesView.appendChild(categoryCard);
  });
}

// Show Subcategories for a Main Category
function showSubcategories(categoryId) {
  currentCategoryId = categoryId;
  
  // Find category
  const category = menuData.categories.find(cat => cat.id === categoryId);
  
  // Update UI
  categoriesView.classList.add('hidden');
  subcategoriesView.classList.remove('hidden');
  backButton.classList.remove('hidden');
  currentCategory.textContent = category.name;
  currentCategory.classList.remove('hidden');
  
  // Render subcategories
  renderSubcategories();
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Render Subcategories
function renderSubcategories() {
  subcategoriesView.innerHTML = '';
  
  const category = menuData.categories.find(cat => cat.id === currentCategoryId);
  
  category.subcategories.forEach(subcategory => {
    const subcategoryCard = document.createElement('div');
    subcategoryCard.className = 'card-hover bg-white rounded-xl shadow-md overflow-hidden cursor-pointer animate-fade-in';
    subcategoryCard.innerHTML = `
      <div class="aspect-square overflow-hidden">
        <img src="${subcategory.image}" alt="${subcategory.name}" 
             class="w-full h-full object-cover transition-transform duration-500 hover:scale-110">
      </div>
      <div class="p-4 sm:p-6">
        <h3 class="text-lg sm:text-xl font-bold text-gray-800 mb-1">${subcategory.name}</h3>
      </div>
    `;
    
    subcategoryCard.addEventListener('click', () => showCategoryItems(subcategory.id));
    subcategoriesView.appendChild(subcategoryCard);
  });
}

// Show Items for a Specific Subcategory
function showCategoryItems(subcategoryId) {
  currentSubcategoryId = subcategoryId;
  
  // Find subcategory name
  const category = menuData.categories.find(cat => cat.id === currentCategoryId);
  const subcategory = category.subcategories.find(sub => sub.id === subcategoryId);
  
  // Update UI
  subcategoriesView.classList.add('hidden');
  itemsView.classList.remove('hidden');
  currentCategory.textContent = `${category.name} - ${subcategory.name}`;
  
  // Render items
  renderItems();
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Handle Back Button Navigation
function handleBackButton() {
  if (itemsView.classList.contains('hidden') === false) {
    // If we're in items view, go back to subcategories
    itemsView.classList.add('hidden');
    subcategoriesView.classList.remove('hidden');
    currentCategory.textContent = menuData.categories.find(cat => cat.id === currentCategoryId).name;
  } else if (subcategoriesView.classList.contains('hidden') === false) {
    // If we're in subcategories view, go back to main categories
    subcategoriesView.classList.add('hidden');
    categoriesView.classList.remove('hidden');
    backButton.classList.add('hidden');
    currentCategory.classList.add('hidden');
  }
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Render Menu Items
function renderItems() {
  itemsView.innerHTML = '';

  const filteredItems = menuData.items.filter(item => item.subcategory === currentSubcategoryId);

  if (filteredItems.length === 0) {
    itemsView.innerHTML = `
      <div class="col-span-full text-center py-12">
        <h3 class="text-xl font-semibold text-gray-600">No items in this category</h3>
        <p class="text-gray-500 mt-2">Check back soon for new additions!</p>
      </div>
    `;
    return;
  }

  filteredItems.forEach(item => {
    const itemElement = document.createElement('div');
    itemElement.className = 'card-hover bg-white rounded-xl shadow-md overflow-hidden animate-fade-in flex flex-col';
    
    itemElement.innerHTML = `
      <div class="aspect-square overflow-hidden">
        <img src="${item.image}" alt="${item.name}" 
             class="w-full h-full object-cover transition-transform duration-500 hover:scale-110">
      </div>
      
      <div class="p-4 flex-grow flex flex-col">
        <div class="flex justify-between items-start mb-2">
          <h3 class="text-lg font-bold text-gray-800 line-clamp-1">${item.name}</h3>
          <span class="text-base font-semibold text-amber-600 shrink-0 ml-2">${item.price} IQD</span>
        </div>
        
        <p class="text-gray-600 text-sm line-clamp-2 sm:line-clamp-3 mb-3 flex-grow">${item.description}</p>
      </div>
    `;
    
    itemsView.appendChild(itemElement);
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initMenu);

// Check for menu updates
async function checkForUpdates() {
  const response = await fetch('menu.json');
  const newData = await response.json();
  if (JSON.stringify(newData) !== JSON.stringify(menuData)) {
    menuData = newData;
    renderCategories();
  }
}

// Check every 5 minutes
setInterval(checkForUpdates, 300000);