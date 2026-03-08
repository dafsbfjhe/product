class FoodItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <style>
                .food-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem;
                    border: 1px solid var(--border-color, #ccc);
                    border-radius: 4px;
                    color: var(--text-color, #333);
                }
                .food-item button {
                    padding: 0.25rem 0.5rem;
                    background-color: #dc3545;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
            </style>
            <div class="food-item">
                <div>
                    <strong>${this.getAttribute('name')}</strong> - ${this.getAttribute('calories')} calories
                </div>
                <button>Remove</button>
            </div>
        `;

        this.shadowRoot.querySelector('button').addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('remove', { bubbles: true, composed: true }));
        });
    }
}

customElements.define('food-item', FoodItem);

const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Theme logic
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.textContent = 'Light Mode';
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggle.textContent = isDark ? 'Light Mode' : 'Dark Mode';
});

const foodForm = document.querySelector('#food-form form');
const foodNameInput = document.getElementById('food-name');
const caloriesInput = document.getElementById('calories');
const proteinInput = document.getElementById('protein');
const carbsInput = document.getElementById('carbs');
const fatInput = document.getElementById('fat');
const foodItemsContainer = document.getElementById('food-items');
const totalCaloriesEl = document.getElementById('total-calories');
const totalProteinEl = document.getElementById('total-protein');
const totalCarbsEl = document.getElementById('total-carbs');
const totalFatEl = document.getElementById('total-fat');

let foods = JSON.parse(localStorage.getItem('foods')) || [];

function renderFoods() {
    foodItemsContainer.innerHTML = '';
    foods.forEach((food, index) => {
        const foodItem = document.createElement('food-item');
        foodItem.setAttribute('name', food.name);
        foodItem.setAttribute('calories', food.calories);
        foodItem.dataset.index = index;
        foodItemsContainer.appendChild(foodItem);
    });
    updateSummary();
}

function updateSummary() {
    const totalCalories = foods.reduce((sum, food) => sum + food.calories, 0);
    const totalProtein = foods.reduce((sum, food) => sum + food.protein, 0);
    const totalCarbs = foods.reduce((sum, food) => sum + food.carbs, 0);
    const totalFat = foods.reduce((sum, food) => sum + food.fat, 0);

    totalCaloriesEl.textContent = `Total Calories: ${totalCalories}`;
    totalProteinEl.textContent = `Total Protein: ${totalProtein}g`;
    totalCarbsEl.textContent = `Total Carbs: ${totalCarbs}g`;
    totalFatEl.textContent = `Total Fat: ${totalFat}g`;
}

function addFood(event) {
    event.preventDefault();
    const newFood = {
        name: foodNameInput.value,
        calories: parseInt(caloriesInput.value),
        protein: parseInt(proteinInput.value),
        carbs: parseInt(carbsInput.value),
        fat: parseInt(fatInput.value),
    };
    foods.push(newFood);
    localStorage.setItem('foods', JSON.stringify(foods));
    renderFoods();
    foodForm.reset();
}

foodForm.addEventListener('submit', addFood);

foodItemsContainer.addEventListener('remove', (e) => {
    const index = e.target.dataset.index;
    foods.splice(index, 1);
    localStorage.setItem('foods', JSON.stringify(foods));
    renderFoods();
});

renderFoods();
