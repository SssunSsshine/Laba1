/*e) Спортсмен может прыгнуть секвенцию из двух прыжков - она похожа на каскад,
 но вторым прыжком может быть только аксель. При вводе запись происходит следующим образом: 2T+2A+SEQ. 
 Базовая стоимость секвенции равна 80% от суммы базовых стоимостей двух прыжков. 
 При этом GoE будет применяться к полной стоимости самого дорогого из двух прыжков. 
 Так, если прыгнуть 3T+2A+SEQ, то базовая стоимость будет равна 6.00 (80% от 3.30+4.20), а GoE будет применяться к 4.20 (стоимость тройного тулупа),
 Если прыгнуть 3T+3A+SEQ, базовая стоимость станет равна 9.76 (80% от 8.00+4.20), но GoE будет применяться к 8.00 (стоимость тройного акселя).
 */

"use strict";

const JumpBC = {
    "1T": 0.4,
    "1S": 0.4,
    "1LO": 0.5,
    "1F": 0.5,
    "1LZ": 0.6,
    "1A": 1.1,
    "2T": 1.3,
    "2S": 1.3,
    "2LO": 1.7,
    "2F": 1.8,
    "2LZ": 2.1,
    "2A": 3.3,
    "3T": 4.2,
    "3S": 4.3,
    "3LO": 4.9,
    "3F": 5.3,
    "3LZ": 5.9,
    "3A": 8,
    "4T": 9.5,
    "4S": 9.7,
    "4LO": 10.5,
    "4F": 11,
    "4LZ": 11.5,
    "4A": 12.5,
};

function summa(pNums, pBc) {
    let sc;
    let s = 0
    let max = Math.max(...pNums);
    let min = Math.min(...pNums);

    max = pBc * max / 10;
    min = pBc * min / 10;

    pNums.forEach(function (n) {
        sc = pBc * n / 10;
        s = s + sc;
    });

    s = s - min - max;
    return s;
}//summa

//конструктор объекта
function Jump(jump1, marks, jump2) {
    this.jump1 = jump1;
    this.marks = marks;
    this.bc = JumpBC[jump1];

    if (jump2) {
        this.jump2 = jump2;
        this.SEQ = true;
        this.bc1 = JumpBC[jump2];
        this.toString = () => {
            return `${this.jump1}+${this.jump2}+SEQ: ${this.Score()}\n`;
        }
    }
    else {
        this.toString = () => {
            return `${this.jump1}: ${this.Score()}\n`;
        }
    }

    this.Score = () => {
        let bc;
        let score;
        if (this.SEQ) {
            bc = Math.max(this.bc, this.bc1);
            score = (this.bc + this.bc1) * 0.8 + summa(this.marks, bc) / 7;
        }
        else {
            score = this.bc + summa(this.marks, this.bc) / 7;
        }
        return +score.toFixed(2);
    }
}

//Проверка введенных данных, возвращает массив объектов
function InputCheck() {
    let arrInp = [];
    let str;
    let jump2;
    let jump1;
    let isCor = true;
    let jumpArr;
    let marks;
    const amount = 9;

    str = prompt("Enter the data");
    while ((str != null) && (str != "")) {
        str = str.trim().toUpperCase();
        let jump = {};

        [jumpArr, ...marks] = str.split(/\s+/);
        jumpArr = jumpArr.split('+');

        if (jumpArr.length > 3 || marks.length != amount) {
            alert("Error! Repeat input");
        }
        else {
            if (str.includes("SEQ")) {
                jump1 = jumpArr[0];
                jump2 = jumpArr[1];

                //Проверка на существование и допустимость введеных прыжков
                isCor = jump2.includes("A") && jump1 in JumpBC && jump2 in JumpBC;
                if (isCor) {
                    jump = new Jump(jump1, marks, jump2);
                }
            }
            else {
                //Проверка на существование прыжка
                isCor = jumpArr in JumpBC;
                if (isCor) {
                    jump = new Jump(jumpArr, marks);
                }
            }

            if (isCor) {

                function isCorrect(el) {
                    return (!isNaN(el) && Number(el) >= -5 && Number(el) <= 5);
                }

                if (!(jump.marks.every(isCorrect))) {
                    alert("Error! Repeat input");
                }
                else {
                    arrInp.push(jump);
                }
            }
            else {
                alert("Error! Repeat input");
            }
        }
        str = prompt("Enter the data");
    }//while
    return arrInp;
}//InputCheck


//Расчет результатов, возвращает строку для вывода
function Calculate() {
    let arrInp = []; //массив объектов
    let sumScore = 0;

    arrInp = InputCheck();
    let outstr;
    let score;

    //Расчет GOe баллов
    outstr = arrInp.reduce(function (out, jump) {
        score = jump.Score();
        out += jump.toString();
        sumScore += score;
        return out;
    }, "");//reduce

    //Добавление общей оценки
    outstr += "Sum: " + sumScore.toFixed(2);

    return outstr;
}//Calculate

//Вывод
function Print() {
    let str = Calculate();

    if (str.length != 0) {
        alert(str);
    }

}//Print

Print();


