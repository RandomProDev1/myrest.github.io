// DOM Elements
const restaurantName = document.getElementById('restaurant-name');
const backButton = document.getElementById('back-button');
const categoriesView = document.getElementById('categories-view');
const itemsView = document.getElementById('items-view');
const currentCategory = document.getElementById('current-category');

// State Management
let menuData = {};
let currentCategoryId = null;

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
    backButton.addEventListener('click', showCategoriesView);
  } catch (error) {
    console.error('Error loading menu:', error);
    categoriesView.innerHTML = `<p class="text-red-500 text-center col-span-full py-12">Menu failed to load. Please try again later.</p>`;
  }
}

// Render Categories as Cards
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
        <p class="text-gray-600 text-sm sm:text-base line-clamp-2">${category.description}</p>
      </div>
    `;
    
    categoryCard.addEventListener('click', () => showCategoryItems(category.id));
    categoriesView.appendChild(categoryCard);
  });
}

// Show Items for a Specific Category
function showCategoryItems(categoryId) {
  currentCategoryId = categoryId;
  
  // Find category name
  const category = menuData.categories.find(cat => cat.id === categoryId);
  
  // Update UI
  categoriesView.classList.add('hidden');
  itemsView.classList.remove('hidden');
  backButton.classList.remove('hidden');
  currentCategory.textContent = category.name;
  currentCategory.classList.remove('hidden');
  
  // Render items
  renderItems();
}

// Show Categories View
function showCategoriesView() {
  itemsView.classList.add('hidden');
  categoriesView.classList.remove('hidden');
  backButton.classList.add('hidden');
  currentCategory.classList.add('hidden');
}

// Render Menu Items
function renderItems() {
  itemsView.innerHTML = '';

  const filteredItems = menuData.items.filter(item => item.category === currentCategoryId);

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
      <!-- Image container: square aspect ratio -->
      <div class="aspect-square overflow-hidden">
        <img src="${item.image}" alt="${item.name}" 
             class="w-full h-full object-cover transition-transform duration-500 hover:scale-110">
      </div>
      
      <div class="p-4 flex-grow flex flex-col">
        <div class="flex justify-between items-start mb-2">
          <h3 class="text-lg font-bold text-gray-800 line-clamp-1">${item.name}</h3>
          <span class="text-base font-semibold text-amber-600 shrink-0 ml-2">$${item.price.toFixed(2)}</span>
        </div>
        
        <p class="text-gray-600 text-sm line-clamp-2 sm:line-clamp-3 mb-3 flex-grow">${item.description}</p>
        
        <div class="mt-auto">
          <span class="text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded-full">
            ${menuData.categories.find(cat => cat.id === item.category).name}
          </span>
        </div>
      </div>
    `;
    
    itemsView.appendChild(itemElement);
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initMenu);