var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
var sharedMomentsArea = document.querySelector('#shared-moments');

function openCreatePostModal() {
  createPostArea.style.display = 'block';
  if (deferredPrompt) {
    deferredPrompt.prompt();

    deferredPrompt.userChoice.then(function (choiceResult) {
      console.log(choiceResult.outcome);

      if (choiceResult.outcome === 'dismissed') {
        console.log('User cancelled installation');
      } else {
        console.log('User added to home screen');
      }
    });

    deferredPrompt = null;
  }
}

function closeCreatePostModal() {
  createPostArea.style.display = 'none';
}

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);

const USER_REQUESTED = 'user-reqested';

// const onSaveButtonClicked = event => {
//   console.log('click');

//   if ('caches' in window) {
//     caches.open(USER_REQUESTED).then(cache => {
//       cache.addAll(['https://httpbin.org/get', '/src/images/sf-boat.jpg']);
//     });
//   }
// };

const clearCards = () => {
  while (sharedMomentsArea.hasChildNodes()) {
    sharedMomentsArea.removeChild(sharedMomentsArea.lastChild);
  }
};

function createCard(data) {
  var cardWrapper = document.createElement('div');
  cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp';
  var cardTitle = document.createElement('div');
  cardTitle.className = 'mdl-card__title';
  cardTitle.style.backgroundImage = `url("${data.image}")`;
  cardTitle.style.backgroundSize = 'cover';
  cardTitle.style.height = '180px';
  cardWrapper.appendChild(cardTitle);
  var cardTitleTextElement = document.createElement('h2');
  cardTitleTextElement.className = 'mdl-card__title-text';
  cardTitleTextElement.textContent = data.title;
  cardTitleTextElement.style.color = 'white';
  cardTitle.appendChild(cardTitleTextElement);
  var cardSupportingText = document.createElement('div');
  cardSupportingText.className = 'mdl-card__supporting-text';
  cardSupportingText.textContent = data.location;
  cardSupportingText.style.textAlign = 'center';

  // const cardSaveButton = document.createElement('button');
  // cardSaveButton.innerText = 'save';
  // cardSupportingText.appendChild(cardSaveButton);
  // cardSaveButton.addEventListener('click', onSaveButtonClicked);

  cardWrapper.appendChild(cardSupportingText);
  componentHandler.upgradeElement(cardWrapper);
  sharedMomentsArea.appendChild(cardWrapper);
}

const updateUI = data => {
  clearCards();

  data.forEach(el => {
    createCard(el);
  });
};

const url = 'https://httpbin.org/get';
const dataUrl =
  'https://pwa-course-1b96b-default-rtdb.europe-west1.firebasedatabase.app/posts.json';
let networkDataRecived = false;

fetch(dataUrl)
  .then(function (res) {
    return res.json();
  })
  .then(function (data) {
    console.log('dane z fetcha');
    networkDataRecived = true;

    const dataArray = [];
    for (let key in data) {
      dataArray.push(data[key]);
    }

    updateUI(dataArray);
  });

if ('indexedDB' in window) {
  readAllData('posts').then(data => {
    if (!networkDataRecived) {
      console.log('from index', data);
      updateUI(data);
    }
  });
}
