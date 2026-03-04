const loadLessions = () => {
    fetch("https://openapi.programming-hero.com/api/levels/all")
        .then((res) => res.json())
        .then((json) => displayLessions(json.data));
};


const removeActive = () => {
    const lessonBtns = document.querySelectorAll('.lesson-btns');
    // console.log(lessonBtns);
    lessonBtns.forEach(btn => btn.classList.remove("active"));
}


const loadLevelWord = (id) => {
    // console.log(id);

    manageSpiner(true);

    const url = `https://openapi.programming-hero.com/api/level/${id}`;

    // console.log(url);

    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            removeActive();   //remove all active class---
            const clickBtn = document.getElementById(`lesson-btn-${id}`);
            clickBtn.classList.add('active'); //add active class---
            // console.log(clickBtn);

            displayLevelWord(data.data)
        });
};


const loadWordDetail = async (id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`;
    // console.log(url);
    const res = await fetch(url);
    const details = await res.json();
    // console.log(details);
    displayWordDetail(details.data);
}


const createElements = (arr) => {
    const htmlElements = arr.map((el) => `<span class="btn">${el}</span>`);
    return htmlElements.join(" ");
};


const manageSpiner = (status) => {
    if (status == true) {
        document.getElementById('spiner').removeAttribute('hidden');
        document.getElementById('word-container').getAttribute('hidden');
    }
    else {
        document.getElementById('word-container').getAttribute('hidden');
        document.getElementById('spiner').removeAttribute('hidden');
    }
};


const displayWordDetail = (word) => {
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


const displayLevelWord = (words) => {
    // console.log(words);

    const wordContainer = document.getElementById('word-container');
    wordContainer.innerHTML = "";

    // const nextLesson = document.getElementById('next-lesson');
    if (words.length == 0) {
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

    words.forEach((word) => {
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
        <button onclick="loadWordDetail(${word.id})" class="btn"><i class="fa-solid fa-circle-info"></i></button>

        <button class="btn"><i class="fa-solid fa-volume-high"></i></button>
        </div>
        `;

        wordContainer.appendChild(card);

    });
    manageSpiner(false);
};


const displayLessions = (lessonns) => {
    // 1. get the data and empty---
    const levelContainer = document.getElementById("level-container");

    levelContainer.innerText = "";

    // 2. get into every lession---
    lessonns.forEach(lesson => {
        // 3. create element---
        const btnDiv = document.createElement('div');
        btnDiv.innerHTML = `
            <button id="lesson-btn-${lesson.level_no}" onclick = "loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary border border-[#422AD5] lesson-btns"><i class="fa-solid fa-book-open"></i>Lesson -${lesson.level_no}</button>
        `;

        // 4. appendChild---
        levelContainer.appendChild(btnDiv);
    });

}


loadLessions();


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
            displayLevelWord(filterWords);
        });
});

