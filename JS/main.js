function handleKeyDown(e) {
    if(e.which === 13) takeAndSearch();
}

var vocab = document.querySelector('div.info_word > .vocab')
var form = document.querySelector('div.info_word > .form') //array of strings
var ipa = document.querySelector('div.info_word > h4.ipa') //array of strings

var sound = document.querySelectorAll('div.info_word > h4.play')
var def = document.querySelector('div.info_word > h4.defs')
var syn = document.querySelector('div.info_word > h4.syns > span')
var exs = document.querySelector('div.info_word > h4.exs')

var us = {
    type: 'us.mp3',
    link: '',
    voice: new Audio('')
}

var uk = {
    type: 'uk.mp3',
    link: '',
    voice: new Audio('')
}

var au = {
    type: 'au.mp3',
    link: '',
    voice: new Audio('')
}

var accent = [us, uk, au]
function playUS() {
    us.voice.play()
}

function playUK() {
    uk.voice.play()
}

function playAU() {
    au.voice.play()
}

var inputFixed = document.querySelector('div.search_box > input')
inputFixed.value = 'dictionary'
takeAndSearch()

function clearRepeatedItems(arr) {
    return arr.filter((value, index) => {
        return arr.indexOf(value) === index && value !== ''
    })
}

function takeAndSearch() {
    var thatWord = document.querySelector('div.search_box > input').value
    var postAPI = `https://api.dictionaryapi.dev/api/v2/entries/en/${thatWord}`
    
    fetch(postAPI)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            if(data?.length) {
                var ipaStr = []
                var wordForms = []
                var voices = []
                var defs = []
                var syns = []
                var examples = []

                // const dataList = data.reduce((result, curr) => [...result, curr], [])            
                if(Array.isArray(data)) {
                    data.forEach((value, index) => {
                        vocab.innerHTML = value?.word

                        //take the international phonetic alphabet and the audios of the word
                        ipaStr.push(value?.phonetic || '')
                        value.phonetics?.forEach((item, index) => {
                            ipaStr.push(item?.text || '')

                            if(item?.audio.includes('.mp3')) voices.push(item.audio)
                        })

                        //take the word's forms, definitions, examples and synonyms
                        value?.meanings.forEach((item, index) => {
                            wordForms.push(item?.partOfSpeech || '')

                            item?.definitions?.forEach(e => {
                                defs.push(e?.definition || '')

                                examples.push(e?.example || '')
                            })

                            item?.synonyms.forEach(e => {
                                syns.push(e)
                            })
                        })  
                    })
                    
                }
                wordForms = clearRepeatedItems(wordForms)

                ipaStr = ipaStr.filter((value, index) => {
                    return ipaStr.indexOf(value) === index
                })
                if(ipaStr.length > 1) ipaStr = clearRepeatedItems(ipaStr)

                voices = clearRepeatedItems(voices)
                defs = clearRepeatedItems(defs)
                syns = clearRepeatedItems(syns)
                examples = clearRepeatedItems(examples)

                form.innerHTML = wordForms.join(', ')
                ipa.innerHTML = ipaStr.join(', ')


                //this block of code is to display the word's audios properly
                if(voices.length === 0) sound.forEach(item => {
                    item.style.display = 'none'
                })
                else {
                    accent.forEach(item => {
                        item.link = voices?.find(e => {
                            if(e.includes(item.type)) return e
                        }) || ''
                        item.voice = new Audio(item.link)
                    })
                    sound.forEach(item => {
                        item.style.display = accent.some(e => {
                            return item.classList.contains(e.type.substring(0, 2)) && e?.link
                        })?'inline':'none'
                    })  
                }

                //this block of code is to display the word's definitions
                var defStr = ''
                defs.forEach(item => {
                    defStr += '<p>- ' + item + '</p>'
                })
                def.innerHTML = `Definitions${defStr}`

                syn.innerHTML = syns.join(', ')

                if(examples.length > 0) {
                    var exStr = ''
                    examples.forEach(item => {
                        exStr += '<p>- ' + item + '</p>'
                    })
                    exs.innerHTML = `Examples:${exStr}`
                } 
                else exs.innerHTML = ''




            }
        })
}