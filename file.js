const loadLessions = () => {
    fetch("https://openapi.programming-hero.com/api/levels/all")
        .then((res) => res.json())
        .then((json) => displayLessions(json.data));
}


const loadLevelWord = (id) => {
    // console.log(id);
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    // console.log(url);

    fetch(url)
        .then((res) => res.json())
        .then(data => displayLevelWord(data.data));
};


const displayLevelWord = (words) => {
    // console.log(words);

    const wordContainer = document.getElementById('word-container');
    // wordContainer.innerHTML = "";

    words.forEach((word) => {
        // console.log(word);
        
        const card = document.createElement('div');
        card.className = "bg-[#FFFFFF] rounded-2xl shadow p-5";
        card.innerHTML = `
        <div class="space-y-4 text-center">
        <h4 class="text-[32px] font-bold text-[#000000]">${word.word}</h4>
        <p class="text-[20px] text-[#000000]">Meaning /Pronounciation</p>
        <p class="font-bangla text-[24px] font-semibold text-[#18181B]">"${word.meaning}/${word.pronunciation}"</p>
        </div>

        <div class="mt-5 flex justify-between">
        <button class="btn"><i class="fa-solid fa-circle-info"></i></button>
        <button class="btn"><i class="fa-solid fa-volume-high"></i></button>
        </div>
        `;

        wordContainer.appendChild(card);

    });
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
            <button onclick = "loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary border border-[#422AD5]"><i class="fa-solid fa-book-open"></i>Lesson -${lesson.level_no}</button>
        `;

        // 4. appendChild---
        levelContainer.appendChild(btnDiv);
    });

}

loadLessions();


