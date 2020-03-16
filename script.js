
const selectItem = (event, className, arrToUnselect) => {
  arrToUnselect.forEach(el => el.classList.remove(className)); 
  event.target.classList.add(className);
}
 
// header
let clickCnt = 0;
const menuElements = document.querySelectorAll('.navigation > li > a');

const menuSelected = (event) => {
  selectItem(event, 'active', menuElements);
}

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
  let direction = event.target.closest('a').id == "arrow_left" ? -1 : 1;

  moveSlider(direction);

  setTimeout( () => {
    draw(direction);  
    document.querySelectorAll('.slide__phone-area').forEach(el => el.addEventListener('click', switchDisplay));
  }, 0);  
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

const portfolioNav = document.querySelector('.portfolio__navigation').children;
const images = document.querySelectorAll('.portfolio__image');
const imagesDefaultSrc = Array.prototype.slice.call(images).map( el => el.src);

const setImageRandom = () => {
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

  for (let i = 0; i < images.length; i++)
    images[i].src = imagesDefaultSrc[randomPositions[i]];  
}

const moveImageLeft = () => {
  let first = images[0].src;
  for (let i = 1; i <= images.length; i++)
    images[i - 1].src = images[i % images.length].src;    
  
  images[images.length - 1].src = first;  
}

const moveImageRight = () => {
  let last = images[images.length - 1].src;
  for (let i = images.length - 1; i > 0; i--)
    images[i].src = images[i - 1].src;    
  
  images[0].src = last;  
}

const setImageDefault = () => {
  for (let i = 0; i < images.length; i++)
    images[i].src = imagesDefaultSrc[i];    
}

portfolioNav[0].addEventListener('click', setImageRandom);
portfolioNav[1].addEventListener('click', moveImageLeft);
portfolioNav[2].addEventListener('click', moveImageRight);
portfolioNav[3].addEventListener('click', setImageDefault);

menuElements.forEach(el => el.addEventListener('click', menuSelected));
portfolioImages.forEach(el => el.addEventListener('click', portfolioImageSelected));

// Get a Quote
const OK_BUTTON = document.getElementById('ok-btn');
const FORM = document.getElementById('feedback-form');

FORM.addEventListener('submit', (e) => {
  e.preventDefault();
  doModal();
  FORM.reset();
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
  document.getElementById('overlay-block').classList.add('hidden');
});