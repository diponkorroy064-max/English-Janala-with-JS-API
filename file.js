// **** lesson buttons related function----
const loadLessionsBtn = async () => {
    // promise of response---
    const res = await fetch("https://openapi.programming-hero.com/api/levels/all");
    // promise of json data---
    const json = await res.json();
    displayLessionsBtn(json.data);
};
loadLessionsBtn();

// **** lesson buttons related function----
const displayLessionsBtn = (lessons) => {
    // console.log(lessons);
    // 1. get the container and empty---
    const levelContainer = document.getElementById("level-container");

    levelContainer.innerHTML = "";

    // 2. get into every lession---
    lessons.forEach(lesson => {
        // console.log(lesson);
        // 3. create a element---
        const btnDiv = document.createElement('div');
        btnDiv.innerHTML = `
            <button id="lesson-btn-${lesson.level_no}" onclick = "loadLevelWordCards(${lesson.level_no})" class="btn btn-outline btn-primary border border-[#422AD5] lesson-btns"><i class="fa-solid fa-book-open"></i>Lesson - ${lesson.level_no}</button>
        `;

        // 4. appendChild---
        levelContainer.appendChild(btnDiv);
    });
};

// **** Active lessions button related function----
const removeActive = () => {
    const lessonBtns = document.querySelectorAll('.lesson-btns');
    // console.log(lessonBtns);
    lessonBtns.forEach(btn => btn.classList.remove("active"));
};



// #### loading all words based on id----
const loadLevelWordCards = async (id) => {
    // console.log(id);

    manageSpiner(true);

    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    // console.log(url);

    const res = await fetch(url);
    const json = await res.json();
    // console.log(json.data);

    removeActive();   //remove all active class---
    const clickBtn = document.getElementById(`lesson-btn-${id}`);
    clickBtn.classList.add('active');   //add active class---
    // console.log(clickBtn);

    // manageSpiner(true);
    displayLevelWordCards(json.data);
};

// #### display all cards----
const displayLevelWordCards = (wordsArr) => {
    // console.log(wordsArr);

    const wordContainer = document.getElementById('word-container');
    wordContainer.innerHTML = "";

    // এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।----
    if (wordsArr.length == 0) {
        wordContainer.innerHTML = `
        <div class="col-span-full text-center space-y-5">
        <div class="flex justify-center"><img src="assets/alert-error.png" alt="">
        </div>
        <p class="text-[#79716B] text-[16px]">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
        <p class="text-4xl font-bangla text-[#292524]">নেক্সট Lesson এ যান</p>
        </div>
        `;
        manageSpiner(false);
        return;
    }

    // all cards rendering----
    wordsArr.forEach((word) => {
        // console.log(word);

        const card = document.createElement('div');
        card.className = "bg-[#FFFFFF] rounded-2xl shadow p-5";
        card.innerHTML = `
        <div class="space-y-4 text-center">

        <h4 class="text-[32px] font-bold text-[#000000]">${word.word ? word.word : "Word Not Found"}</h4>

        <p class="text-[20px] text-[#000000]">Meaning /Pronounciation</p>

        <p class="font-bangla text-[24px] font-semibold text-[#18181B]">"${word.meaning ? word.meaning : "NOT FOUND"}/${word.pronunciation ? word.pronunciation : "NOT FOUND PRONUNCIATION"}"</p>
        </div>

        <div class="mt-5 flex justify-between">
        <button onclick="loadWordDetailModals(${word.id})" class="btn"><i class="fa-solid fa-circle-info"></i></button>

        <button onclick="pronounceWord('${word.word}')" class="btn"><i class="fa-solid fa-volume-high"></i></button>
        </div>
        `;
        wordContainer.appendChild(card);
    });
    manageSpiner(false);
};



// @@@ Load Modal detail worlds----
const loadWordDetailModals = async (id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`;
    // console.log(url);
    const res = await fetch(url);
    const details = await res.json();
    // console.log(details);
    displayWordDetailModals(details.data);
};

// @@@ display word details by modal----
const displayWordDetailModals = (word) => {
    // console.log(word);

    const detailsContainer = document.getElementById('details_container');
    detailsContainer.innerHTML = `
        <div class="space-y-4">
            <h2 class="text-2xl font-bold">${word.word} (<i class="fa-solid fa-microphone-lines"></i>: ${word.pronunciation})</h2>
                
            <h3 class="font-bold">Meaning</h3>
                
            <h3 class="font-bangla font-medium">${word.meaning}</h3>
                
            <h3 class="font-bold">Example</h3>
                
            <p>${word.sentence}</p>
            
            <p class="font-bold">সমার্থক শব্দ গুলো</p>

            <div>${createElements(word.synonyms)}</div>
        </div>
    `;
    document.getElementById('my_modal').showModal();
};

// @@@ show synnomyms in Modals from Array----
const createElements = (arr) => {
    if (arr.length == 0) {
        return "No Synnonyms";
    }
    else {
        const htmlElements = arr.map((el) => `<span class="badge badge-outline badge-warning">${el}</span>`);
        return htmlElements.join(" ");
    }
};



// ===> Spiner Loading Functionalities----
const manageSpiner = (status) => {
    if (status == true) {
        document.getElementById('spiner').removeAttribute('hidden');
        document.getElementById('word-container').setAttribute('hidden', 'string');
    }
    else {
        document.getElementById('spiner').setAttribute('hidden', 'string');
        document.getElementById('word-container').removeAttribute('hidden');
    }
};



// &&&& Implement Search Button Functionality----
document.getElementById('btn-search').addEventListener('click', () => {
    removeActive();

    const input = document.getElementById('input-search');
    const searchValue = input.value.trim().toLowerCase();
    // console.log(searchValue);

    fetch("https://openapi.programming-hero.com/api/words/all")
        .then(res => res.json())
        .then((data) => {
            const allWords = data.data;
            // console.log(allWords);
            const filterWords = allWords.filter(word => word.word.toLowerCase().includes(searchValue));
            // console.log(filterWords);
            displayLevelWordCards(filterWords);
        });
});


// ###==> Speaking functionality in card's sound btn----
function pronounceWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-EN"; // English
    window.speechSynthesis.speak(utterance);
};

