function getAllProduct() {
}



// Get the product information from the HTML form
let productImage = document.getElementById('product-image').value;
let productTitle = document.getElementById('product-title').value;
let productBody = document.getElementById('product-body').value;
let productCategory = document.getElementById('product-Cate').value;

// Create HTML elements for the product information
let img = document.createElement('img');
img.src = productImage;

let title = document.createElement('p');
title.innerHTML = productTitle;

let body = document.createElement('p');
body.innerHTML = productBody;

let category = document.createElement('p');
category.innerHTML = productCategory;

// Append the product information to the page
let parentElement = document.getElementById('products');
parentElement.appendChild(img);
parentElement.appendChild(title);
parentElement.appendChild(body);
parentElement.appendChild(category);
