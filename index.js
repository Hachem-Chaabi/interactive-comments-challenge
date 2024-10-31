'use strict';

// Get data from .JSON file
import data from './data.json' with { type: 'json' };
console.log(data);

// Variables
const plusBtn = document.querySelectorAll('.plus-btn');
const minusBtn = document.querySelectorAll('.minus-btn');
const replyBtn = document.querySelectorAll('.reply-container');
const user = data.comments;
// console.log(user[0].score);

// Adding 1 to the vote
plusBtn.forEach( btn => {
    btn.addEventListener('click', () => {
        const dataNum = btn.dataset.num;
        const intercationNumber = document.querySelector(`.interaction-number-${dataNum}`);
        intercationNumber.textContent = Number(intercationNumber.textContent) + 1;
    });
});

// Subtract 1 from the vote
minusBtn.forEach( btn => {
    btn.addEventListener('click', () => {
        const dataNum = btn.dataset.num;
        const intercationNumber = document.querySelector(`.interaction-number-${dataNum}`);
        intercationNumber.textContent = Number(intercationNumber.textContent) - 1;
    });
});

// Reply
replyBtn.forEach( btn => {
    btn.addEventListener('click', () => {
        const d = btn.closest('.when__reply');
        const element = document.getElementById("add-reply");

        if (typeof(element) != 'undefined' && element != null) return;
        console.log(d);

        const html = `<div class="add__comment-container">
          <img src="images/avatars/image-juliusomo.webp" alt="student wearing glasses">
          <textarea class="textarea" placeholder='Add a comment...' name="add-reply" id="add-reply"></textarea>
          <button>REPLY</button>
        </div>`;
        d.insertAdjacentHTML('beforeend', html);
    });
});
