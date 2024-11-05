'use strict';

// Get data from .JSON file
import data from './data.json' with { type: 'json' };
console.log(data);

const btnSend = document.querySelector('.btn-send');
const commentContent = document.querySelector('.textarea-comment');
const addCommentContainer = document.querySelector('.comments__container');
const commentReplyContainer = document.querySelector('.when__reply');
let upVoteBtn;
let downVoteBtn;

const comments = [...data.comments];
const getReplies = () => {
  let replies = [];
  for (const comment of comments) {
    replies[replies.length] = comment.replies;
  };
  return replies;
}
console.log(comments);
console.log(getReplies());

// Init the comments
const initComments = () => {
  comments.forEach( comment => {
    const html = `<div class="when__reply" data-num="${comment.id}">
          <div class="comment principal-comment-container">
            <div class="comment-container-content">
              <div class="left-comment-container">
                <div class="interaction-container">
                  <img src="images/icon-plus.svg" alt="plus icon" class="plus-btn">
                  <p class="interaction-number interaction-number-1">${comment.score}</p>
                  <img src="images/icon-minus.svg" alt="minus icon" class="minus-btn">
                </div>
              </div>
              <div class="right-comment-content">
                <div class="comment-infos">
                  <div class="profile-container">
                    <img src="${comment.user.image.webp}" alt="smiling girl" class="avatar"/>
                    <p class="avatar-name">${comment.user.username}</p>
                    <p class="date">${comment.createdAt}</p>
                  </div>
                  <div class="reply-container">
                    <img src="images/icon-reply.svg" alt="reply icon" />
                    <p>Reply</p>
                  </div>
                </div>
                <div class="text-container">
                  <p>
                  ${comment.content}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="replies-comment-container">
          <hr>
          <div class="replies"><div/>
          </div>
        </div>`;

      addCommentContainer.insertAdjacentHTML('beforeend', html);
  });
};
initComments();

// Add the new comment to the DATA
const addComment = () => {
  const newComment = {
    id: comments[comments.length -1].id + 1,
    content: commentContent.value,
    createdAt: 'Now',
    score: 0,
    replies: [],
    user: {
      image: { 
        png: data.currentUser.image.png,
        webp: data.currentUser.image.webp
      },
      username: data.currentUser.username,
    },
  };
  comments.push(newComment);
}

// Display the new comment when clicking on the SEND btn
const displayComment = () => {
  addComment();
  const lastComment = comments[comments.length - 1];
  const html = `<div class="when__reply" data-num="${lastComment.id}">
  <div class="comment principal-comment-container">
    <div class="comment-container-content">
      <div class="left-comment-container">
        <div class="interaction-container">
          <img src="images/icon-plus.svg" alt="plus icon" class="plus-btn">
          <p class="interaction-number interaction-number-1">${lastComment.score}</p>
          <img src="images/icon-minus.svg" alt="minus icon" class="minus-btn">
        </div>
      </div>
      <div class="right-comment-content">
        <div class="comment-infos">
          <div class="profile-container">
            <img src="${data.currentUser.image.webp}" alt="smiling girl" class="avatar"/>
            <p class="avatar-name">${data.currentUser.username}</p>
            <p class="user-comment">you</p>
            <p class="date">${lastComment.createdAt}</p>
          </div>
          <div class="delete-edit-container">
            <div class="delete-edit">
              <img src="images/icon-delete.svg" alt="delete icon">
              <p class="delete">Delete</p>
            </div>
            <div class="delete-edit">
              <img src="images/icon-edit.svg" alt="edit icon">
              <p class="edit">Edit</p>
            </div>
          </div>
        </div>
        <div class="text-container">
          <p>
          ${lastComment.content}
          </p>
        </div>
      </div>
    </div>
  </div>
    </div>`;

  addCommentContainer.insertAdjacentHTML('beforeend', html);

  upVoteBtn = document.querySelectorAll('.plus-btn');
  let sendArray = [];
  sendArray[sendArray.length] = upVoteBtn[upVoteBtn.length - 1];
  console.log(upVoteBtn);
  console.log(sendArray);
  upVote(sendArray);
};
btnSend.addEventListener('click', displayComment);

// Init the replies
const initReplies = () => {
  let html;
  let count = 1;
  getReplies().forEach( reply => {
    if(reply.length) {
      const userDataNum = document.querySelector(`.when__reply[data-num="${count}"`);
      reply.forEach( r => {
        if(r.user.username != data.currentUser.username) {
          html = `
             <div class="reply comment reply-comment-container">
              <div class="comment-container-content">
                <div class="left-comment-container">
                  <div class="interaction-container">
                    <img src="images/icon-plus.svg" alt="plus icon" class="plus-btn">
                    <p class="interaction-number interaction-number-3">${r.score}</p>
                    <img src="images/icon-minus.svg" alt="minus icon" class="minus-btn">
                  </div>
                </div>
                <div class="right-comment-content">
                  <div class="comment-infos">
                    <div class="profile-container">
                      <img src="${r.user.image.webp}" alt="black man with a brown background" class="avatar"/>
                      <p class="avatar-name">${r.user.username}</p>
                      <p class="date">${r.createdAt}</p>
                    </div>
                  </div>
                  <div class="text-container">
                    <p>
                      <span>@${r.replyingTo}</span> ${r.content}
                    </p>
                  </div>
                </div>
              </div>
             </div>`;
          } else {
            html = `
               <div class="reply comment reply-comment-container">
                <div class="comment-container-content">
                  <div class="left-comment-container">
                    <div class="interaction-container">
                      <img src="images/icon-plus.svg" alt="plus icon" class="plus-btn">
                      <p class="interaction-number interaction-number-3">${r.score}</p>
                      <img src="images/icon-minus.svg" alt="minus icon" class="minus-btn">
                    </div>
                  </div>
                  <div class="right-comment-content">
                    <div class="comment-infos">
                      <div class="profile-container">
                        <img src="${r.user.image.webp}" alt="black man with a brown background" class="avatar"/>
                        <p class="avatar-name">${r.user.username}</p>
                        <p class="user-comment">you</p>
                        <p class="date">${r.createdAt}</p>
                      </div>
                      <div class="delete-edit-container">
                        <div class="delete-edit">
                          <img src="images/icon-delete.svg" alt="delete icon">
                          <p class="delete">Delete</p>
                        </div>
                        <div class="delete-edit">
                          <img src="images/icon-edit.svg" alt="edit icon">
                          <p class="edit">Edit</p>
                        </div>
                      </div>
                    </div>
                    <div class="hidden update-comment">
                      <textarea class="update-textarea textarea-comment"></textarea>
                      <button class="btn-send btn-update">UPDATE</button>
                    </div>
                    <div class="text-container">
                      <p>
                        <span>@${r.replyingTo}</span> ${r.content}
                      </p>
                    </div>
                  </div>
                </div>
               </div>`;
        }
        userDataNum.querySelector('.replies').insertAdjacentHTML('beforeend', html);
      });
    }
    count++;
  })
}
initReplies();

// UP and DOWN vote
upVoteBtn = document.querySelectorAll('.plus-btn');
const upVote = (upVoteBtn) => {
  console.log(upVoteBtn);
  upVoteBtn.forEach( btn => {
    btn.addEventListener('click', e => {
      console.log(comments);
      const userName = e.target.closest('.comment').querySelector('.avatar-name');
      const interactionNumLabel = e.target.closest('.comment').querySelector('.interaction-number');
      comments.forEach( comment => {
        if (userName.textContent == comment.user.username) {
          comment.score += 1;
          interactionNumLabel.textContent = comment.score;
        }
      })
      getReplies().forEach( reply => {
        if (reply.length) {
          reply.forEach( r => {
            if (r.user.username == userName.textContent) {
              r.score += 1;
              interactionNumLabel.textContent = r.score;
            }
          })
        }
      })
    });
  });
};
upVote(upVoteBtn);

// downVoteBtn = document.querySelectorAll('.minus-btn');
// downVoteBtn.forEach( btn => {
//   btn.addEventListener('click', e => {
//     const userName = e.target.closest('.comment').querySelector('.avatar-name');
//     const interactionNumLabel = e.target.closest('.comment').querySelector('.interaction-number');
//     comments.forEach( comment => {
//       if (userName.textContent == comment.user.username) {
//         comment.score -= 1;
//         interactionNumLabel.textContent = comment.score;
//       }
//     })
//     getReplies().forEach( reply => {
//       if (reply.length) {
//         reply.forEach( r => {
//           if (r.user.username == userName.textContent) {
//             r.score -= 1;
//             interactionNumLabel.textContent = r.score;
//           }
//         })
//       }
//     })
//   });
// });

// Remove reply section
const removeReplySectionComment = (e) => {
  const replyCommentSection = document.querySelector(".reply__comment__section");
  if (e.target.classList.contains('section') || e.target.classList.contains('body')) {
      if(typeof replyCommentSection != 'undefined' && replyCommentSection != null)
          replyCommentSection.remove();
  };
};
// when clicking on the body
document.body.addEventListener('click', (e) => {
  removeReplySectionComment(e);
});

//
const addReply = (container, content) => {
  comments.forEach( comment => {
    if (comment.id == container.dataset.num)
      comment.replies = [{
    createdAt: 'Now',
    content: content.value,
    replyingTo: container.querySelector('.avatar-name').textContent,
    score: 0,
    user: {
      image: { 
        png: data.currentUser.image.png,
        webp: data.currentUser.image.webp
      },
      username: data.currentUser.username,
    },
    }]
  });

  let html;
  getReplies().forEach( reply => {
    reply.forEach( r => {
      if (r.createdAt == 'Now') {
        html = `<div class="reply comment reply-comment-container">
                      <div class="comment-container-content">
                        <div class="left-comment-container">
                          <div class="interaction-container">
                            <img src="images/icon-plus.svg" alt="plus icon" class="plus-btn">
                            <p class="interaction-number interaction-number-3">${r.score}</p>
                            <img src="images/icon-minus.svg" alt="minus icon" class="minus-btn">
                          </div>
                        </div>
                        <div class="right-comment-content">
                          <div class="comment-infos">
                            <div class="profile-container">
                              <img src="${r.user.image.webp}" alt="black man with a brown background" class="avatar"/>
                              <p class="avatar-name">${r.user.username}</p>
                              <p class="user-comment">you</p>
                              <p class="date">${r.createdAt}</p>
                            </div>
                            <div class="delete-edit-container">
                              <div class="delete-edit">
                                <img src="images/icon-delete.svg" alt="delete icon">
                                <p class="delete">Delete</p>
                              </div>
                              <div class="delete-edit">
                                <img src="images/icon-edit.svg" alt="edit icon">
                                <p class="edit">Edit</p>
                              </div>
                            </div>
                          </div>
                          <div class="text-container">
                            <p>
                              <span>@${r.replyingTo}</span> ${r.content}
                            </p>
                          </div>
                        </div>
                      </div>
            </div>`;
          };
        });
      });
      container.querySelector('.replies').insertAdjacentHTML('beforeend', html);
};

const btnReply = document.querySelectorAll('.reply-container');
btnReply.forEach( btn => {
  btn.addEventListener('click', e => {
    const commentContainer = e.target.closest('.when__reply');
    const reply = document.getElementById("add-reply");
        
    if (typeof(reply) != 'undefined' && reply != null) return;
    
    const html = `<div class="reply__comment__section add__comment-container">
            <img src="images/avatars/image-juliusomo.webp" alt="student wearing glasses">
            <textarea class="textarea-comment textarea-reply" placeholder='Add a comment...' name="add-reply" id="add-reply"></textarea>
            <button class="btn-reply">REPLY</button>
          </div>`;
    
    commentContainer.insertAdjacentHTML('beforeend', html);

    const replySectionBtn = document.querySelector('.btn-reply');
    if(typeof replySectionBtn != 'undefined' && replySectionBtn != null) {
      replySectionBtn.addEventListener('click', () => {
        const replyContent = document.querySelector('.textarea-reply');
        if(replyContent.value != '') {
          addReply(commentContainer, replyContent);
          document.querySelector('.reply__comment__section').remove();
        }
      });
    };
  });
});

// Delete comment
const deleteComment = () => {
  const deleteBtn = document.querySelectorAll('.delete');
  deleteBtn.forEach( btn => {
    btn.addEventListener('click', () => {
      document.querySelector('.delete-confirm-container').classList.remove('hidden');
    });
  
    const cancelBtn = document.getElementById('delete-cancel-btn');
    const confirmBtn = document.getElementById('delete-confirm-btn');
  
    cancelBtn.addEventListener('click', () => {
      document.querySelector('.delete-confirm-container').classList.add('hidden');
    });
    confirmBtn.addEventListener('click', () => {
      document.querySelector('.delete-confirm-container').classList.add('hidden');
      btn.closest('.reply').remove();
    })
  });
};
deleteComment();

//Edit comment
const editComment = () => {
  const editBtn = document.querySelectorAll('.edit');
  editBtn.forEach( btn => {
    btn.addEventListener('click', e => {
      const commentContainer = e.target.closest('.reply');
      const textContent = commentContainer.querySelector('.text-container');

      // Display the update SECTION
      const updateSection = document.querySelector('.update-comment');
      updateSection.classList.remove('hidden');
      textContent.classList.add('hidden');
      updateSection.querySelector('.update-textarea').value = textContent.textContent.trim();

      // Update the comment
      const updateBtn = document.querySelector('.btn-update');
      updateBtn.addEventListener('click', () => {
        textContent.textContent = updateSection.querySelector('.update-textarea').value;
        textContent.classList.remove('hidden');
        updateSection.classList.add('hidden');
      })
    });
  });
};
editComment();