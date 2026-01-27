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

btnStart.disabled = true;

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

function setZero() {
  updateClockFace({ days: '00', hours: '00', minutes: '00', seconds: '00' });
}

setZero();

function pad(value) {
  return String(value).padStart(2, '0');
}

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const pickedDate = selectedDates[0];

    if (!pickedDate || pickedDate.getTime() <= Date.now()) {
      userSelectedDate = null;
      btnStart.disabled = true;

      iziToast.error({
        message: 'Please choose a date in the future',
        position: 'topRight',
      });

      return;
    }

    userSelectedDate = pickedDate;
    btnStart.disabled = false;
  },
};

flatpickr(input, options);

btnStart.addEventListener('click', () => {
  if (!userSelectedDate) {
    return;
  }

  btnStart.disabled = true;
  input.disabled = true;

  clearInterval(intervalId);

  tick();
  intervalId = setInterval(tick, 1000);
});

function tick() {
  const deltaTime = userSelectedDate.getTime() - Date.now();

  if (deltaTime <= 0) {
    stopTimer();
    return;
  }

  const { days, hours, minutes, seconds } = convertMs(deltaTime);

  updateClockFace({
    days: pad(days),
    hours: pad(hours),
    minutes: pad(minutes),
    seconds: pad(seconds),
  });
}

function stopTimer() {
  clearInterval(intervalId);
  intervalId = null;

  setZero();

  input.disabled = false;
  userSelectedDate = null;
  btnStart.disabled = true;
}