'use strict';

// Get data from .JSON file
import data from './data.json' with { type: 'json' };
console.log(data);

// Variables
const btnSend = document.querySelector('.btn-send');
const commentContent = document.querySelector('.textarea-comment');

let upVoteBtn;
let downVoteBtn;

// Init the comments
const initComments = () => {
  const addCommentContainer = document.querySelector('.comments__container');

  data.comments.forEach( comment => {
    const html = `<div class="when__reply">
          <div class="comment principal-comment-container" data-num="${comment.id}">
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

// Sort
const sortVotes = () => {
  data.comments.sort((a, b) => b.id - a.id);
};
sortVotes();

// Add the new comment to the DATA
const addComment = () => {
  const newComment = {
    id: getLastId() + 1,
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
  data.comments.push(newComment);
}

// Display the new comment when clicking on the SEND btn
const displayComment = () => {
  addComment();
  const textarea = document.getElementById('add-comment');
  const lastComment = data.comments[data.comments.length - 1];
  const html = `<div class="new when__reply">
  <div class="comment principal-comment-container" data-num="${getLastId()}">
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
        <div class="hidden update-comment">
          <textarea class="update-textarea textarea-comment"></textarea>
          <button class="btn-send btn-update">UPDATE</button>
        </div>
        <div class="text-container">
          <p>
          ${lastComment.content}
          </p>
        </div>
      </div>
    </div>
  </div>
          <div class="delete-confirm-container hidden">
          <div class="delete-confirm">
            <h1>Delete comment</h1>
            <p>Are you sure you want to delete this
              comment? This will remove the comment
              and can't be undone.</p>
            <div class="buttons-container">
              <button class="delete-cancel-btn">no, cancel</button>
              <button class="delete-confirm-btn" id="delete-confirm-btn">yes, delete</button>
            </div>
          </div>
        </div>
    </div>`;

  addCommentContainer.insertAdjacentHTML('beforeend', html);
  // Reset the text area value
  textarea.value = '';

  // UPVOTE and DOWNVOTE features when adding the comment
  newCommentUpVoteAndDownVote();

  // Delete feature when adding the comment
  let toBeDeleted = [];
  
  const newComment = document.querySelector(`.comment[data-num="${getLastId()}"]`).querySelector('.delete');
  toBeDeleted[toBeDeleted.length] = newComment;
  
  deleteComment(toBeDeleted, data.comments);

  // Update feature when adding the comment
  let toBeUpdated = [];
  
  const updatedComment = document.querySelector(`.comment[data-num="${getLastId()}"]`).querySelector('.edit');
  toBeUpdated[toBeUpdated.length] = updatedComment;
    
  editComment(toBeUpdated);
};
btnSend.addEventListener('click', displayComment);

// Init the replies
const initReplies = () => {
  let html;
  // let count = 1;
  data.comments.forEach( comment => {
      comment.replies.forEach( reply => {
        const userDataNum = document.querySelector(`.comment[data-num="${comment.id}"]`);
            if(reply.user.username != data.currentUser.username) {
              html = `<div class="reply comment reply-comment-container" data-num="${reply.id}">
                  <div class="comment-container-content">
                    <div class="left-comment-container">
                      <div class="interaction-container">
                        <img src="images/icon-plus.svg" alt="plus icon" class="plus-btn">
                        <p class="interaction-number interaction-number-3">${reply.score}</p>
                        <img src="images/icon-minus.svg" alt="minus icon" class="minus-btn">
                      </div>
                    </div>
                    <div class="right-comment-content">
                      <div class="comment-infos">
                        <div class="profile-container">
                          <img src="${reply.user.image.webp}" alt="black man with a brown background" class="avatar"/>
                          <p class="avatar-name">${reply.user.username}</p>
                          <p class="date">${reply.createdAt}</p>
                        </div>
                      </div>
                      <div class="text-container">
                        <p>
                          <span>@${reply.replyingTo}</span> ${reply.content}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="delete-confirm-container hidden">
                    <div class="delete-confirm">
                    <h1>Delete comment</h1>
                    <p>Are you sure you want to delete this comment? This will remove the comment and can't be undone.</p>
                    <div class="buttons-container">
                      <button class="delete-cancel-btn">no, cancel</button>
                      <button class="delete-confirm-btn" id="delete-confirm-btn">yes, delete</button>
                    </div>
                  </div>
              </div>
                 </div>`;
              } else {
                html = `<div class="reply comment reply-comment-container" data-num="${reply.id}">
                    <div class="comment-container-content">
                      <div class="left-comment-container">
                        <div class="interaction-container">
                          <img src="images/icon-plus.svg" alt="plus icon" class="plus-btn">
                          <p class="interaction-number interaction-number-3">${reply.score}</p>
                          <img src="images/icon-minus.svg" alt="minus icon" class="minus-btn">
                        </div>
                      </div>
                      <div class="right-comment-content">
                        <div class="comment-infos">
                          <div class="profile-container">
                            <img src="${reply.user.image.webp}" alt="black man with a brown background" class="avatar"/>
                            <p class="avatar-name">${reply.user.username}</p>
                            <p class="user-comment">you</p>
                            <p class="date">${reply.createdAt}</p>
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
                            <span>@${reply.replyingTo}</span> ${reply.content}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div class="delete-confirm-container hidden">
          <div class="delete-confirm">
            <h1>Delete comment</h1>
            <p>Are you sure you want to delete this
              comment? This will remove the comment
              and can't be undone.</p>
            <div class="buttons-container">
              <button class="delete-cancel-btn">no, cancel</button>
              <button class="delete-confirm-btn" id="delete-confirm-btn">yes, delete</button>
            </div>
          </div>
        </div>
                   </div>`;
            }
            userDataNum.closest('.when__reply').querySelector('.replies').insertAdjacentHTML('beforeend', html);
          })
        // count++;
  })
};
initReplies();

// UP and DOWN vote
upVoteBtn = document.querySelectorAll('.plus-btn');
const upVote = (upVoteBtn) => {
  upVoteBtn.forEach( btn => {
    btn.addEventListener('click', e => {
      // Get values
      const userId = e.target.closest('.comment').dataset.num;
      const interactionNumLabel = e.target.closest('.comment').querySelector('.interaction-number');

      // For the comments
      data.comments.forEach( comment => {
        if (userId == comment.id) {
          comment.score += 1;
          interactionNumLabel.textContent = comment.score;
        }
      });

      //For the replies
        data.comments.forEach( comment => {
          comment.replies.forEach( reply => {
                if (reply.id == userId) {
                  reply.score += 1;
                  interactionNumLabel.textContent = reply.score;
                }
          })
        });

        // document.querySelector('.comments__container').innerHTML = '';
        // sortVotes();
        // initComments();
        // initReplies();
        // console.log(data.comments);
    });
  });
};
upVote(upVoteBtn);

downVoteBtn = document.querySelectorAll('.minus-btn');
const downVote = (downVoteBtn) => {
  downVoteBtn.forEach( btn => {
    btn.addEventListener('click', e => {
      // Get values
      const userId = e.target.closest('.comment').dataset.num;
      const interactionNumLabel = e.target.closest('.comment').querySelector('.interaction-number');

      // For the comments
      data.comments.forEach( comment => {
        if (userId == comment.id) {
          comment.score -= 1;
          interactionNumLabel.textContent = comment.score;
        }
      });

      // For the replies
        data.comments.forEach( comment => {
          comment.replies.forEach( reply => {
                if (reply.id == userId) {
                  reply.score -= 1;
                  interactionNumLabel.textContent = reply.score;
                }
          })
        });
    });
  });
};
downVote(downVoteBtn);

// Remove reply section
const removeReplySectionComment = (e) => {
  const replyCommentSection = document.querySelector(".reply__comment__section");
  if (e.target.classList.contains('section') || e.target.classList.contains('body')) {
      if(typeof replyCommentSection != 'undefined' && replyCommentSection != null)
          replyCommentSection.remove();
  };
};
// When clicking on the body
document.body.addEventListener('click', (e) => {
  removeReplySectionComment(e);
});

// Add reply to the DATA and display it
const addReply = (container, content, Id) => {
  data.comments.forEach( comment => {
    content.value = deleteUserTag(content.value);
    if (comment.id == Id) {
      // Add the reply comment to the DATA
      comment.replies[comment.replies.length] = {
      id: getLastId() + 1,
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
      };

      // Display the reply comment 
      let html;
      comment.replies.forEach( reply => {
          if (reply.createdAt == 'Now') {
            html = `<div class="reply comment reply-comment-container" data-num="${getLastId()}">
                          <div class="comment-container-content">
                            <div class="left-comment-container">
                              <div class="interaction-container">
                                <img src="images/icon-plus.svg" alt="plus icon" class="plus-btn">
                                <p class="interaction-number interaction-number-3">${reply.score}</p>
                                <img src="images/icon-minus.svg" alt="minus icon" class="minus-btn">
                              </div>
                            </div>
                            <div class="right-comment-content">
                              <div class="comment-infos">
                                <div class="profile-container">
                                  <img src="${reply.user.image.webp}" alt="black man with a brown background" class="avatar"/>
                                  <p class="avatar-name">${reply.user.username}</p>
                                  <p class="user-comment">you</p>
                                  <p class="date">${reply.createdAt}</p>
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
                                   <span>@${reply.replyingTo}</span> ${reply.content}
                                </p>
                              </div>
                            </div>
                          </div>
                                  <div class="delete-confirm-container hidden">
          <div class="delete-confirm">
            <h1>Delete comment</h1>
            <p>Are you sure you want to delete this
              comment? This will remove the comment
              and can't be undone.</p>
            <div class="buttons-container">
              <button class="delete-cancel-btn">no, cancel</button>
              <button class="delete-confirm-btn" id="delete-confirm-btn">yes, delete</button>
            </div>
          </div>
        </div>
                </div>`;
              };
  
          });
          container.querySelector('.replies').insertAdjacentHTML('beforeend', html);

          // UPVOTE and DOWNVOTE features when adding the reply comment
          newCommentUpVoteAndDownVote();

          // Delete feature when adding the reply comment
          let toBeDeleted = [];
          
          const newComment = document.querySelector(`.comment[data-num="${getLastId()}"]`).querySelector('.delete');
          toBeDeleted[toBeDeleted.length] = newComment;
          
          deleteComment(toBeDeleted, data.comments);

          // Update feature when adding the comment
          let toBeUpdated = [];
  
          const updatedComment = document.querySelector(`.comment[data-num="${getLastId()}"]`).querySelector('.edit');
          toBeUpdated[toBeUpdated.length] = updatedComment;
    
          editComment(toBeUpdated);
    };
  });
};

// Add reply section
const btnReply = document.querySelectorAll('.reply-container');
btnReply.forEach( btn => {
  btn.addEventListener('click', e => {
    const commentContainer = e.target.closest('.when__reply');
    const commentId = e.target.closest('.comment').dataset.num;
    const reply = document.getElementById("add-reply");
    const replyToName = commentContainer.querySelector('.avatar-name');
    console.log(replyToName);
        
    if (typeof(reply) != 'undefined' && reply != null) return;
    
    const html = `<div class="reply__comment__section add__comment-container new">
            <img src="images/avatars/image-juliusomo.webp" alt="student wearing glasses">
            <textarea class="textarea-comment textarea-reply" placeholder='Add a comment...' name="add-reply" id="add-reply">@${replyToName.textContent} </textarea>
            <button class="btn-reply">REPLY</button>
          </div>`;
    
    commentContainer.insertAdjacentHTML('beforeend', html);

    const replySectionBtn = document.querySelector('.btn-reply');
    if(typeof replySectionBtn != 'undefined' && replySectionBtn != null) {
      replySectionBtn.addEventListener('click', () => {
        const replyContent = document.querySelector('.textarea-reply');
        if(replyContent.value != '') {
          addReply(commentContainer, replyContent, commentId);
          document.querySelector('.reply__comment__section').remove();
        }
      });
    };
  });
});

// Delete comment
const deleteBtn = document.querySelectorAll('.delete');
const comments = data.comments;

const deleteComment = (deleteBtn, comments) => {
  comments.forEach( comment => {
      deleteBtn.forEach( btn => {
        const commentId = btn.closest('.comment').dataset.num;

        // For the comments
        btn.addEventListener('click', () => {
          if(comment.id == commentId) {
            const element = btn.closest('.when__reply');
            const popUp = element.querySelector('.delete-confirm-container');
            deleteConfirmation(element, popUp, commentId);
          }
        });

        // For the replies
        btn.addEventListener('click', () => {
          comment.replies.forEach( reply => {
            if(reply.id == commentId) {
              const element = btn.closest('.reply');
              const popUp = element.querySelector('.delete-confirm-container');
              deleteConfirmation(element, popUp, commentId);
            }
          });
        })
      })
  })
};
deleteComment(deleteBtn, comments);

// Delete Prompt
const deleteConfirmation = (element, popUp, Id) => {
  popUp.classList.remove('hidden');
  console.log(element);
  const cancelBtn = element.querySelector('.delete-cancel-btn');
  const confirmBtn = element.querySelector('.delete-confirm-btn');

  cancelBtn.addEventListener('click', () => {
    popUp.classList.add('hidden');
  });

  confirmBtn.addEventListener('click', () => {
    popUp.classList.add('hidden');
    data.comments = data.comments.filter( c => c.id != Id);
    element.remove();
  });
}

//Edit comment
const editBtn = document.querySelectorAll('.edit');
const editComment = (editBtn) => {
  editBtn.forEach( btn => {
    btn.addEventListener('click', e => {
      console.log(e.target);
      const commentContainer = e.target.closest('.comment');
      console.log(commentContainer);
      const textContent = commentContainer.querySelector('.text-container').querySelector('p');

      // Display the update SECTION
      const updateSection = commentContainer.querySelector('.update-comment');
      updateSection.classList.remove('hidden');
      textContent.classList.add('hidden');
      updateSection.querySelector('.update-textarea').value = textContent.textContent.trim();

      // Update the comment
      const updateBtn = commentContainer.querySelector('.btn-update');
      updateBtn.addEventListener('click', () => {
        textContent.textContent = updateSection.querySelector('.update-textarea').value;
        textContent.classList.remove('hidden');
        updateSection.classList.add('hidden');
      })
    });
  });
};
editComment(editBtn);

// Get the last comment ID from the data
const getLastId = () => {
  let lastId = 0;
  data.comments.forEach(comment => {
      if (comment.id > lastId) {
          lastId = comment.id;
      }
      comment.replies.forEach(relpy => {
          if (relpy.id > lastId) {
              lastId = relpy.id;
          }
      });
  });
  return lastId;
};

// UPVOTE and DOWNVOTE features when adding the reply comment
const newCommentUpVoteAndDownVote = () => {
  let plusRepliesArray = [];
  let minusRepliesArray = [];
  
  const plusBtn = document.querySelector(`.comment[data-num="${getLastId()}"]`).querySelector('.plus-btn');
  const minusBtn = document.querySelector(`.comment[data-num="${getLastId()}"]`).querySelector('.minus-btn');
  
  plusRepliesArray[plusRepliesArray.length] = plusBtn;
  minusRepliesArray[minusRepliesArray.length] = minusBtn;
  
  upVote(plusRepliesArray);
  downVote(minusRepliesArray);
};

// Cut the TAG name
const deleteUserTag = string => {
  return string.substr(string.indexOf(' ') + 1);
};