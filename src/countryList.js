import retriveDataDetails from './countryDetails.js'
import Login from './index.js'

let i = 0
const regions = []

/* Async Api fetch function */
async function findcountry(resourses) {
  const result = await fetch(resourses)
  const data = await result.json()
  return data
}
/* debounce function to maintain function call */
export const debounce = (fn, delay) => {
  let timeoutId
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}
/* to increment and call datamap on loadmore event */
async function reDataMap() {
  i += 18
  const btn = document.querySelector('.show__more')
  btn.remove()
  dataMap('https://restcountries.com/v3.1/all', true)
}
/* fetch perticular country and calls data mapping function */
export async function countryDetailsLoad(capital) {
  const resourses = `https://restcountries.com/v3.1/capital/${capital}`
  const data = await findcountry(resourses)
  retriveDataDetails(data)
}
/* to call load countrydetails function and set sessionStorage to respective country */
function countryDetails(e, capital) {
  e.preventDefault()
  const mainContainer = document.querySelector('.main__container')
  mainContainer.remove()
  const searchContainer = document.querySelector('.search__container')
  searchContainer.remove()
  countryDetailsLoad(capital)
  sessionStorage.setItem('capital', `${capital}`)
}
/* to map data whenever called as in load more button is clicked */
async function dataMap(resourses, state) {
  const data = await findcountry(resourses)
  if (regions !== regions.length > 0) {
    data.map(items => regions.push(items.region))
  }
  const mainContainer = document.querySelector('.main__container')
  if (i < data.length) {
    data.slice(i, i + 18).map(item => {
      const country = document.createElement('div')
      country.classList = 'country'
      country.addEventListener('click', e => {
        countryDetails(e, item.capital)
      })
      country.innerHTML = `
      <div class='contry__flag'>
        <img id='imgSrc'
          src='${item.flags.svg}'
          alt='${item.name.common}/image'
        />
      </div>
      <div class='contry__details'>
        <h2>${item.name.common}</h2>
        <div class='population'>
          <span class='title'>Population :</span>
          <span>${item.population}</span>
        </div>
        <div class='region'>
          <span class='title'>Region :</span>
          <span>${item.region}</span>
        </div>
        <div class='capital'>
          <span class='title'>Capital : </span>
          <span>${item.capital}</span>
        </div>
      </div>          
    `
      mainContainer.appendChild(country)
      return undefined
    })
    if (state) {
      const btn = document.createElement('button')
      btn.classList = 'btn btn-info show__more'
      btn.innerHTML = 'show more'
      mainContainer.append(btn)
      btn.addEventListener('click', () => {
        reDataMap()
      })
    }
  }
}
/* function to fetch data whenever required and populating region only once on DOM loaded */
async function retrieveData(resourses, state) {
  const mainContainer = document.querySelector('.main__container')
  mainContainer.innerHTML = ''
  await dataMap(resourses, state)
  function regionPopulation() {
    const uniqueAndSortedRegions = [...new Set(regions)].sort()
    const selectRegion = document.querySelector('.select__region')

    selectRegion.innerHTML = ``
    const option1 = document.createElement('option')
    option1.innerHTML = `
      <option selected>Filter By Region</option>
    `
    selectRegion.appendChild(option1)
    uniqueAndSortedRegions.map(region => {
      const option = document.createElement('option')
      option.value = region
      option.innerHTML = `
        ${region}
        `
      selectRegion.appendChild(option)
      return undefined
    })
  }
  if (state) {
    regionPopulation();
  }
}
/* countryList page rendering function */
function countryList() {
  sessionStorage.setItem('countryList', true)
  const root = document.getElementById('root')
  root.innerHTML = ''
  root.innerHTML = `
    <div class='page2'>
      <div class='search__container'>
        <div class='search__country search__txt'>
          <i class='fa fa-search' aria-hidden='true'></i>
          <input
            type='text'
            id='search-by-country'
            placeholder='Search for a country'
          />
        </div>
        <div class='right'>
          <div class=' '>
            <select name='' class='select__region form-select' id='select__region'>
            </select>
          </div>
          <div class='log__out '>
          <button class='btn btn-primary log__outBTN'>Logout</button>
          </div>
        </div>
      </div>
      <div class='main__container'></div>
  </div>
  `
  function logOut() {
    sessionStorage.removeItem('country')
    sessionStorage.removeItem('countryList')
    Login()
  }
  const logoutbtn = document.querySelector('.log__outBTN')
  logoutbtn.addEventListener('click', logOut)

  const searchByCountry = document.querySelector('#search-by-country')
  const byRegion = document.querySelector('#select__region')
  let resourses = 'https://restcountries.com/v3.1/all'
  document.addEventListener('DOMContentLoaded', retrieveData(resourses, true))

  /* search function based on region */
  async function regionSearch(e) {
    e.preventDefault()
    if (e.target.value !== 'Filter By Region') {
      resourses = `https://restcountries.com/v3.1/region/${e.target.value}`
      retrieveData(resourses, false)
    } else {
      resourses = 'https://restcountries.com/v3.1/all'
      retrieveData(resourses, true)
    }
  }
  byRegion.addEventListener('change', regionSearch)

  /* search function based on input data */
  async function searchFunction(e) {
    e.preventDefault()
    if (e.target.value !== '') {
      resourses = `https://restcountries.com/v3.1/name/${e.target.value}`
      retrieveData(resourses, false)
    } else {
      resourses = 'https://restcountries.com/v3.1/all'
      retrieveData(resourses, true)
    }
  }
  searchByCountry.addEventListener('input', debounce(searchFunction, 500))
}
/* rendering list page function */
export function handleGoback() {
  countryList()
}
export default countryList
