

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



function createPost() {
  // Get the values of the input fields
  const title = document.getElementById('title').value;
  const body = document.getElementById('body').value;
  const imgfiles = document.getElementById('imgfiles').value;
  const category = document.getElementById('category').value;

  // Use AJAX to send a request to the server
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/createPost', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({
    title: title,
    body: body,
    imgfiles: imgfiles,
    category: category,
    tradeStatus: tradeStatus,
    posterId: posterId,
  }));

  xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      // Parse the response from the server
      const response = JSON.parse(this.responseText);
      let output = '';
      response.forEach(post => {
      output += <li>${post.title} - ${post.body}</li>;
      });
      document.getElementById('posts').innerHTML = output;
      }
      };
// send request
    xhr.send();
      }



const getAllPosts = async() => {
  try{
  const response = await fetch('getAllPosts');
  if(!response.ok){
    throw new Error(response.statusText);
  }
  const data = await response.json();
  return data;
}catch(error){
  throw error;
}
}





