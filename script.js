
const selectItem = (event, className, arrToUnselect) => {
  arrToUnselect.forEach(el => el.classList.remove(className)); 
  let target = event.target ? event.target : document.querySelector(`.navigation > li > a[href*=${event}]`);
  target.classList.add(className);
}
 
// header
let clickCnt = 0;
const menuElements = document.querySelectorAll('.navigation > li > a');

const menuSelected = (event) => {
  selectItem(event, 'active', menuElements);
}

let blocksPosition = [];

const getBlocksPosition = () => {
  const wrappers = document.querySelectorAll('.wrapper');

  wrappers.forEach((el) => {
    if (el.getAttribute('id'))
      blocksPosition.push({id: el.getAttribute('id'), startY: el.offsetTop, endY: el.offsetTop + el.offsetHeight})         
  })
  blocksPosition[0].endY += 600;
}

getBlocksPosition();

const onScroll = () => {
    const activePos = window.scrollY; 

    for (let i = 0; i < blocksPosition.length; i++)      
      if (blocksPosition[i].startY - (blocksPosition[i].endY - blocksPosition[i].startY) / 2 <= activePos 
          && blocksPosition[i].endY > activePos) {
            selectItem(blocksPosition[i].id, 'active', menuElements);        
          }
  }

menuElements.forEach(el => el.addEventListener('click', menuSelected));
document.addEventListener('scroll', onScroll);

// slider
const SLIDER = document.querySelector('.slider');
const sliderWidth = 1020;
let index = 0;
let slidesD = document.querySelectorAll('.slider__slide');
let slidesPosition = [0, sliderWidth];
let isNotFirstRun = false;

const draw = (direction) => {
  slidesD = document.querySelectorAll('.slider__slide');
  slidesPosition.map(el => el * direction);
  index = 0;

  if (isNotFirstRun)    
    for (let i = 0; i < slidesD.length; i++)
    slidesPosition[i] = parseInt(slidesD[i].style.left);
  else
    isNotFirstRun = true;  

  slidesPosition[index] = slidesPosition[index] - sliderWidth * direction;
  slidesD[index].style.left = slidesPosition[index] + 'px';
  index++;

  if (index % slidesD.length == 0)
    index = 0;
  slidesPosition[index] = slidesPosition[index] - sliderWidth * direction;
  slidesD[index].style.left = slidesPosition[index] + 'px';
}

function moveSlider(direction) {  
  let t = index - 1 >= 0 ? index - 1 : slidesD.length - 1;

  if (slidesPosition[t] == 1020) 
    if (direction == -1)
      slidesPosition[t] = slidesPosition[t] - 2 * sliderWidth;
    else 
      null;
  else
    if (direction == 1)
      slidesPosition[t] = slidesPosition[t] + 2 * sliderWidth;

  let element = slidesD[t].cloneNode(true);
  SLIDER.removeChild(slidesD[t]);
  element.style.left = slidesPosition[t] + 'px';
  SLIDER.appendChild(element);
}

function slide(event) {
  document.getElementById(event.target.closest('a').id).removeEventListener('click', slide);

  let direction = event.target.closest('a').id == "arrow_left" ? -1 : 1;

  moveSlider(direction);

  setTimeout( () => {
    draw(direction);  
    document.querySelectorAll('.slide__phone-area').forEach(el => el.addEventListener('click', switchDisplay));
  }, 10); 

  document.querySelector('.slider__slide').addEventListener('transitionend', () => {    
    document.getElementById(event.target.closest('a').id).addEventListener('click', slide);
  });
}

document.querySelector('.arrow_left').addEventListener('click', slide);
document.querySelector('.arrow_right').addEventListener('click', slide);

//Phone screenOFF
let screenState = {vert: false, horz: false};

const switchDisplay = (event) => {
  let targetId = event.target.id ? event.target.id : event.target.offsetParent.id;

  if (!screenState[targetId]) {
    let blackDiv = document.createElement('div');
    blackDiv.classList.add('screen-off-' + targetId);

    event.target.appendChild(blackDiv);
    screenState[targetId] = true;
  }
  else {
    screenState[targetId] = false;
    document.querySelector('.screen-off-' + targetId).remove();
  } 
}

document.querySelectorAll('.slide__phone-area').forEach(el => el.addEventListener('click', switchDisplay));

//portfolio
const portfolioImages = document.querySelectorAll('.portfolio__image');
const portfolioImageSelected = (event) => {
  selectItem(event, 'image_selected', portfolioImages);
}

const portfolioNav = document.querySelector('.portfolio__navigation');
const portfolioLinks = document.querySelectorAll('.portfolio__link');
const portfolioNavSelected = (event) => {
  selectItem(event, 'portfolio__link_selected', portfolioLinks);
}

const imageContainer = document.querySelector('.layout-4-column');

const moveImageRandom = () => {
  let images = document.querySelectorAll('.portfolio__image'); 
  let positionsSet = new Set(Array(12).fill(1).map((a,i) => i));
  let rndPosition = 0;
  let randomPositions =[];

  while (positionsSet.size  > 0) {
    rndPosition = Math.floor(Math.random() * Math.floor(images.length + 1));
    if (positionsSet.has(rndPosition)) {
      randomPositions.push(rndPosition);
      positionsSet.delete(rndPosition);
    }
  }

  imageContainer.innerHTML = '';
  for (let i = 0; i < images.length; i++)
    imageContainer.append(images[randomPositions[i]])
}

const moveImageLeft = () => {
  let images = document.querySelectorAll('.portfolio__image');
  let first = imageContainer.removeChild(images[0]);
  imageContainer.append(first);
}

const moveImageRight = () => {
  let images = document.querySelectorAll('.portfolio__image');
  let last = imageContainer.removeChild(images[images.length - 1]);
  imageContainer.prepend(last);
}

const moveTwoDirections = () => {
  let images = document.querySelectorAll('.portfolio__image');
  let left = imageContainer.removeChild(images[Math.trunc(images.length / 2) - 1]);
  let right = imageContainer.removeChild(images[Math.trunc(images.length / 2)]);

  imageContainer.prepend(left);
  imageContainer.append(right); 
}

const shuffleImages = (event) => {
  switch (event.target.id) {
    case 'all':
      moveImageRandom();
      portfolioNavSelected(event);
      break;
    case 'web-design':
      moveImageLeft();
      portfolioNavSelected(event);
      break;
    case 'graphic-design':
      moveImageRight();
      portfolioNavSelected(event);
      break;
    case 'artwork':
      moveTwoDirections();
      portfolioNavSelected(event);
      break;
  }    
}

portfolioNav.addEventListener('click', shuffleImages);
portfolioImages.forEach(el => el.addEventListener('click', portfolioImageSelected));

// Get a Quote
const OK_BUTTON = document.getElementById('ok-btn');
const FORM = document.getElementById('feedback-form');

FORM.addEventListener('submit', (e) => {
  e.preventDefault();
  doModal();  
  return false;
  }
);

const doModal = () => {
  const subject = document.getElementById('subject').value;
  const describe = document.getElementById('describe').value;

  const isValidName = document.getElementById('name').checkValidity();
  const isValidEmail = document.getElementById('email').checkValidity();

  if (isValidName && isValidEmail) {
    if (subject)
      document.getElementById('message-subject').innerText = 'Тема: ' + subject;
    if (describe)
      document.getElementById('message-describe').innerText = 'Описание: ' + describe;

    document.getElementById('overlay-block').classList.remove('hidden');
  }
};

OK_BUTTON.addEventListener('click', () => {
  FORM.reset();
  document.getElementById('overlay-block').classList.add('hidden');  
});