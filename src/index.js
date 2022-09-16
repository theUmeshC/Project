/* eslint-disable linebreak-style */
import page2 from './page2.js'

const root = document.getElementById('root');
root.innerHTML = `
<div class='login__container'>
      <form class='login__form' id='formTag'>
        <h2 id='login__title'>LOGIN</h2>
        <input
          type='email'
          class='login__input form-control'
          placeholder='Username'
          id='login__userName'
        />
        
        <input
          type='password'
          class='login__input form-control'
          placeholder='password'
          id='login__password'
        />
        <small id='emailHelp' class='form-text'></small>
        <div class='checkbox-forgot'>
          <div class='checkbox-container'>
            <input type='checkbox' name='' id='login__checkbox' /><label
              id='checkbox__label'
              for='login__checkbox'
              >Remember me</label
            >
          </div>
          <a href='' id='forgot'>Forgot?</a>
        </div>
        <input
          type='submit'
          class='login__input'
          id='login__submitBtn'
          value='Login'
        />
      </form>
    </div>
`;
const userName = document.querySelector('#login__userName');
const password = document.querySelector('#login__password');
const form = document.querySelector('#formTag');

function formSubmit(e) {

  e.preventDefault();
  const userNameValue = userName.value;
  const passwordValue = password.value;
  const regularExpression = /^[a-zA-Z0-9!@#$%^&*]{6,16}$/;
  const errorMessage = document.querySelector('#emailHelp');

  if (userNameValue === '' || passwordValue === '') {
    errorMessage.style = 'visibility:visible;color:red';
    errorMessage.innerHTML = ' Enter Email and password';
    return;
  }

  if (!regularExpression.test(passwordValue)) {
    errorMessage.style = 'visibility:visible;color:red';
    errorMessage.innerHTML = ' password is incorrect should contain one Capital one symbol one number and contain characters in the range of 6-16 ';
    return;
  }

  page2();
}
form.addEventListener('submit', formSubmit);
