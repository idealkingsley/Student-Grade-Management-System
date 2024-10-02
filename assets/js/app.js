let localData = localStorage.getItem('studentRecords');
let studentRecords = !localData ? [] : JSON.parse(localData);
let btnAddStudent = document.getElementById('add-student-btn');
let btnSearchStudent = document.getElementById('search-student-btn');
let btnStudentAverage = document.getElementById('calculate-average-btn');
let btnStudentGrade = document.getElementById('record-grade-btn');

btnAddStudent.addEventListener('click', () => {
    let nameInput = document.getElementById('student-name');
    let name = nameInput.value.trim().toUpperCase();
    let regexp = /^[a-zA-Z ]*$/
    if (name == "") {
        // nameInput.focus();
        nameInput.style.borderColor = 'red';
    } else if (!regexp.test(name)) {
        nameInput.style.borderColor = 'red';
        // alert('A name does not contain a number or character')
    } else {
        nameInput.style.borderColor = 'green';

        let student = studentRecords.find(x => x.name.toUpperCase() == name);
        if (student) {
            alert('Student record already exist')
        } else {
            let studentRecord = {
                name,
                id: 'STU/000' + (studentRecords.length + 1),
                subjects: {}
            };

            studentRecords.push(studentRecord);
            updateLocalStorage();
            alert('added successfully');
            nameInput.value = ""
            showAllStudentData();
        }
    }
});

btnSearchStudent.addEventListener('click', () => {
    let studentIdInput = document.getElementById('student-id');
    let studentId = studentIdInput.value.trim().toUpperCase();

    if (studentId == '') {
        alert('enter the student id')
    } else {
        let student = studentRecords.find((x) => x.id == studentId);
        if (!student) {
            alert(`${studentId} was not found`)
            document.getElementById('response').innerHTML = '';
        } else {
            let resp = `<ul>
                <li>${student.name} - ${student.id}: Total - ${sumTotalScore(student.id)} | Average - ${averageScore(student.id)}</li>
            </ul>`;
            document.getElementById('response').innerHTML = resp;
        }
    }
});

btnStudentAverage.addEventListener('click', () => {
    let studentIdInput = document.getElementById('average-student-id');
    let studentId = studentIdInput.value.trim().toUpperCase();

    if (studentId == '') {
        alert('enter the student id')
    } else {
        document.getElementById('average-result').innerHTML = `Average: ${averageScore(studentId)}`
    }
});

btnStudentGrade.addEventListener('click', () => {
    let studentIdInput = document.getElementById('grade-student-id');
    let studentId = studentIdInput.value.trim().toUpperCase();
    let subject = document.getElementById('student-subject').value.trim().toUpperCase();
    let grade = document.getElementById('student-grade').value;

    if (studentId == '') {
        alert('enter the student id')
    } else {
        // check if the student exist in our record
        let student = studentRecords.find((x) => x.id == studentId);
        if (!student) {
            alert(`${studentId} was not found`)
            document.getElementById('response').innerHTML = '';
        } else {
            // retrieve the student Index to update
            let studentIndex = studentRecords.findIndex((x) => x.id == studentId);

            // add a subject key and value
            student.subjects[subject] = Number(grade);
            // update the student record
            studentRecords[studentIndex] = student;
            // update local storage
            updateLocalStorage();
            alert('Grade added successfully')
        }
    }
});

function updateLocalStorage() {
    localStorage.setItem('studentRecords', JSON.stringify(studentRecords));
}

function sumTotalScore(studentId) {
    let student = studentRecords.find(x => x.id === studentId);
    if (!student) return false;

    let subjects = student.subjects;
    let totalScore = 0;
    for (let subject in subjects) {
        totalScore += subjects[subject];
    }
    return totalScore;
}

function averageScore(studentId) {
    let totalScore = sumTotalScore(studentId);
    let subjects = returnSubjects(studentId);
    let numberOfSubjects = !subjects ? 0 : Object.keys(subjects).length;
    let average = totalScore / numberOfSubjects;

    return average.toFixed(2);
}

function returnSubjects(studentId) {
    let student = studentRecords.find(x => x.id === studentId);
    if (!student) return false;

    return student.subjects;
}

function showAllStudentData() {
    let resp = `<ul id="student-list">`;
    studentRecords.forEach(student => {
        resp += `<li>${student.name} - ${student.id}: Total - ${sumTotalScore(student.id)} | Average - ${averageScore(student.id)}</li>`;
    });
    resp += `</ul>`;

    document.getElementById('response2').innerHTML = resp;
}