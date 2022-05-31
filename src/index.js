import './css/styles.css';
import Notiflix from 'notiflix'
import template from './template.hbs'
import ApiSearch from './fetchPics.js'
import SimpleLightbox from "simplelightbox"
import "simplelightbox/dist/simple-lightbox.min.css"
 
 
const apiSearch = new ApiSearch()
const formEl = document.querySelector('.search-form')
const gallery = document.querySelector('.gallery') 
const loadMoreBtn = document.querySelector('.load-more')
 
 

loadMoreBtn.classList.add('is-hidden')

formEl.addEventListener('submit', onFormSubmit)
loadMoreBtn.addEventListener('click', fetchAndRenderSmooth)
gallery.addEventListener("click", onImgClick)

function onImgClick(event) {
    event.preventDefault()
}
 
function onFormSubmit(event) {
    event.preventDefault()
    apiSearch.searchedItems = event.currentTarget.elements.searchQuery.value
    let trimedSearchedItems = apiSearch.searchedItems.trim()
        
    if (trimedSearchedItems) {
       apiSearch.fetchTotalHits().then(totalHitsNotification).catch(error => { Notiflix.Notify.failure(error)})
  
    clearGallery()
    apiSearch.resetItems()
        
    fetchAndRender()
 }
  
    
}

 

function renderMarkup(item) {
    gallery.insertAdjacentHTML('beforeend', template(item))

    if (item.length === 0) {
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
    }
    if ( item.length > 0 && item.length < 40) {
            Notiflix.Notify.warning(`We're sorry, but you've reached the end of search results.`)
          loadMoreBtn.classList.add('is-hidden')
    }
}
   

function clearGallery() {
    gallery.innerHTML = ''
}

 
function totalHitsNotification(totalHits) {
    if (totalHits > 0) {
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`)
        
    loadMoreBtn.classList.remove('is-hidden')
    } 
}


 async function fetchAndRender(){
     loadMoreBtn.setAttribute('disabled', true)
     loadMoreBtn.textContent = "Loading..."
     try {
         const pics = await apiSearch.fetchPics()
         const renderPics = await renderMarkup(pics)
         
         const lightbox = new SimpleLightbox('.gallery .photo-card a');
        //  lightbox.refresh()
             if (!renderPics) {
         loadMoreBtn.removeAttribute('disabled', true)
          loadMoreBtn.textContent = "Load more"
         }
     } catch(error) {
        console.log(error);
     }
  
}
 

 async function fetchAndRenderSmooth(){
     loadMoreBtn.setAttribute('disabled', true)
     loadMoreBtn.textContent = "Loading..."

        
         
     try {
         const pics = await apiSearch.fetchPics()
         const renderPics = await renderMarkup(pics)

        const lightbox = new SimpleLightbox('.gallery .photo-card a');
         lightbox.refresh()
         
   smoothScroll()

     if (!renderPics) {
         loadMoreBtn.removeAttribute('disabled', true)
         loadMoreBtn.textContent = "Load more"
         }
     } catch(error) {
        console.log(error);
     }
         
}
 


 function smoothScroll(){
 
        const { height: cardHeight } = document
         .querySelector(".gallery")
         .firstElementChild.getBoundingClientRect();
 
         window.scrollBy({
         top: cardHeight  * 2.9,
         behavior: "smooth",
 
 })
}
   