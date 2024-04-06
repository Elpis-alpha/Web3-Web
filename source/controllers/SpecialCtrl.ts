export const randomAmong = (num1: number, num2: number) => {

  return (Math.floor(Math.random() * (num2 - num1 + 1))) + num1

}

export const chooseFrom = <T>(arr: T[]) => {
  return arr[randomAmong(0, (arr.length - 1))]
}

export const shuffle = <T>(arr: T[]) => {
  let array = arr.slice()
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array
}

export const makeArray = <T>(func: () => T, count = 1) => {
  const array = Array(count).fill("").map(() => func())
  return array
}

export const getCookie = (name: string) => {

  let cookieValue = null;

  if (document.cookie && document.cookie !== '') {

    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {

      const cookie = cookies[i].trim();

      // Does this cookie string begin with the name we want?

      if (cookie.substring(0, name.length + 1) === (name + '=')) {

        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));

        break;

      }

    }

  }

  return cookieValue;

}

export const copyText = async (text: string) => {

  const normalCopy = async () => {
    const textArea = document.createElement('textarea')

    textArea.style.position = 'fixed'

    textArea.style.top = '0'

    textArea.style.bottom = '0'

    textArea.style.width = '2rem'

    textArea.style.height = '2rem'

    textArea.style.padding = '0'

    textArea.style.border = 'none'

    textArea.style.overflow = 'hidden'

    textArea.style.opacity = '0'

    textArea.style.outline = 'none'

    textArea.style.boxShadow = 'none'

    textArea.style.background = 'transparent'

    document.body.appendChild(textArea)

    textArea.focus()

    textArea.select()

    await navigator.clipboard.writeText(text)

    document.execCommand('copy')

    textArea.remove()

  }

  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text).then(null, () => {
      // If it fails
      normalCopy()
    }).catch(() => {
      // If it fails
      normalCopy()
    });
  }
}

export const requestFullScreen = (exit?: boolean) => {

  if (exit) { if (document.fullscreenElement !== null) { document.exitFullscreen() }; return false }

  const element = document.documentElement

  // @ts-ignore
  var requestMethod = element.requestFullscreen || element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullscreen;

  if (requestMethod) {

    requestMethod.call(element);

    // @ts-ignore
  } else if (typeof window.ActiveXObject !== "undefined") { // IE work

    // @ts-ignore
    var wscript = new ActiveXObject("WScript.Shell");

    if (wscript !== null) {

      wscript.SendKeys("{F11}");

    }

  }

  // document.exitFullscreen()  Use this to exit
}

export const scrollThrough = (vertical: number, horisontal = 0) => {

  window.scrollBy({ top: vertical, left: horisontal, behavior: 'smooth' });

}

export const capitalize = (str: string) => {

  return str.charAt(0).toLocaleUpperCase() + str.slice(1);

}

export const splitCapital = (str: string) => {

  let li = str.split('')

  li = li.map(s => {

    if (s === s.toUpperCase()) {

      return `-${s.toLowerCase()}`

    } else return s

  })

  return li.join('')

}

export const apostrophifyName = (name: string) => {

  const end = name.length - 1

  if (name[end] === 's') return name + "'"

  else return name + "'s"

}

export const reformImage = (e: any, removeNext = false, remove = true) => {

  const smallSize = e.currentTarget

  const fullSize = new Image()

  fullSize.src = smallSize.src.split('/').filter((value: string) => value !== 'blur').join('/')

  fullSize.onload = () => {

    try {

      fullSize.alt = smallSize.alt

      fullSize.title = smallSize.title

      if (smallSize.nextElementSibling && removeNext) smallSize.nextElementSibling.remove()

      if (remove) smallSize.replaceWith(fullSize)

    } catch (error) {


    }

  }

}

export const getQueryObject = (href = window?.location?.href) => {

  const params = (new URL(href)).searchParams;

  const urlParams: any = {}

  // @ts-ignore
  for (let p of params) {

    urlParams[p[0]] = p[1]

  }

  return urlParams

}

export const createQueryString = (queryObject: any) => {

  let queryString = "?"

  const queryKeys = Object.keys(queryObject).filter((key: string) => queryObject[key])

  for (const queryName of queryKeys) {

    const queryValue = queryObject[queryName];

    if (queryKeys.indexOf(queryName) === 0) {

      queryString = queryString + encodeURI(`${queryName}=${queryValue}`)

    } else {

      queryString = queryString + encodeURI(`&${queryName}=${queryValue}`)

    }

  }

  return queryString

}

export const formatNumber = (num: number) => {
  return num.toString().split(/(?=(?:\d{3})+(?:\.|$))/g).join(",");
}

export const shortenNumber = (number: number) => {
  const SI_POSTFIXES = ["", "k", "M", "G", "T", "P", "E"];
  const sign = number < 0 ? '-1' : '';
  const absNumber = Math.abs(number);
  const tier = Math.log10(absNumber) / 3 | 0;
  // if zero, we don't need a prefix
  if (tier == 0) return `${absNumber}`;
  // get postfix and determine scale
  const postfix = SI_POSTFIXES[tier];
  const scale = Math.pow(10, tier * 3);
  // scale the number
  const scaled = absNumber / scale;
  const floored = Math.floor(scaled * 10) / 10;
  // format number and add postfix as suffix
  let str = floored.toFixed(1);
  // remove '.0' case
  str = (/\.0$/.test(str)) ? str.substr(0, str.length - 2) : str;
  if (number > 900000000000000000000) return "∞"
  return `${sign}${str}${postfix}`;
}

export const padZeros = (num: number, size: number) => {
  let nume = num.toString();
  while (nume.length < size) nume = "0" + nume;
  return nume;
}

export const shortenWalletAddress = (address?: string, length = 4, ellipsisCount = 3) => {
  // Check if address is valid
  if (typeof address !== 'string' || address.length < 1) {
    return "invalid address"
  } else if (address.length < length) {
    return address
  }

  // Shorten the address by taking a substring of the specified length
  const prefix = address.slice(0, length);
  const suffix = address.slice(-length);

  // Construct the shortened address with ellipsis in between
  const shortenedAddress = prefix + '.'.repeat(ellipsisCount) + suffix;

  return shortenedAddress;
}

export const waitFor = async (milliseconds: number) => {
  await new Promise(resolve => setTimeout(() => { resolve(milliseconds) }, milliseconds))
}

export const validatePassword = (password: string) => {
  if (password.length < 6) return "Minimum of 6 characters."
  else if (password.search(/[a-z]/) < 0) return "Minimum of one lowercase letter."
  else if (password.search(/[A-Z]/) < 0) return "Minimum of one uppercase letter."
  else if (password.search(/[0-9]/) < 0) return "Minimum of one number."
  else return ""
}