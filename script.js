/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Mohamed Almatry',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'de-DE', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');
const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');
const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');
const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
//// Start The Functions

// Variables
let time = 120;

const updateUi = function (acc) {
  displayMovments(acc);
  CalcPrintBalance(acc);
  calcDisplaySummary(acc);
};

const formatCurr = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovments = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const now = new Date(acc.movementsDates[i]);
    const day = now.getDate() < 10 ? '0' + now.getDate() : now.getDate();
    const month =
      now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1;
    const year = now.getFullYear();

    const formattedMov = formatCurr(mov, acc.locale, acc.currency);
    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${day}/${month}/${year}</div>
          <div class="movements__value">${formattedMov}</div>
    </div>
    `;
    // containerMovements.innerHTML += html;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
const CalcPrintBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, curr) => acc + curr);
  const formattedMovDis = formatCurr(acc.balance, acc.locale, acc.currency);
  labelBalance.textContent = `${formattedMovDis}`;
};

const calcDisplaySummary = function (acc) {
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((mov, curr) => mov + curr);

  labelSumIn.textContent = `${formatCurr(income, acc.locale, acc.currency)}`;
  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((mov, curr) => mov + curr);
  labelSumOut.textContent = `${formatCurr(
    Math.abs(out),
    acc.locale,
    acc.currency
  )}`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(dep => (dep * acc.interestRate) / 100)
    .reduce((acc, curr) => acc + curr);

  labelSumInterest.textContent = `${formatCurr(
    interest,
    acc.locale,
    acc.currency
  )}`;
};

const creatUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
creatUserName(accounts);

const updateDate = function () {
  const now = new Date();
  const day = now.getDate() < 10 ? '0' + now.getDate() : now.getDate();
  const month =
    now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1;
  const year = now.getFullYear();
  const hour = now.getHours() < 10 ? '0' + now.getHours() : now.getHours();
  const min = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes();
  const second =
    now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds();
  labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}:${second}`;
};

setInterval(() => {
  updateDate();
}, 1000);

const startLogOutTimer = function () {
  theTimer = setInterval(() => {
    const min =
      Math.floor(time / 60) < 10
        ? `0${Math.floor(time / 60)}`
        : Math.floor(time / 60);
    const seconds = time % 60 < 10 ? `0${time % 60}` : time % 60;
    labelTimer.textContent = `${min}:${seconds}`;
    time--;
    if (time === 0) {
      clearInterval(theTimer);
      labelTimer.textContent = '00:00';
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
  }, 1000);

  return time;
};

//Event Handler

////////////

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  if (time) {
    if (time !== 120 && time !== 0) clearInterval(theTimer);
    time = 120;
  } else if (time === 0) time = 120;
  currentUser = accounts.find(acc => acc.username === inputLoginUsername.value);
  if (currentUser?.pin === Number(inputLoginPin.value)) {
    // Display Ui & Message
    labelWelcome.textContent = `Welcome, ${currentUser.owner.split(' ')[0]}`;
    containerApp.style.opacity = '100';
    // Clear Timers

    // Updating The Ui
    updateUi(currentUser);
    startLogOutTimer();
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const reciverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    reciverAcc &&
    currentUser.balance >= amount &&
    reciverAcc?.username !== currentUser.username
  ) {
    currentUser.movements.push(-amount);
    reciverAcc.movements.push(amount);
    currentUser.movementsDates.push(new Date().toISOString());
    reciverAcc.movementsDates.push(new Date().toISOString());
    updateUi(currentUser);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentUser.movements.some(mov => mov >= amount * 0.1)) {
    currentUser.movements.push(amount);
    currentUser.movementsDates.push(new Date().toISOString());
    updateUi(currentUser);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentUser.username &&
    Number(inputClosePin.value) === currentUser.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentUser.username
    );
    accounts.splice(index, 1);

    containerApp.style.opacity = 0;
  }
});
let TF = false;
btnSort.addEventListener('click', function () {
  displayMovments(currentUser.movements, TF);
  TF = !TF;
});

// setInterval(() => console.log(account1), 1000);
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/////////////////////////////////////////////////

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const euroToUsd = 1.1;

// const movementsUsd = movements.map(mov => Math.round(mov * euroToUsd));

// console.log(movements);
// console.log(movementsUsd);

// const deposit = movements.filter(mov => mov > 0);
// const withdrawal = movements.filter(mov => mov < 0);
// console.log(deposit);
// console.log(withdrawal);

// const balance = movements.reduce((acc, curr, i) => {
//   const test = acc + curr;
//   console.log(`Itreation ${i} : ${acc}`);
//   return test;
// });

// console.log(balance);

// const highestNum = movements.reduce((acc, curr) => {
//   if (curr > acc) acc = curr;
//   return acc;
// });

// console.log(highestNum);

// console.log(movements.every(mov => mov > 0));

// const test = [1, 2, [3, 4], [5, [6, 7]], [8, 9]];
// console.log(test.flat());

// const totalAccounts = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, curr) => acc + curr);
// console.log(totalAccounts);

// const totalAccounts2 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, curr) => acc + curr);

// console.log(totalAccounts2);

// const randomNumbers = Array.from({ length: 100 }, () =>
//   Math.floor(Math.random() * 100)
// );
// console.log(randomNumbers);

// console.log(isNaN(20));
// console.log(isFinite(20));

// console.log(Math);
// const bigNumber = 40000004000000000000040n;

// console.log(bigNumber);

// The New Internationalizing Api

// const now = new Date();
// const option = {
//   hour: 'numeric',
//   minute: 'numeric',
//   day: 'numeric',
//   year: 'numeric',
//   month: 'long',
// };
// const local = navigator.language;
// const theNewTime = new Intl.DateTimeFormat(local, option).format();

// console.log(theNewTime);
// console.log(local);
