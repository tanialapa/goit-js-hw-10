
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';


const form = document.querySelector('.form');
form.addEventListener('submit', onSubmit);

function makePromise(delay, state) {
    return new Promise((resolve, reject) => {
        setTimeout(()=>{
             if(state === "fulfilled"){
         resolve(delay)
             } else {
                 reject(delay)
        }
         },delay)
       
    })
};


function onSubmit(e){
    e.preventDefault();
    const delay = Number(form.elements.delay.value);
    // console.log(delay);
    const state = form.elements.state.value;

    makePromise(delay, state).then(makeSuccess).catch(makeErorr);
    form.reset();
    
};

function makeSuccess(delay) {
  iziToast.success({
    message: `✅ Fulfilled promise in ${delay}ms`,
    position: 'topRight',
  });
}


function makeErorr(delay) {
  iziToast.error({
    message: `❌ Rejected promise in ${delay}ms`,
    position: 'topRight',
  });
}
