import { createApi } from 'unsplash-js';

const main = document.querySelector('#main');
var favouriteList=[];
var photos=[];
const unsplash = createApi({
  accessKey: 'r93QsYpf4Q775qZAeKDzadDVW1imO7bHAnTrTe_v2I0'
});
var favouriteFlag;
callApi('wonders');

const atags=document.querySelectorAll('.navclick');
atags.forEach((atag)=>{
  atag.addEventListener('click',(event)=>{
    event.preventDefault();
    const value=atag.dataset.value;
    
    console.log(event,value);
    if (value=='Favourite') {
      favouriteFlag=true;
      favouriteFunc();
      
    }else{
      favouriteFlag=false;
      callApi(value);
    }
  });
});

function callApi(params) {
  
  unsplash.search.getPhotos({
    query: params,
    page: 1,
    perPage: 20,
    orientation: 'portrait'
  }).then(res => {
    if (res?.type == 'success') {
      main.innerHTML='';
      console.log("res:", res);
      photos = res?.response?.results;
      const getPhotosUrls = photos.map((val) => {
        return `<img height="300" width="300" style="border: 1px solid transparent;
        border-radius: 20px;margin-left: 35px;
        margin-bottom: 35px;cursor: pointer;" src="${val.urls.small}" title="${val?.alt_description}"/>`
      });

      console.log(getPhotosUrls);
      let tempContainer=document.createElement('div');
      getPhotosUrls.forEach((imgVal,index)=>{
        let tempDiv=document.createElement('div');
        tempDiv.innerHTML=imgVal;
        let imageElement=tempDiv.firstChild;
        imageElement.addEventListener('click',()=>{
          imageElement.style.filter="brightness(0.5)";
          imageClick(photos[index]);
        });
        tempContainer.appendChild(imageElement);
      });
      main.appendChild(tempContainer); 
      
    }
  });
}

function imageClick(params) {
  params.liked_by_user=true;
  let message="Do you wand to add " + params?.alt_description + " by " + params?.user?.name + " to favourites ?";
  let res=window.confirm(message);
  if(res){
    console.log('params',params);
    favouriteList.push(params);
    let favouriteLists=favouriteList;
    localStorage.setItem('FavouriteList',JSON.stringify(favouriteLists));
  }else{}
}

function imageClicktoRemove(params){
  params.liked_by_user=false;
  document.querySelector('img').style.filter="brightness(0.5)";
  let message="Do you wand to remove " + params?.alt_description + " by " + params?.user?.name + " from favourites ?";
  let res=window.confirm(message);
  if(res){
    console.log('params',params);
    const newFavouriteList= favouriteList.filter((val)=>{
      return val?.id !== params?.id;
    });
    let favouriteLists=newFavouriteList;
    localStorage.setItem('FavouriteList',JSON.stringify(favouriteLists));
    favouriteFunc();
  }else{}
}


function favouriteFunc(){
  console.log("favourite called");
  if(favouriteFlag==true){
    main.innerHTML='';
    favouriteList=JSON.parse(localStorage.getItem('FavouriteList'));
    console.log("favouriteList",favouriteList);
    const favouriteUrls=favouriteList.map((val)=>{
      return `<img height="300" width="300" style="border: 1px solid transparent;
      border-radius: 20px;margin-left: 35px;
      margin-bottom: 35px;cursor: pointer;" src="${val.urls.small}" title="${val?.alt_description}"/>`
    });
      let tempContainer=document.createElement('div');
      favouriteUrls.forEach((imgVal,index)=>{
        let tempDiv=document.createElement('div');
        tempDiv.innerHTML=imgVal;
        let imageElement=tempDiv.firstChild;
        imageElement.addEventListener('click',()=>{
          imageElement.style.filter="brightness(0.5)";
          imageClicktoRemove(favouriteList[index]);
        });
        tempContainer.appendChild(imageElement);
      });
      main.appendChild(tempContainer);
  }
}