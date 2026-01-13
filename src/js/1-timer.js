import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const btnStart = document.querySelector('[data-start]');
const input = document.querySelector('#datetime-picker');

const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

btnStart.isActive = true;

let userSelectedDate = null;
let intervalId = null;

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function updateClockFace({ days, hours, minutes, seconds }) {
  daysEl.textContent = days;
  hoursEl.textContent = hours;
  minutesEl.textContent = minutes;
  secondsEl.textContent = seconds;
}

updateClockFace({ days: '00', hours: '00', minutes: '00', seconds: '00' });

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const pickedDate = selectedDates[0];

    if (!pickedDate || pickedDate.getTime() <= Date.now()) {
      userSelectedDate = null;
      btnStart.isActive = true;

      iziToast.error({
        message: 'Please choose a date in the future',
        position: 'topRight',
      });

      return;
    }

    userSelectedDate = pickedDate;
    btnStart.isActive = false;
  },
};

flatpickr(input, options);

btnStart.addEventListener('click', () => {
  if (!userSelectedDate) {
    return;
  }

  btnStart.isActive = true;
  input.isActive = true;

  clearInterval(intervalId);

  intervalId = setInterval(() => {
    const deltaTime = userSelectedDate.getTime() - Date.now();

    if (deltaTime <= 0) {
      clearInterval(intervalId);
      intervalId = null;

      updateClockFace({
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00',
      });

      input.isActive = false;
      userSelectedDate = null;
      btnStart.isActive = true;

      return;
    }

    const { days, hours, minutes, seconds } = convertMs(deltaTime);

    function pad(value) {
      return String(value).padStart(2, '0');
    }

    updateClockFace({
      days: pad(days),
      hours: pad(hours),
      minutes: pad(minutes),
      seconds: pad(seconds),
    });
  }, 1000);
});






// const refs = {
//   days: document.querySelector('[data-days]'),
//   hours: document.querySelector('[data-hours]'),
//   mins: document.querySelector('[data-minutes]'),
//   secs: document.querySelector('[data-seconds]'),
// };

// function updateClockFace({ days, hours, mins, secs }) {
//   refs.days.textContent = days;
//   refs.hours.textContent = hours;
//   refs.mins.textContent = mins;
//   refs.secs.textContent = secs;
// }

// class Timer {
//   constructor(onTick) {
//     this.intervalID = null;
//     this.isActive = false;
//     this.onTick = onTick;
//     this.unit();
//   }

//   unit() {
//     this.onTick(this.getTimeComponents(0));
//   }

//   start() {
//     if (this.isActive) return;

//     const startTime = Date.now();
//     this.isActive = true;

//     this.intervalID = setInterval(() => {
//       const deltaTime = Date.now() - startTime;
//       const time = this.getTimeComponents(deltaTime);
//       this.onTick(time);
//     }, 1000);
//   }

//   stop() {
//     clearInterval(this.intervalID);
//     this.intervalID = null;
//     this.isActive = false;
//     this.unit();
//   }

//   getTimeComponents(time) {
//     const dayMs = 1000 * 60 * 60 * 24;
//     const hourMs = 1000 * 60 * 60;
//     const minMs = 1000 * 60;

//     const days = this.pad(Math.floor(time / dayMs));
//     const hours = this.pad(Math.floor((time % dayMs) / hourMs));
//     const mins = this.pad(Math.floor((time % hourMs) / minMs));
//     const secs = this.pad(Math.floor((time % minMs) / 1000));

//     return { days, hours, mins, secs };
//   }

//   pad(value) {
//     return String(value).padStart(2, '0');
//   }
// }

// const btnStart = document.querySelector('[data-start]');
// const timer = new Timer(updateClockFace);

// btnStart.addEventListener('click', () => timer.start());

// const btnStart = document.querySelector('[data-start]');
// const clockFace = document.querySelector('.clock-face');

// class Timer {
//   constructor({onTick}) {
//     this.intervalID = null;
//     this.isActive = false;
//     this.onTick = onTick;

//     this.unit();
//   }

//   unit() {
//     const time = this.getTimeComponents(0);
//     this.onTick(time);
//   }

//   start() {
//     const startTime = Date.now();
//     this.isActive = true;

//     this.intervalID = setInterval(() => {
//       const currentTime = Date.now();
//       const deltaTime = currentTime - startTime;

//       this.onTick(time);
//     }, 1000);
//   }

//   stop() {}

//   getTimeComponents(time) {
//     const hours = this.pad(
//       Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
//     );
//     const mins = this.pad(Math.floor((time % (1000 * 60 * 60)) / (1000 * 60)));
//     const secs = this.pad(Math.floor((time % (1000 * 60)) / 1000));

//     return { hours, mins, secs };
//   }

//   pad(value) {
//     return String(value).padStart(2, '0');
//   }
// }

// const timerOptions = {
//     onTick: updateClockFace,
// }
// const timer = new Timer(timerOptions)

// btnStart.addEventListener('click', timer.start.bind(timer));

// function updateClockFace({ hours, mins, secs }) {
//     clockFace.textContent = `${hours}:${mins}:${secs}`
// }
